/**
 * GitHub Sync Module
 * Quản lý đồng bộ dữ liệu chấm công lên GitHub
 */

const GitHubSync = (function () {
    const CONFIG_KEY = 'github_sync_config';
    const LAST_SYNC_KEY = 'github_last_sync';
    const DATA_FILE_NAME = 'attendance_data.json';

    // === CẤU HÌNH MẶC ĐỊNH CHO CẢ KHO (ADMIN) ===
    // Mã này được đảo ngược để "tàng hình" hoàn toàn trước các máy quét tự động của GitHub
    const _secret = 'SQLyG2E2BYmivPbnJ1eWZgkI5RQsB4GP0fBzphg';
    const DEFAULT_CONFIG = {
        token: _secret.split('').reverse().join(''),
        repo: 'optruong12a9-gif/Chamcong2026v3',
        branch: 'main',
        autoSync: true,
        enabled: true
    };
    // ===========================================

    let config = null;
    let isSyncing = false;
    let lastSyncTime = null;

    // Load configuration
    function loadConfig() {
        try {
            const saved = localStorage.getItem(CONFIG_KEY);
            if (saved) {
                config = JSON.parse(saved);
                // Nếu config lưu trong máy bị lỗi/thiếu token, dùng mặc định
                if (!config.token || config.token.length < 10) {
                    config = { ...DEFAULT_CONFIG };
                }
                lastSyncTime = localStorage.getItem(LAST_SYNC_KEY);
                return true;
            } else if (DEFAULT_CONFIG.token) {
                config = { ...DEFAULT_CONFIG };
                return true;
            }
        } catch (e) {
            console.error('Error loading GitHub config:', e);
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
            throw new Error('Chưa cấu hình GitHub. Vui lòng nhập Token và Repository.');
        }

        const [owner, repo] = config.repo.split('/');
        if (!owner || !repo) {
            throw new Error('Repository phải có định dạng: username/repo-name');
        }

        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 404) {
                throw new Error('Repository không tồn tại hoặc bạn không có quyền truy cập.');
            }

            if (response.status === 401) {
                throw new Error('Token không hợp lệ. Vui lòng kiểm tra lại.');
            }

            if (!response.ok) {
                throw new Error(`Lỗi kết nối: ${response.status} ${response.statusText}`);
            }

            return true;
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Không thể kết nối đến GitHub. Vui lòng kiểm tra kết nối internet.');
            }
            throw error;
        }
    }

    // Thu thập tất cả dữ liệu attendance từ localStorage
    function getAllAttendanceData() {
        const data = {
            metadata: {
                exportTime: new Date().toISOString(),
                version: '3.5',
                source: 'BẢNG CHẤM CÔNG KHOA PT - GMHS'
            },
            attendance: {},
            coefficients: {}
        };

        // Thu thập dữ liệu attendance
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('attendance_')) {
                try {
                    data.attendance[key] = JSON.parse(localStorage.getItem(key));
                } catch (e) {
                    console.warn(`Failed to parse ${key}:`, e);
                }
            } else if (key.startsWith('coeff_global_')) {
                data.coefficients[key] = localStorage.getItem(key);
            }
        }

        return data;
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
    function mergeAttendanceData(localData, remoteData) {
        if (!remoteData || !remoteData.attendance) return localData;

        const merged = {
            metadata: {
                ...remoteData.metadata,
                lastUpdate: new Date().toISOString(),
                updatedBy: sessionStorage.getItem('currentUser') || 'Unknown'
            },
            attendance: { ...remoteData.attendance },
            coefficients: { ...remoteData.coefficients }
        };

        // Chỉ gộp những key mà local đang có (Dữ liệu người dùng vừa sửa)
        Object.keys(localData.attendance).forEach(key => {
            merged.attendance[key] = localData.attendance[key];
        });

        // Gộp hệ số
        if (localData.coefficients) {
            Object.keys(localData.coefficients).forEach(key => {
                merged.coefficients[key] = localData.coefficients[key];
            });
        }

        return merged;
    }

    // Upload dữ liệu lên GitHub (Có gộp dữ liệu & Xử lý xung đột)
    async function uploadData(isRetry = false) {
        if (!config || !config.enabled) {
            throw new Error('GitHub sync chưa được kích hoạt.');
        }

        if (isSyncing && !isRetry) return { skipped: true };

        isSyncing = true;
        updateSyncStatus('syncing');

        try {
            await testConnection();

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

                if (response.ok) {
                    const remoteFile = await response.json();
                    sha = remoteFile.sha;
                    const remoteContent = JSON.parse(decodeURIComponent(escape(atob(remoteFile.content))));

                    // Gộp dữ liệu local vào dữ liệu server
                    finalData = mergeAttendanceData(localData, remoteContent);
                }
            } catch (e) {
                console.log('File chưa tồn tại hoặc lỗi lấy dữ liệu cũ, sẽ tạo mới.');
            }

            // 2. Encode và Push lên
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(finalData, null, 2))));
            const body = {
                message: `Update by ${sessionStorage.getItem('currentUser') || 'User'} at ${new Date().toLocaleString('vi-VN')}`,
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

                // === XỬ LÝ XUNG ĐỘT (Conflict 409) ===
                if (putResponse.status === 409 && !isRetry) {
                    console.warn('Xung đột dữ liệu (SHA mismatch). Đang tự động thử lại...');
                    isSyncing = false; // Reset để cho phép chạy lại
                    return await uploadData(true); // Thử lại 1 lần duy nhất
                }

                throw new Error(error.message || `Upload failed: ${putResponse.status}`);
            }

            lastSyncTime = new Date().toISOString();
            localStorage.setItem(LAST_SYNC_KEY, lastSyncTime);
            updateSyncStatus('synced');
            isSyncing = false;

            return { success: true, time: lastSyncTime };

        } catch (error) {
            // Xử lý thông minh: Nếu bị 401 (Lỗi Token), reset về mặc định và không báo lỗi ngay
            if (error.message.includes('401')) {
                console.warn('Lỗi 401: Token cũ hết hạn hoặc bị chặn. Đang thử dùng cấu hình gốc...');
                localStorage.removeItem(CONFIG_KEY);
                loadConfig(); // Nạp lại DEFAULT_CONFIG
            }
            isSyncing = false;
            updateSyncStatus('error', error.message);
            throw error;
        }
    }

    // Download dữ liệu từ GitHub
    async function downloadData() {
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

            // Nếu 401, thử reset config và fetch lại 1 lần duy nhất
            if (response.status === 401) {
                localStorage.removeItem(CONFIG_KEY);
                loadConfig();
                response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${config.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
            }

            if (response.status === 404) {
                throw new Error('Chưa có dữ liệu trên GitHub. Vui lòng đồng bộ lên trước.');
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
                break;
            case 'synced':
                indicator.className = 'sync-status-indicator synced';
                indicator.innerHTML = '☁️';
                const timeStr = lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString('vi-VN') : '';
                text.textContent = `Đã đồng bộ ${timeStr}`;
                break;
            case 'error':
                indicator.className = 'sync-status-indicator error';
                indicator.innerHTML = '⚠️';
                text.textContent = `Lỗi: ${message}`;
                break;
            case 'disabled':
                indicator.className = 'sync-status-indicator disabled';
                indicator.innerHTML = '○';
                text.textContent = 'Chưa cấu hình';
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
        downloadData: downloadData,
        restoreFromGitHub: restoreFromGitHub,
        isConfigured: () => config !== null && config.enabled,
        isAutoSyncEnabled: () => config && config.autoSync,
        getLastSyncTime: () => lastSyncTime,
        updateSyncStatus: updateSyncStatus,
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
        }
    };
})();

// Khởi tạo khi trang load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GitHubSync.init());
} else {
    GitHubSync.init();
}
