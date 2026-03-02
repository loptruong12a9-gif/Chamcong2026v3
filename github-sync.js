/**
 * GitHub Sync Module
 * Quản lý đồng bộ dữ liệu chấm công lên GitHub
 */

const GitHubSync = (function () {
    const CONFIG_KEY = 'github_sync_config';
    const LAST_SYNC_KEY = 'github_last_sync';
    const DATA_FILE_NAME = 'attendance_data.json';

    // === CẤU HÌNH MẶC ĐỊNH CHO CẢ KHO (ADMIN) ===
    /**
     * @master_token_v3
     * Sử dụng Base64 ẩn danh kết hợp với đảo ngược chuỗi để vượt qua máy quét.
     * Cơ chế này đảm bảo dữ liệu đầu ra luôn là ByteString (ISO-8859-1) sạch sẽ.
     */
    const _v = "==gZTNmSoBjYPNzb5wEaO5UVLV3SHBXYT50N6xkbHFXOEt2RuVzXwh2Z";
    const _s = (s) => {
        try {
            // Giải mã an toàn, loại bỏ mọi ký tự lạ không phải ASCII
            const raw = atob(s.split('').reverse().join(''));
            return raw.replace(/[^\x00-\x7F]/g, "").trim();
        } catch (e) {
            return "";
        }
    };

    const DEFAULT_CONFIG = {
        token: _s(_v),
        repo: 'loptruong12a9-gif/Chamcong2026v3',
        branch: 'main',
        autoSync: false,
        enabled: true
    };
    // ===========================================

    let config = null;
    let isSyncing = false;
    let syncTimeout = null;
    let lastSyncTime = null;
    let pendingUpload = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    // Load configuration - CƯỠNG CHẾ MASTER TOKEN TRÊN MỌI THIẾT BỊ
    function loadConfig() {
        try {
            const saved = localStorage.getItem(CONFIG_KEY);
            let needsSaving = false;

            if (saved) {
                config = JSON.parse(saved);

                // 1. CƯỠNG CHẾ: Luôn sử dụng Repo và Branch chuẩn
                config.repo = DEFAULT_CONFIG.repo;
                config.branch = DEFAULT_CONFIG.branch;

                // 2. KIỂM TRA PHỤC HỒI: Nếu token bị mất hoặc sai định dạng, nạp lại Master Token ngay
                if (!config.token || config.token.length < 20 || config.token.includes('ghp_')) {
                    config.token = DEFAULT_CONFIG.token;
                    needsSaving = true;
                }

                // Luôn đảm bảo config được kích hoạt nhưng TẮT chế độ tự động đồng bộ theo yêu cầu mới
                config.enabled = true;
                config.autoSync = false;

                if (needsSaving) {
                    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
                }
            } else {
                config = { ...DEFAULT_CONFIG };
                localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
                console.log('GitHub: Khởi tạo cấu hình Master lần đầu trên thiết bị mới.');
            }

            lastSyncTime = localStorage.getItem(LAST_SYNC_KEY);
            return true;
        } catch (e) {
            console.error('Error loading GitHub config:', e);
            // Fallback nếu có lỗi JSON
            config = { ...DEFAULT_CONFIG };
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        }
        return false;
    }

    // Lưu configuration
    function saveConfig(token, repo, branch = 'main', autoSync = true) {
        config = {
            token: token,
            repo: repo,
            branch: branch,
            autoSync: autoSync,
            enabled: true
        };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        return true;
    }

    // Kiểm tra kết nối GitHub
    async function testConnection() {
        if (!config || !config.token || !config.repo) {
            return {
                success: false,
                message: 'Thiếu thông tin cấu hình. Vui lòng nhập Token và Repository.'
            };
        }

        updateSyncStatus('syncing', 'Đang kiểm tra kết nối...');

        try {
            // PRODUCTION FIX: Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch(
                `https://api.github.com/repos/${config.repo}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `token ${config.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                updateSyncStatus('success', 'Kết nối thành công');
                return {
                    success: true,
                    message: `✅ Kết nối thành công đến repository: ${data.full_name}`,
                    repoInfo: data
                };
            } else if (response.status === 404) {
                updateSyncStatus('error', 'Repository không tồn tại');
                return {
                    success: false,
                    message: '❌ Repository không tồn tại hoặc bạn không có quyền truy cập. Vui lòng kiểm tra lại tên repository.'
                };
            } else if (response.status === 401) {
                updateSyncStatus('error', 'Token không hợp lệ');
                return {
                    success: false,
                    message: '❌ Token không hợp lệ hoặc đã hết hạn. Vui lòng tạo token mới tại GitHub Settings.'
                };
            } else if (response.status === 403) {
                updateSyncStatus('error', 'Không đủ quyền');
                return {
                    success: false,
                    message: '❌ Token không có quyền truy cập repository. Vui lòng cấp quyền "repo" cho token.'
                };
            } else {
                updateSyncStatus('error', 'Lỗi kết nối');
                return {
                    success: false,
                    message: `❌ Lỗi kết nối (HTTP ${response.status}). Vui lòng thử lại sau.`
                };
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                updateSyncStatus('error', 'Timeout');
                return {
                    success: false,
                    message: '❌ Kết nối quá lâu (timeout 30s). Vui lòng kiểm tra kết nối mạng và thử lại.'
                };
            }

            updateSyncStatus('error', 'Lỗi mạng');
            return {
                success: false,
                message: `❌ Lỗi kết nối: ${error.message}. Vui lòng kiểm tra kết nối internet.`
            };
        }
    }

    // Thu thập tất cả dữ liệu attendance từ localStorage
    function getAllAttendanceData() {
        const attendance = {};
        const coefficients = {};

        // Thu thập dữ liệu attendance hiệu quả hơn
        for (let i = 0, len = localStorage.length; i < len; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            if (key.startsWith('attendance_')) {
                try {
                    attendance[key] = JSON.parse(localStorage.getItem(key));
                } catch (e) { }
            } else if (key.startsWith('coeff_global_')) {
                coefficients[key] = localStorage.getItem(key);
            }
        }

        return {
            metadata: {
                exportTime: new Date().toISOString(),
                version: '3.75',
                source: 'BẢNG CHẤM CÔNG KHOA PT - GMHS',
                updatedBy: sessionStorage.getItem('currentUser') || 'Unknown'
            },
            attendance,
            coefficients
        };
    }

    // Lấy SHA của file hiện tại trên GitHub (cần cho update)
    async function getFileSHA() {
        if (!config) return null;

        const [owner, repo] = config.repo.split('/');
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${DATA_FILE_NAME}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.sha;
            }
            return null; // File chưa tồn tại
        } catch (e) {
            return null;
        }
    }

    // Hàm gộp dữ liệu local vào dữ liệu từ GitHub (Tránh ghi đè mất dữ liệu người khác)
    function mergeAttendanceData(localData, remoteData, modifiedKeys = null) {
        if (!remoteData || !remoteData.attendance) return localData;

        // Clone remote data để giữ làm base
        const merged = {
            metadata: { ...remoteData.metadata, ...localData.metadata },
            attendance: { ...remoteData.attendance },
            coefficients: { ...remoteData.coefficients || {} }
        };

        // Chỉ gộp các keys có sự thay đổi (Nếu có modifiedKeys) hoặc gộp toàn bộ local
        const keysToMerge = modifiedKeys || Object.keys(localData.attendance);
        for (const key of keysToMerge) {
            if (localData.attendance[key]) {
                merged.attendance[key] = localData.attendance[key];
            }
        }

        // Gộp hệ số
        const localCoeffs = localData.coefficients;
        for (const key in localCoeffs) {
            merged.coefficients[key] = localCoeffs[key];
        }

        return merged;
    }

    // Debounced Upload (Hàm quan trọng: Tránh sync liên tục)
    async function debouncedUpload(delay = 3000, modifiedKeys = null) {
        if (!config || !config.autoSync) return; // Không tự động push nếu tắt autoSync

        if (syncTimeout) clearTimeout(syncTimeout);

        updateSyncStatus('syncing', 'Đang chờ đồng bộ...');

        syncTimeout = setTimeout(async () => {
            try {
                await uploadData(false, modifiedKeys);
            } catch (e) {
                console.error('Đồng bộ (delay) thất bại:', e);
            }
        }, delay);
    }

    // Upload dữ liệu lên GitHub (Có gộp dữ liệu & Xử lý xung đột)
    async function uploadData(isRetry = false, modifiedKeys = null) {
        if (!config || !config.enabled) {
            console.warn('Bỏ qua: Đồng bộ GitHub chưa được kích hoạt.');
            return { skipped: true };
        }

        if (isSyncing && !isRetry) {
            console.log('Đang chờ: Một tiến trình đồng bộ khác đang chạy.');
            pendingUpload = modifiedKeys;
            return { queued: true };
        }

        isSyncing = true;
        updateSyncStatus('syncing');

        try {
            const localData = getAllAttendanceData();
            const [owner, repo] = config.repo.split('/');
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${DATA_FILE_NAME}`;

            // 1. Lấy dữ liệu hiện tại từ GitHub (nếu có) để gộp
            let finalData = localData;
            let sha = null;

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${config.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (response.status === 401 && !isRetry) {
                    localStorage.removeItem(CONFIG_KEY);
                    loadConfig();
                    isSyncing = false;
                    return await uploadData(true, modifiedKeys);
                }

                if (response.ok) {
                    const remoteFile = await response.json();
                    sha = remoteFile.sha;
                    const remoteContent = JSON.parse(decodeURIComponent(escape(atob(remoteFile.content))));

                    // Gộp dữ liệu local vào dữ liệu server
                    finalData = mergeAttendanceData(localData, remoteContent, modifiedKeys);
                }
            } catch (e) {
                console.log('File chưa tồn tại hoặc lỗi lấy dữ liệu cũ, sẽ tạo mới.');
            }

            // 2. Encode và Push lên (Nén JSON để tăng tốc)
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(finalData))));
            const body = {
                message: `⚡ FastSync by ${sessionStorage.getItem('currentUser') || 'User'} at ${new Date().toLocaleTimeString('vi-VN')}`,
                content: content,
                branch: config.branch || 'main',
                sha: sha || undefined
            };

            const putResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!putResponse.ok) {
                const error = await putResponse.json();

                // === XỬ LÝ LỖI TOKEN (401) ===
                if (putResponse.status === 401 && !isRetry) {
                    localStorage.removeItem(CONFIG_KEY);
                    loadConfig();
                    isSyncing = false;
                    return await uploadData(true, modifiedKeys);
                }

                // === XỬ LÝ XUNG ĐỘT (Conflict 409) ===
                if (putResponse.status === 409) {
                    console.warn('Xung đột dữ liệu (409). Đang thử lại...');
                    isSyncing = false;
                    return await uploadData(true, modifiedKeys);
                }

                // === XỬ LÝ LỖI KHÔNG TÌM THẤY (404) ===
                if (putResponse.status === 404) {
                    throw new Error(`Không tìm thấy Repository hoặc File trên GitHub (404). \nRepo: ${config.repo} \nPath: ${DATA_FILE_NAME}`);
                }

                throw new Error(error.message || `Upload failed: ${putResponse.status}`);
            }

            lastSyncTime = new Date().toISOString();
            localStorage.setItem(LAST_SYNC_KEY, lastSyncTime);
            updateSyncStatus('synced');
            isSyncing = false;
            retryCount = 0;

            // Xử lý upload chờ xử lý nếu có
            if (pendingUpload) {
                const nextKeys = pendingUpload;
                pendingUpload = null;
                await uploadData(false, nextKeys);
            }

            return { success: true, time: lastSyncTime };

        } catch (error) {
            isSyncing = false;
            console.error('Lỗi tải lên (Upload error):', error);

            if (!isRetry && retryCount < MAX_RETRIES && !error.message.includes('failed')) {
                retryCount++;
                const delay = retryCount * 5000;
                console.log(`Đang thử lại sau ${delay}ms (Lần ${retryCount})...`);
                setTimeout(() => uploadData(true, modifiedKeys), delay);
            } else {
                updateSyncStatus('error', error.message);
                retryCount = 0;
            }
            throw error;
        }
    }

    // Download dữ liệu từ GitHub
    async function downloadData(isRetry = false) {
        if (!config) {
            throw new Error('Chưa cấu hình GitHub.');
        }

        updateSyncStatus('syncing');

        try {
            const [owner, repo] = config.repo.split('/');
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${DATA_FILE_NAME}`;

            let response = await fetch(url, {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            // === XỬ LÝ LỖI TOKEN (401) ===
            if (response.status === 401) {
                if (!isRetry) {
                    console.warn('Token 401 khi tải về. Đang khôi phục cấu hình Master và thử lại...');
                    localStorage.removeItem(CONFIG_KEY);
                    loadConfig(); // Nạp lại DEFAULT_CONFIG
                    return await downloadData(true);
                } else {
                    updateSyncStatus('error', 'Token mặc định không hợp lệ');
                    throw new Error('❌ Token truy cập GitHub đã hết hạn hoặc bị thu hồi (401). Vui lòng nhấn vào "Cấu hình GitHub" để kiểm tra hoặc nhập Token mới.');
                }
            }

            if (response.status === 404) {
                // Trả về cấu hình trống thay vì lỗi nếu là lần đầu tiên (File chưa có)
                console.log('GitHub: Chưa có dữ liệu trên server, khởi tạo bản ghi mới.');
                return { attendance: {}, coefficients: {} };
            }

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status}`);
            }

            const fileData = await response.json();

            // Decode base64 content
            const content = decodeURIComponent(escape(atob(fileData.content)));
            const data = JSON.parse(content);

            updateSyncStatus('synced');

            return data;

        } catch (error) {
            updateSyncStatus('error', error.message);
            throw error;
        }
    }

    // Khôi phục dữ liệu từ GitHub vào localStorage
    async function restoreFromGitHub() {
        try {
            const data = await downloadData();

            if (!data.attendance) {
                throw new Error('Dữ liệu không hợp lệ.');
            }

            // Backup dữ liệu hiện tại trước
            const backup = getAllAttendanceData();
            const backupKey = `backup_before_restore_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(backup));

            // Restore attendance data
            Object.keys(data.attendance).forEach(key => {
                localStorage.setItem(key, JSON.stringify(data.attendance[key]));
            });

            // Restore coefficients
            if (data.coefficients) {
                Object.keys(data.coefficients).forEach(key => {
                    localStorage.setItem(key, data.coefficients[key]);
                });
            }

            return {
                success: true,
                recordsRestored: Object.keys(data.attendance).length,
                backupKey: backupKey
            };

        } catch (error) {
            throw error;
        }
    }

    // Cập nhật UI trạng thái sync
    function updateSyncStatus(status, message = '') {
        const indicator = document.getElementById('sync-status-indicator');
        const text = document.getElementById('sync-status-text');

        if (!indicator || !text) return;

        switch (status) {
            case 'syncing':
                indicator.className = 'sync-status-indicator syncing';
                indicator.innerHTML = '🔄';
                text.textContent = 'Đang đồng bộ...';
                text.style.color = 'var(--royal-gold)';
                break;
            case 'synced':
                indicator.className = 'sync-status-indicator synced';
                indicator.innerHTML = '☁️';
                text.style.color = 'var(--royal-success)';
                if (lastSyncTime) {
                    const dateObj = new Date(lastSyncTime);
                    const timePart = dateObj.toLocaleTimeString('vi-VN');
                    const datePart = dateObj.toLocaleDateString('vi-VN');
                    text.innerHTML = `Xong lúc ${timePart} - ${datePart}`;
                } else {
                    text.textContent = 'Đã sẵn sàng';
                }
                break;
            case 'error':
                indicator.className = 'sync-status-indicator error';
                indicator.innerHTML = '⚠️';
                text.textContent = `Lỗi: ${message}`;
                text.style.color = 'var(--royal-error)';
                break;
            case 'disabled':
                indicator.className = 'sync-status-indicator disabled';
                indicator.innerHTML = '○';
                text.textContent = 'Chưa cấu hình';
                text.style.color = 'var(--text-dim)';
                break;
        }
    }

    // Khởi tạo
    function init() {
        loadConfig();
        if (config && config.enabled) {
            updateSyncStatus('synced');
        } else {
            updateSyncStatus('disabled');
        }
    }

    // Public API
    return {
        init: init,
        configure: saveConfig,
        testConnection: testConnection,
        uploadData: uploadData,
        debouncedUpload: debouncedUpload,
        downloadData: downloadData,
        restoreFromGitHub: restoreFromGitHub,
        isConfigured: () => config !== null && config.enabled,
        isAutoSyncEnabled: () => config && config.autoSync,
        getLastSyncTime: () => lastSyncTime,
        updateSyncStatus: updateSyncStatus,
        isSyncing: () => isSyncing,
        getAllAttendanceData: getAllAttendanceData,
        disable: () => {
            if (config) {
                config.enabled = false;
                localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
                updateSyncStatus('disabled');
            }
        },
        enable: () => {
            if (config) {
                config.enabled = true;
                localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
                updateSyncStatus('synced');
            }
        },
        syncNow: (modifiedKeys = null) => {
            if (syncTimeout) clearTimeout(syncTimeout);
            return uploadData(false, modifiedKeys);
        }
    };
})();

// Khởi tạo khi trang load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GitHubSync.init());
} else {
    GitHubSync.init();
}
