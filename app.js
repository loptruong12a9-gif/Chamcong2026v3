document.addEventListener('DOMContentLoaded', () => {
    const monthPicker = document.getElementById('month-picker');
    const headerRow = document.getElementById('header-row');
    const regularRow = document.getElementById('regular-row');
    const overtimeRow = document.getElementById('overtime-row');
    const calculatedOvertimeRow = document.getElementById('calculated-overtime-row');
    const dutyRow = document.getElementById('duty-row');
    const totalRegularEl = document.getElementById('total-regular');
    const totalOvertimeEl = document.getElementById('total-overtime');
    const totalAllEl = document.getElementById('total-all');

    const EMPLOYEE_MAP = {
        "NGUYỄN VĂN TÂN": "ĐIỀU DƯỠNG DỤNG CỤ",
        "NGUYỄN VĂN THANH": "ĐIỀU DƯỠNG DỤNG CỤ",
        "NGUYỄN VĂN ĐÔNG": "ĐIỀU DƯỠNG DỤNG CỤ",
        "ĐỖ THỊ HẰNG NGA": "ĐIỀU DƯỠNG DỤNG CỤ",
        "PHẠM NGỌC ĐÀI": "ĐIỀU DƯỠNG DỤNG CỤ",
        "HOÀNG SỸ HUY": "ĐIỀU DƯỠNG DỤNG CỤ",
        "ĐẶNG THỊ MỸ LỆ": "ĐIỀU DƯỠNG DỤNG CỤ",
        "VÕ VĂN TUẤN": "KTV GÂY MÊ",
        "NGUYỄN THỊ HOA": "KTV GÂY MÊ",
        "NGUYỄN HỮU TRUNG HIẾU": "KTV GÂY MÊ",
        "VŨ NGỌC THÁI": "KTV GÂY MÊ",
        "DƯƠNG HOÀNG TUYẾT NGA": "KTV GÂY MÊ",
        "PHẠM THỊ LINH": "KTV GÂY MÊ",
        "NGUYỄN KIM NGỌC": "KTV GÂY MÊ",
        "LÊ THỊ THU THẢO": "KTV GÂY MÊ",
        "HÀ THỊ HỒNG": "PHỤ TRÁCH KHO",
        "HỒ HOÀNG TÍN": "ĐIỀU DƯỠNG HỒI SỨC",
        "PHẠM THỊ A NHỊ": "ĐIỀU DƯỠNG HỒI SỨC",
        "HUỲNH THỊ THẢO": "ĐIỀU DƯỠNG HỒI SỨC",
        "KHƯƠNG THỊ THANH": "ĐIỀU DƯỠNG HỒI SỨC",
        "LƯU THỊ MAI THƯƠNG": "THƯ KÍ Y KHOA",
        "TRẦN LÊ CẨM MY": "THƯ KÍ Y KHOA",
        "NGUYỄN THỊ HIỀN TÂM THẢO": "HỘ LÝ",
        "HAN LÊ BẢO NGỌC": "HỘ LÝ",
        "NGUYỄN THỊ HẬU": "HỘ LÝ",
        "NGUYỄN THỊ ĐỨC KHUYÊN": "HỘ LÝ"
    };

    // === AUTHENTICATION SYSTEM ===

    // Simple SHA-256 hash function
    async function hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // User credentials (passwords are SHA-256 hashed)
    // Default admin password: "admin123"
    // Default employee password: "123456"
    // Login ID: TÊN viết HOA (riêng người trùng tên phải nhập ĐỦ HỌ TÊN CÓ DẤU)
    const USER_CREDENTIALS = {
        "ADMIN": "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // admin123
        "TÂN": "c940feb7fe0c1dab322027496752b217bacb8f1f552ebfbdbba8e9f5c57899cb", // TÂN@123
        "NGUYỄN VĂN THANH": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "KHƯƠNG THỊ THANH": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "ĐỖ THỊ HẰNG NGA": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "DƯƠNG HOÀNG TUYẾT NGA": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "LÊ THỊ THU THẢO": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "HUỲNH THỊ THẢO": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "NGUYỄN THỊ HIỀN TÂM THẢO": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "NGUYỄN KIM NGỌC": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "HAN LÊ BẢO NGỌC": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "ĐÔNG": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "ĐÀI": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "HUY": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "LỆ": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "TUẤN": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "HOA": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "HIẾU": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "THÁI": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "LINH": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "HỒNG": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "TÍN": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "NHỊ": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "MY": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "THƯƠNG": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "HẬU": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "KHUYÊN": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "NGUYỄN THỊ ĐỨC KHUYÊN": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
    };

    // Mapping short names to full names for unique names
    const SHORTNAME_TO_FULLNAME = {
        "TÂN": "NGUYỄN VĂN TÂN",
        "ĐÔNG": "NGUYỄN VĂN ĐÔNG",
        "ĐÀI": "PHẠM NGỌC ĐÀI",
        "HUY": "HOÀNG SỸ HUY",
        "LỆ": "ĐẶNG THỊ MỸ LỆ",
        "TUẤN": "VÕ VĂN TUẤN",
        "HOA": "NGUYỄN THỊ HOA",
        "HIẾU": "NGUYỄN HỮU TRUNG HIẾU",
        "THÁI": "VŨ NGỌC THÁI",
        "LINH": "PHẠM THỊ LINH",
        "HỒNG": "HÀ THỊ HỒNG",
        "TÍN": "HỒ HOÀNG TÍN",
        "NHỊ": "PHẠM THỊ A NHỊ",
        "MY": "TRẦN LÊ CẨM MY",
        "THƯƠNG": "LƯU THỊ MAI THƯƠNG",
        "HẬU": "NGUYỄN THỊ HẬU",
        "KHUYÊN": "NGUYỄN THỊ ĐỨC KHUYÊN"
    };

    // Authentication functions
    const getCurrentUser = () => sessionStorage.getItem('currentUser');
    const isAdmin = () => {
        const user = getCurrentUser();
        return user === 'ADMIN' || user === 'TÂN';
    };
    const canEdit = (employeeName) => {
        const user = getCurrentUser();
        if (isAdmin()) return true;

        // Check if current user's full name matches the employee name
        const userFullName = SHORTNAME_TO_FULLNAME[user] || user;
        return userFullName === employeeName.toUpperCase();
    };

    async function login(username, password) {
        const hashedPassword = await hashPassword(password);
        const storedHash = USER_CREDENTIALS[username.toUpperCase()];

        if (storedHash && storedHash === hashedPassword) {
            sessionStorage.setItem('currentUser', username.toUpperCase());
            return true;
        }
        return false;
    }

    function logout() {
        sessionStorage.removeItem('currentUser');
        location.reload();
    }

    const autoFillPosition = (name) => {
        const upperName = name.trim().toUpperCase();
        if (EMPLOYEE_MAP[upperName]) {
            document.getElementById('employee-position').value = EMPLOYEE_MAP[upperName];
            toggleDutyRowVisibility();
        }
    };

    // --- CẤU HÌNH NGÀY LỄ 2026 CHUẨN ---
    const majorHolidaysX3 = ['2026-01-01', '2026-02-17', '2026-02-18', '2026-02-19', '2026-04-30', '2026-05-01', '2026-09-02'];
    // Fixed: Changed from MM-DD to DD-MM to match code logic
    const redHolidaysDDMM = ['01-01', '30-04', '01-05', '02-09', '03-09'];
    const redSpecificDates = ['2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22', '2026-04-26'];
    const compensatoryDates = ['2026-02-23', '2026-02-24', '2026-04-27', '2026-05-04'];

    const getMultiplier = (d) => {
        if (!d) return 1.5;
        const ddLocal = String(d.getDate()).padStart(2, '0');
        const mmLocal = String(d.getMonth() + 1).padStart(2, '0');
        const yyyyLocal = d.getFullYear();
        const yyyymmdd = `${yyyyLocal}-${mmLocal}-${ddLocal}`;
        const ddmm = `${ddLocal}-${mmLocal}`;
        const isSunday = d.getDay() === 0;
        const isHolidayRed = redHolidaysDDMM.includes(ddmm) || redSpecificDates.includes(yyyymmdd);

        if (majorHolidaysX3.includes(yyyymmdd)) return 3.0;
        if (isSunday || compensatoryDates.includes(yyyymmdd) || isHolidayRed) return 2.0;
        return 1.5;
    };

    // Set default month to current
    const now = new Date();
    monthPicker.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Populate name autocomplete suggestions
    const nameDatalist = document.getElementById('employee-names-list');
    if (nameDatalist) {
        Object.keys(EMPLOYEE_MAP).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            nameDatalist.appendChild(option);
        });
    }

    // === LOGIN FLOW & ACCESS CONTROL ===

    function updateUIForUser() {
        const user = getCurrentUser();
        const userDisplay = document.getElementById('current-user-display');
        const logoutBtn = document.getElementById('logout-btn');
        const employeeNameInput = document.getElementById('employee-name');

        if (user) {
            const fullName = SHORTNAME_TO_FULLNAME[user] || user;
            const words = fullName.split(' ');
            const displayName = words.length >= 2 ? words.slice(-2).join(' ') : fullName;

            userDisplay.textContent = isAdmin() ? `👤 ${displayName} (Admin)` : `👤 ${displayName}`;
            logoutBtn.style.display = 'inline-block';

            // Auto-load data for the current user if not already set
            if (employeeNameInput && !employeeNameInput.value) {
                const fullName = SHORTNAME_TO_FULLNAME[user] || user;
                employeeNameInput.value = fullName;
                loadData();
            }
        }
    }

    function lockInputsBasedOnPermission() {
        const currentName = document.getElementById('employee-name').value.trim().toUpperCase();
        const canEditCurrent = canEdit(currentName);

        // Lock/unlock all inputs
        document.querySelectorAll('.attendance-input, .ovt-textarea, .duty-select').forEach(input => {
            input.disabled = !canEditCurrent;
        });

        // Lock/unlock employee info inputs
        document.getElementById('employee-name').disabled = false; // Always allow name selection
        document.getElementById('employee-position').disabled = !canEditCurrent;

        // Lock/unlock buttons
        document.getElementById('save-btn').disabled = !canEditCurrent;
        document.getElementById('clear-btn').disabled = !canEditCurrent;
    }

    function showLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.classList.add('active');
        document.getElementById('login-username').focus();
    }

    function hideLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.classList.remove('active');
    }

    // Login submit handler
    document.getElementById('login-submit-btn').addEventListener('click', async () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
            return;
        }

        const success = await login(username, password);
        if (success) {
            hideLoginModal();
            updateUIForUser();
            generateTable();
            alert(`Đăng nhập thành công! Chào mừng ${getCurrentUser()}`);
        } else {
            alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            document.getElementById('login-password').value = '';
            document.getElementById('login-password').focus();
        }
    });

    // Logout handler
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            logout();
        }
    });

    // Enter key support for login
    document.getElementById('login-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('login-submit-btn').click();
        }
    });


    // Help panel toggle
    const helpBtn = document.getElementById('help-btn');
    const helpPanel = document.getElementById('help-panel');
    const closeHelpBtn = document.getElementById('close-help-btn');

    helpBtn.addEventListener('click', () => {
        helpPanel.classList.add('active');
    });

    closeHelpBtn.addEventListener('click', () => {
        helpPanel.classList.remove('active');
    });

    // Close help panel when clicking outside
    helpPanel.addEventListener('click', (e) => {
        if (e.target === helpPanel) {
            helpPanel.classList.remove('active');
        }
    });

    const generateTable = () => {
        const [year, month] = monthPicker.value.split('-').map(Number);

        // 1. Tạo danh sách các ngày thực tế từ 26 tháng trước đến 25 tháng này
        const startDate = new Date(year, month - 2, 26);
        const endDate = new Date(year, month - 1, 25);
        const actualDates = [];

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            actualDates.push(new Date(d));
        }

        const rowsToClear = [headerRow, regularRow, overtimeRow, calculatedOvertimeRow, dutyRow];
        rowsToClear.forEach(row => {
            if (row) while (row.children.length > 1) row.removeChild(row.lastChild);
        });

        const daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

        // 2. Điền các ngày thực tế vào bảng theo thứ tự liên tục
        // Luôn tạo đúng 31 cột để giữ khung bảng cố định, ngày trống đẩy về cuối
        for (let i = 0; i < 31; i++) {
            const d = actualDates[i] || null;

            const th = document.createElement('th');
            const tdReg = document.createElement('td');
            const tdOvt = document.createElement('td');
            const tdCalcOvt = document.createElement('td');
            const tdDuty = document.createElement('td');

            if (d) {
                const dateNum = d.getDate();
                const dayName = daysOfWeek[d.getDay()];
                const isSunday = d.getDay() === 0;
                const isSaturday = d.getDay() === 6;

                const ddLocal = String(d.getDate()).padStart(2, '0');
                const mmLocal = String(d.getMonth() + 1).padStart(2, '0');
                const yyyyLocal = d.getFullYear();
                const yyyymmdd = `${yyyyLocal}-${mmLocal}-${ddLocal}`;
                const ddmm = `${ddLocal}-${mmLocal}`;

                const isHolidayRed = redHolidaysDDMM.includes(ddmm) || redSpecificDates.includes(yyyymmdd);
                const isRedDay = isSunday || isHolidayRed;
                const highlightClass = isRedDay ? 'sunday-holiday' : (isSaturday ? 'weekend' : '');

                const multiplier = getMultiplier(d);

                th.textContent = `${dayName} - Ngày ${dateNum}`;
                if (highlightClass) th.classList.add(highlightClass);

                // --- Trong giờ ---
                const inputReg = document.createElement('input');
                inputReg.type = 'number';
                inputReg.className = 'attendance-input';
                inputReg.step = '0.5';
                inputReg.inputMode = 'decimal'; /* Mobile numeric keyboard */
                inputReg.min = '0';
                inputReg.max = '8';
                inputReg.dataset.type = 'regular';
                inputReg.dataset.date = yyyymmdd;
                if (highlightClass) {
                    tdReg.classList.add(highlightClass);
                    inputReg.classList.add(highlightClass);
                }

                // Auto-save logic
                let regDebounce;
                const triggerSave = () => {
                    saveData();
                };

                inputReg.addEventListener('input', (e) => {
                    if (parseFloat(e.target.value) > 8) {
                        e.target.value = 8;
                        alert('Giờ trong ca tối đa là 8 tiếng!');
                    }
                    calculateTotals();

                    // Debounce save on input (1 second)
                    clearTimeout(regDebounce);
                    regDebounce = setTimeout(triggerSave, 1000);
                });

                // Immediate save on blur/change
                inputReg.addEventListener('change', () => {
                    clearTimeout(regDebounce);
                    triggerSave();
                });

                tdReg.appendChild(inputReg);

                // --- Ngoài giờ (Textarea cho nhiều dòng) ---
                const areaOvt = document.createElement('textarea');
                areaOvt.className = 'ovt-textarea';
                areaOvt.placeholder = '...';
                areaOvt.dataset.type = 'overtime';
                areaOvt.dataset.multiplier = multiplier;
                areaOvt.dataset.date = yyyymmdd;

                let originalValue = '';
                areaOvt.addEventListener('focus', (e) => originalValue = e.target.value);
                areaOvt.addEventListener('input', () => {
                    calculateTotals();
                });

                areaOvt.addEventListener('change', (e) => {
                    if (e.target.value !== originalValue) {
                        if (confirm(`Bạn có muốn sửa các thông tin ngoài giờ này và lưu lại không?`)) {
                            saveData();
                        } else {
                            areaOvt.value = originalValue;
                            calculateTotals();
                        }
                    }
                });

                if (highlightClass) {
                    tdOvt.classList.add(highlightClass);
                    areaOvt.classList.add(highlightClass);
                }
                tdOvt.appendChild(areaOvt);

                // --- Cấu hình trực ---
                const selectDuty = document.createElement('select');
                selectDuty.className = 'duty-select';
                selectDuty.dataset.type = 'duty';
                selectDuty.dataset.date = yyyymmdd;
                [{ v: '', t: '-' }, { v: 'TRỰC CHÍNH', t: 'TRỰC CHÍNH' }, { v: 'TRỰC NGOÀI Ở LẠI', t: 'TRỰC NGOÀI Ở LẠI' }, { v: 'TRỰC NGOÀI Ở NHÀ VÔ', t: 'TRỰC NGOÀI Ở NHÀ VÔ' }].forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.v; o.textContent = opt.t;
                    selectDuty.appendChild(o);
                });
                selectDuty.addEventListener('change', saveData);
                if (highlightClass) {
                    tdDuty.classList.add(highlightClass);
                    tdCalcOvt.classList.add(highlightClass);
                }
                tdCalcOvt.className += ' calc-ovt-cell';
                tdCalcOvt.dataset.date = yyyymmdd;
                selectDuty.addEventListener('change', () => {
                    calculateTotals();
                });

                tdDuty.appendChild(selectDuty);

            } else {
                // Ngày không tồn tại -> Bôi đen
                [th, tdReg, tdOvt, tdCalcOvt, tdDuty].forEach(el => el.classList.add('invalid-date'));
                th.textContent = "-";
            }

            headerRow.appendChild(th);
            regularRow.appendChild(tdReg);
            overtimeRow.appendChild(tdOvt);
            calculatedOvertimeRow.appendChild(tdCalcOvt);
            dutyRow.appendChild(tdDuty);
        }

        loadData();
        updateSignatureDate();
        toggleDutyRowVisibility();
        renderSummaryTable();
    };



    const renderSummaryTable = () => {
        const summaryBody = document.getElementById('summary-body');
        if (!summaryBody) return;
        summaryBody.innerHTML = '';

        const currentMonth = monthPicker.value;
        const isAdminUser = isAdmin();

        // Show/hide "THAO TÁC" header based on admin status
        const actionsHeader = document.getElementById('summary-actions-header');
        if (actionsHeader) {
            actionsHeader.style.display = isAdminUser ? '' : 'none';
        }

        const POSITION_ORDER = [
            "ĐIỀU DƯỠNG DỤNG CỤ",
            "KTV GÂY MÊ",
            "PHỤ TRÁCH KHO",
            "ĐIỀU DƯỠNG HỒI SỨC",
            "THƯ KÍ Y KHOA",
            "HỘ LÝ"
        ];

        const allStaffNames = Object.keys(EMPLOYEE_MAP).sort((a, b) => {
            if (a === "NGUYỄN VĂN TÂN") return -1;
            if (b === "NGUYỄN VĂN TÂN") return 1;

            const posA = EMPLOYEE_MAP[a];
            const posB = EMPLOYEE_MAP[b];
            const orderA = POSITION_ORDER.indexOf(posA);
            const orderB = POSITION_ORDER.indexOf(posB);

            if (orderA !== orderB) return orderA - orderB;
            return a.localeCompare(b);
        });

        // Load all saved data for the month
        const savedDataMap = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`attendance_${currentMonth}_`)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.name) savedDataMap[data.name.toUpperCase()] = data;
                } catch (e) { }
            }
        }

        allStaffNames.forEach((name, index) => {
            const data = savedDataMap[name] || {
                name: name,
                position: EMPLOYEE_MAP[name],
                entries: [],
                duties: []
            };

            const totals = calculateDataTotals(data);
            const isNoData = !savedDataMap[name];

            const currentMonth = monthPicker.value;
            const globalCoeff = localStorage.getItem(`coeff_global_${name.toUpperCase()}`) || data.adminCoeff || '';
            const displayCoeff = globalCoeff || '';

            const tr = document.createElement('tr');
            tr.dataset.name = name.toUpperCase();
            if (isNoData) tr.style.opacity = '0.6';

            tr.innerHTML = `
                <td class="summary-sticky-stt">${index + 1}</td>
                <td class="summary-sticky-name" style="text-align: left; font-weight: 800; color: var(--accent); cursor: pointer;" onclick="loadSpecificPerson('${name}')">${name}</td>
                <td>${data.position || '-'}</td>
                <td class="summary-reg" style="color: var(--text-dim);">${isNoData ? '-' : totals.regStr}</td>
                <td class="summary-ovt" style="color: #b8860b;">${isNoData ? '-' : totals.ovtStr}</td>
                <td>
                    ${isAdminUser ?
                    `<input type="number" step="0.1" value="${displayCoeff}" 
                            class="coeff-input" 
                            style="width: 50px; text-align: center; border: 1px solid var(--border); border-radius: 4px;"
                            oninput="window.handleCoeffInput(this, '${name}')">` :
                    `<span style="font-weight: 700; color: var(--accent);">${displayCoeff || '-'}</span>`
                }
                </td>
                <td class="summary-all" style="color: var(--accent); font-weight: 800;">${isNoData ? '-' : totals.allStr}</td>
                ${isAdminUser ? `
                <td>
                    ${!isNoData ? `<button class="btn-history-small" onclick="viewHistory('${name}')">Lịch sử</button><button class="btn-delete-small" onclick="deletePerson('${name}')">Xóa</button>` : '<span style="font-size: 0.7rem; color: #ccc;">Trống</span>'}
                </td>
                ` : ''}
            `;
            summaryBody.appendChild(tr);
        });
    };

    // Hàm load người cụ thể khi click từ summary
    window.loadSpecificPerson = (name) => {
        document.getElementById('employee-name').value = name;
        loadData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deletePerson = (name) => {
        if (confirm(`Bạn có chắc muốn xóa dữ liệu của ${name} trong tháng này?`)) {
            const currentMonth = monthPicker.value;
            const key = `attendance_${currentMonth}_${name}`;
            const saved = localStorage.getItem(key);

            if (saved) {
                const data = JSON.parse(saved);
                if (!data.history) data.history = [];
                data.history.push({
                    time: new Date().toLocaleString('vi-VN'),
                    user: getCurrentUser(),
                    action: "Xóa toàn bộ dữ liệu tháng"
                });
                // Keep only last 20 history entries
                if (data.history.length > 20) data.history = data.history.slice(-20);

                // Clear entries but keep history for audit
                data.entries = [];
                data.duties = [];
                localStorage.setItem(key, JSON.stringify(data));
            } else {
                localStorage.removeItem(key);
            }

            renderSummaryTable();
            if (document.getElementById('employee-name').value === name) {
                document.querySelectorAll('.attendance-input, .ovt-textarea').forEach(i => i.value = '');
                document.querySelectorAll('.duty-select').forEach(i => i.value = '');
                calculateTotals();
            }
        }
    };

    window.viewHistory = (name) => {
        const currentMonth = monthPicker.value;
        const saved = localStorage.getItem(`attendance_${currentMonth}_${name}`);
        const historyList = document.getElementById('history-list');
        const historyName = document.getElementById('history-employee-name');

        if (!saved) return;
        const data = JSON.parse(saved);
        const history = data.history || [];

        historyName.textContent = name;
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<li class="history-item">Chưa có lịch sử ghi nhận.</li>';
        } else {
            [...history].reverse().forEach(item => {
                const li = document.createElement('li');
                li.className = 'history-item';
                li.innerHTML = `
                    <div class="history-time">⏰ ${item.time}</div>
                    <div class="history-details">
                        <span class="history-user">👤 ${item.user}</span>: ${item.action}
                    </div>
                `;
                historyList.appendChild(li);
            });
        }

        document.getElementById('history-modal').classList.add('active');
    };

    window.hideHistoryModal = () => {
        document.getElementById('history-modal').classList.remove('active');
    };

    // Remove debounce, save immediately for reliability
    window.handleCoeffInput = (input, name) => {
        window.liveUpdateTotal(input, name); // Immediate visual update
        window.updateAdminCoeff(name, input.value, true); // Immediate save, skip render
    };

    window.updateAdminCoeff = (name, value, skipRender = false) => {
        const upperName = name.toUpperCase();

        // 1. Lưu vào bộ nhớ chung (Global)
        localStorage.setItem(`coeff_global_${upperName}`, value);

        // 2. Cập nhật vào bản ghi tháng hiện tại
        const currentMonth = monthPicker.value;
        const key = `attendance_${currentMonth}_${upperName}`;
        let data = {
            name: name,
            position: EMPLOYEE_MAP[upperName],
            month: currentMonth,
            entries: [],
            duties: [],
            history: [],
            adminCoeff: value
        };

        const saved = localStorage.getItem(key);
        if (saved) {
            data = JSON.parse(saved);
            data.adminCoeff = value;
        }

        if (!data.history) data.history = [];
        data.history.push({
            time: new Date().toLocaleString('vi-VN'),
            user: getCurrentUser(),
            action: `Cập nhật Hệ số Admin (Global): ${value || 'Bỏ'}`
        });

        localStorage.setItem(key, JSON.stringify(data));

        // 3. Phản hồi hành động
        if (!skipRender) {
            renderSummaryTable();
        } else {
            // Chỉ hiện hiệu ứng đã lưu nếu không render lại
            const row = document.querySelector(`#summary-body tr[data-name="${upperName}"]`);
            if (row) {
                const input = row.querySelector('.coeff-input');
                if (input) {
                    input.style.borderColor = 'var(--save)';
                    setTimeout(() => input.style.borderColor = '', 1000);
                }
            }
        }
    };

    // Hàm cập nhật tổng cộng ngay lúc đang gõ
    window.liveUpdateTotal = (input, name) => {
        const row = input.closest('tr');
        if (!row) return;

        const regStr = row.querySelector('.summary-reg').textContent;
        const ovtStr = row.querySelector('.summary-ovt').textContent;
        const allCell = row.querySelector('.summary-all');

        // Parse hours from strings like "8 giờ 30 phút"
        const parseHours = (str) => {
            if (!str || str === '-') return 0;
            const hMatch = str.match(/(\d+)\s*giờ/);
            const mMatch = str.match(/(\d+)\s*phút/);
            const h = hMatch ? parseInt(hMatch[1]) : 0;
            const m = mMatch ? parseInt(mMatch[1]) : 0;
            return h + (m / 60);
        };

        const regTotal = parseHours(regStr);
        const ovtTotal = parseHours(ovtStr);
        const coeff = parseFloat(input.value) || 1.0;

        if (allCell) {
            allCell.textContent = formatHoursToTime((regTotal * coeff) + ovtTotal);
        }
    };

    const toggleDutyRowVisibility = () => {
        const position = document.getElementById('employee-position').value;
        const dutyRow = document.getElementById('duty-row');
        if (dutyRow) {
            dutyRow.style.display = (position === 'HỘ LÝ') ? 'none' : '';
        }
    };

    const calculateDataTotals = (data) => {
        let regTotal = 0, ovtTotal = 0;
        const useMultipliers = data.position !== 'HỘ LÝ' && data.position !== 'PHỤ TRÁCH KHO';

        (data.entries || []).forEach(entry => {
            if (entry.type === 'regular') {
                regTotal += parseFloat(entry.value) || 0;
            } else if (entry.type === 'overtime') {
                const rawValue = (entry.value || '').trim().toUpperCase();
                if (!rawValue) return;

                const lines = rawValue.split('\n');
                let cellBaseHours = 0;

                lines.forEach(line => {
                    const val = line.trim();
                    if (!val) return;

                    let lineHours = 0;
                    const rangeMatch = val.match(/^(\d{1,2})H(\d{0,2})-(\d{1,2})H(\d{0,2})$/);
                    if (rangeMatch) {
                        const sH = parseInt(rangeMatch[1]), sM = parseInt(rangeMatch[2] || '0'), eH = parseInt(rangeMatch[3]), eM = parseInt(rangeMatch[4] || '0');
                        const sMin = sH * 60 + sM;
                        let eMin = eH * 60 + eM;
                        if (eMin < sMin) eMin += (24 * 60);
                        if (eMin > sMin) lineHours = (eMin - sMin) / 60;
                    } else if (!isNaN(val)) {
                        lineHours = parseFloat(val);
                    } else {
                        const nMatch = val.match(/^(\d+(\.\d+)?)/);
                        if (nMatch) lineHours = parseFloat(nMatch[1]);
                    }
                    cellBaseHours += lineHours;
                });

                const d = new Date(entry.date);
                const multiplier = getMultiplier(d);
                ovtTotal += useMultipliers ? (cellBaseHours * multiplier) : cellBaseHours;
            }
        });

        (data.duties || []).forEach(duty => {
            if (duty.value === 'TRỰC NGOÀI Ở LẠI') ovtTotal += 0.5;
            else if (duty.value === 'TRỰC NGOÀI Ở NHÀ VÔ') ovtTotal += 1.0;
        });

        const globalCoeff = localStorage.getItem(`coeff_global_${(data.name || '').toUpperCase()}`);
        const coeff = parseFloat(globalCoeff) || parseFloat(data.adminCoeff) || 1;

        return {
            regStr: formatHoursToTime(regTotal),
            ovtStr: formatHoursToTime(ovtTotal),
            allStr: formatHoursToTime((regTotal * coeff) + ovtTotal)
        };
    };

    const updateSignatureDate = () => {
        const [year, month] = monthPicker.value.split('-').map(Number);
        const sigDate = new Date(year, month - 1, 26); // Ngày 26 của tháng được chọn
        const sigDateEl = document.getElementById('display-sig-date');
        if (sigDateEl) {
            sigDateEl.textContent = `Ngày 26 tháng ${month} năm ${year}`;
        }
    };

    const formatHoursToTime = (totalHours) => {
        const totalMinutes = Math.round(totalHours * 60);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return mins === 0 ? `${hours} giờ` : `${hours} giờ ${mins} phút`;
    };

    const calculateTotals = () => {
        let regTotal = 0, ovtTotal = 0;
        const position = document.getElementById('employee-position').value;
        const useMultipliers = position !== 'HỘ LÝ' && position !== 'PHỤ TRÁCH KHO';

        // Map to store daily calculated overtime + duty bonus
        const dailyTotalsMap = {};

        // 1. Calculate Regular Hours
        document.querySelectorAll('.attendance-input[data-type="regular"]').forEach(input => {
            regTotal += parseFloat(input.value) || 0;
        });

        // 2. Calculate Overtime Hours from Textarea
        document.querySelectorAll('[data-type="overtime"]').forEach(input => {
            const date = input.dataset.date;
            const rawValue = input.value.trim().toUpperCase();
            if (!dailyTotalsMap[date]) dailyTotalsMap[date] = 0;

            if (rawValue) {
                const lines = rawValue.split('\n');
                let cellBaseHours = 0;

                lines.forEach(line => {
                    const val = line.trim();
                    if (!val) return;

                    let lineHours = 0;
                    const rangeMatch = val.match(/^(\d{1,2})H(\d{0,2})-(\d{1,2})H(\d{0,2})$/);
                    if (rangeMatch) {
                        const sH = parseInt(rangeMatch[1]), sM = parseInt(rangeMatch[2] || '0'), eH = parseInt(rangeMatch[3]), eM = parseInt(rangeMatch[4] || '0');
                        const sMin = sH * 60 + sM;
                        let eMin = eH * 60 + eM;
                        if (eMin < sMin) eMin += (24 * 60);
                        if (eMin > sMin) lineHours = (eMin - sMin) / 60;
                    } else if (!isNaN(val)) {
                        lineHours = parseFloat(val);
                    } else {
                        const nMatch = val.match(/^(\d+(\.\d+)?)/);
                        if (nMatch) lineHours = parseFloat(nMatch[1]);
                    }
                    cellBaseHours += lineHours;
                });

                let finalCellHours = cellBaseHours;
                if (useMultipliers) {
                    const m = parseFloat(input.dataset.multiplier) || 1.5;
                    finalCellHours = cellBaseHours * m;
                }
                dailyTotalsMap[date] += finalCellHours;
            }
        });

        // 3. Add Duty Configuration Hours
        document.querySelectorAll('.duty-select').forEach(sel => {
            const date = sel.dataset.date;
            if (!dailyTotalsMap[date]) dailyTotalsMap[date] = 0;

            let dutyBonus = 0;
            if (sel.value === 'TRỰC NGOÀI Ở LẠI') dutyBonus = 0.5;
            else if (sel.value === 'TRỰC NGOÀI Ở NHÀ VÔ') dutyBonus = 1.0;

            dailyTotalsMap[date] += dutyBonus;
        });

        // 4. Update Daily Cells and Overall Sum
        document.querySelectorAll('.calc-ovt-cell').forEach(cell => {
            const date = cell.dataset.date;
            const dailyTotal = dailyTotalsMap[date] || 0;
            cell.textContent = dailyTotal > 0 ? dailyTotal.toFixed(1) : '';
        });

        // Calculate total sum from the consolidated map
        ovtTotal = Object.values(dailyTotalsMap).reduce((sum, val) => sum + val, 0);

        totalRegularEl.textContent = formatHoursToTime(regTotal);
        totalOvertimeEl.textContent = formatHoursToTime(ovtTotal);
        totalAllEl.textContent = formatHoursToTime(regTotal + ovtTotal);

        // --- CẬP NHẬT TỨC THÌ VÀO BẢNG TỔNG HỢP ---
        const currentName = document.getElementById('employee-name').value.trim().toUpperCase();
        if (currentName) {
            const summaryRow = document.querySelector(`#summary-body tr[data-name="${currentName}"]`);
            if (summaryRow) {
                summaryRow.style.opacity = '1'; // Phục hồi opacity nếu đang mờ
                const regCell = summaryRow.querySelector('.summary-reg');
                const ovtCell = summaryRow.querySelector('.summary-ovt');
                const allCell = summaryRow.querySelector('.summary-all');

                if (regCell) regCell.textContent = formatHoursToTime(regTotal);
                if (ovtCell) ovtCell.textContent = formatHoursToTime(ovtTotal);

                // Lấy hệ số admin từ dòng tương ứng để tính tổng chính xác
                let coeff = 1.0;
                const coeffInput = summaryRow.querySelector('.coeff-input');
                if (coeffInput) {
                    coeff = parseFloat(coeffInput.value) || 1.0;
                } else {
                    const coeffVal = summaryRow.cells[5].textContent.trim();
                    coeff = parseFloat(coeffVal) || 1.0;
                }

                if (allCell) allCell.textContent = formatHoursToTime((regTotal * coeff) + ovtTotal);

                // Cập nhật nút xóa nếu trước đó là 'Trống' (Chỉ dành cho admin)
                if (isAdmin()) {
                    const actionCell = summaryRow.cells[6];
                    if (actionCell && actionCell.textContent === 'Trống') {
                        actionCell.innerHTML = `<button class="btn-delete-small" onclick="deletePerson('${currentName}')">Xóa</button>`;
                    }
                }
            }
        }
    };

    const saveData = () => {
        const name = document.getElementById('employee-name').value.trim();
        if (!name) {
            alert('Vui lòng nhập họ và tên trước khi lưu!');
            return;
        }

        const currentData = {
            name: name,
            position: document.getElementById('employee-position').value,
            month: monthPicker.value,
            entries: [],
            duties: [],
            history: []
        };

        // Capture current UI State
        document.querySelectorAll('.attendance-input, .ovt-textarea').forEach(input => {
            if (input.value) {
                currentData.entries.push({
                    date: input.dataset.date,
                    type: input.dataset.type,
                    value: input.value,
                    multiplier: input.dataset.multiplier
                });
            }
        });
        document.querySelectorAll('.duty-select').forEach(sel => {
            if (sel.value) currentData.duties.push({ date: sel.dataset.date, value: sel.value });
        });

        // Load existing data to compare
        const saved = localStorage.getItem(`attendance_${monthPicker.value}_${name}`);
        let oldData = { entries: [], duties: [], history: [] };
        if (saved) {
            try {
                oldData = JSON.parse(saved);
                currentData.history = oldData.history || [];
                currentData.adminCoeff = oldData.adminCoeff; // Bảo lưu hệ số admin
            } catch (e) { }
        }

        // Deep Comparison for History
        const changes = [];
        const allDates = new Set([
            ...oldData.entries.map(e => e.date),
            ...currentData.entries.map(e => e.date),
            ...oldData.duties.map(d => d.date),
            ...currentData.duties.map(d => d.date)
        ]);

        const dateSorted = Array.from(allDates).sort();

        dateSorted.forEach(dateStr => {
            const dayNum = dateStr.split('-')[2];

            // 1. Check Regular hours
            const oldReg = oldData.entries.find(e => e.date === dateStr && e.type === 'regular')?.value || '';
            const newReg = currentData.entries.find(e => e.date === dateStr && e.type === 'regular')?.value || '';
            if (oldReg !== newReg) {
                changes.push(`- Ngày ${dayNum}: Trong giờ [${oldReg || 'Trống'}] ➔ [${newReg || 'Bỏ'}]`);
            }

            // 2. Check Overtime hours
            const oldOvt = oldData.entries.find(e => e.date === dateStr && e.type === 'overtime')?.value || '';
            const newOvt = currentData.entries.find(e => e.date === dateStr && e.type === 'overtime')?.value || '';
            if (oldOvt !== newOvt) {
                changes.push(`- Ngày ${dayNum}: Ngoài giờ [${oldOvt || 'Trống'}] ➔ [${newOvt || 'Bỏ'}]`);
            }

            // 3. Check Duties
            const oldDuty = oldData.duties.find(d => d.date === dateStr)?.value || '';
            const newDuty = currentData.duties.find(d => d.date === dateStr)?.value || '';
            if (oldDuty !== newDuty) {
                changes.push(`- Ngày ${dayNum}: Trực [${oldDuty || '-'}] ➔ [${newDuty || '-'}]`);
            }
        });

        let actionDesc = "Lưu dữ liệu";
        if (changes.length > 0) {
            if (changes.length > 10) {
                actionDesc = `Chỉnh sửa hàng loạt (${changes.length} thay đổi)`;
            } else {
                actionDesc = changes.join('\n');
            }
        } else if (saved) {
            actionDesc = "Lưu lại (không có thay đổi)";
        }

        // Add history entry
        currentData.history.push({
            time: new Date().toLocaleString('vi-VN'),
            user: getCurrentUser(),
            action: actionDesc
        });

        // Limit history to last 20 entries
        if (currentData.history.length > 20) currentData.history = currentData.history.slice(-20);

        localStorage.setItem(`attendance_${monthPicker.value}_${name}`, JSON.stringify(currentData));
        calculateTotals();
        renderSummaryTable();
    };

    const loadData = () => {
        const name = document.getElementById('employee-name').value.trim();
        autoFillPosition(name);
        const saved = localStorage.getItem(`attendance_${monthPicker.value}_${name}`);

        // Clear board first
        document.querySelectorAll('.attendance-input, .ovt-textarea').forEach(i => i.value = '');
        document.querySelectorAll('.duty-select').forEach(i => i.value = '');

        if (saved) {
            const data = JSON.parse(saved);
            document.getElementById('employee-position').value = data.position || '';
            if (document.getElementById('signature-name')) document.getElementById('signature-name').textContent = (data.name || '').toUpperCase();
            data.entries.forEach(entry => {
                const input = document.querySelector(`[data-date="${entry.date}"][data-type="${entry.type}"]`);
                if (input) input.value = entry.value;
            });
            if (data.duties) {
                data.duties.forEach(duty => {
                    const sel = document.querySelector(`.duty-select[data-date="${duty.date}"]`);
                    if (sel) sel.value = duty.value;
                });
            }
        }
        updateSignatureDate();
        calculateTotals();
        lockInputsBasedOnPermission(); // Apply access control
    };

    document.getElementById('save-btn').addEventListener('click', () => {
        saveData();
        alert('Đã lưu dữ liệu thành công!');
    });

    document.getElementById('employee-name').addEventListener('input', (e) => {
        const val = e.target.value;
        if (document.getElementById('signature-name')) {
            document.getElementById('signature-name').textContent = val.toUpperCase();
        }
        autoFillPosition(val);
        loadData();
        lockInputsBasedOnPermission(); // Apply access control when name changes
    });

    document.getElementById('employee-position').addEventListener('change', () => {
        toggleDutyRowVisibility();
        calculateTotals();
    });

    monthPicker.addEventListener('change', generateTable);
    document.getElementById('export-btn').addEventListener('click', exportToExcel);
    document.getElementById('print-btn').addEventListener('click', () => window.print());
    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa hết dữ liệu của người này trong tháng này?')) {
            document.querySelectorAll('.attendance-input, .ovt-textarea').forEach(i => i.value = '');
            document.querySelectorAll('.duty-select').forEach(i => i.value = '');
            saveData();
        }
    });

    if (document.getElementById('refresh-summary')) {
        document.getElementById('refresh-summary').addEventListener('click', renderSummaryTable);
    }

    function exportToExcel() {
        const name = document.getElementById('employee-name').value || 'NhanVien';
        const position = document.getElementById('employee-position').value || 'ChucVu';
        const month = monthPicker.value || 'Thang';
        const filename = `Bang_Cham_Cong_${name}_${month}.xls`;

        // Lấy dữ liệu thực tế
        const table = document.getElementById('attendance-table');
        const rows = Array.from(table.querySelectorAll('tr'));

        // Tạo HTML Table cho Excel với styling mạnh mẽ
        let tableHtml = '<table>';
        rows.forEach((row, rowIndex) => {
            // Skip hidden rows in export if it's the duty row
            if (row.id === 'duty-row' && row.style.display === 'none') return;

            tableHtml += '<tr>';
            const cells = Array.from(row.querySelectorAll('th, td'));
            cells.forEach((cell, cellIndex) => {
                let val = '';
                const input = cell.querySelector('input, textarea, select');
                if (input) {
                    if (input.tagName === 'SELECT') {
                        val = input.options[input.selectedIndex]?.text || '';
                    } else {
                        val = input.value || '';
                    }
                } else {
                    val = cell.textContent || '';
                }

                // Style mapping - Reduced font size and tightened padding
                let style = 'border: 0.5pt solid #000; text-align: center; vertical-align: middle; font-size: 9pt; padding: 2px;';

                // Compress daily columns (Index 1 to end are date columns)
                if (cellIndex > 0) {
                    style += 'width: 22pt;';
                } else {
                    style += 'width: 100pt; text-align: left; font-weight: bold;'; // Sticky-like label column
                }

                if (cell.tagName === 'TH') {
                    style += 'background-color: #2c6fff; color: #ffffff; font-weight: bold; font-size: 10pt;';
                }
                if (cell.classList.contains('sunday-holiday')) {
                    style += 'background-color: #ffcccc; color: #ff0000;';
                }

                tableHtml += `<td style="${style}">${val.replace(/\n/g, '<br>')}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</table>';

        const totalsSection = document.querySelector('.totals-section');
        const totalsList = Array.from(totalsSection.children).map(card => {
            const label = card.querySelector('.total-label').textContent;
            const value = card.querySelector('.total-value').textContent;
            let color = '#2c6fff';
            if (card.classList.contains('regular-card')) color = '#15803d';
            if (card.classList.contains('highlight-card')) color = '#ff0000';
            return { label, value, color };
        });

        // Compact totals as a small horizontal table
        let totalsHtml = '<table style="border-collapse: collapse; margin-top: 20px;"><tr>';
        totalsList.forEach(item => {
            totalsHtml += `
            <td style="border: 1pt solid #ccc; padding: 8px; text-align: center; min-width: 150px;">
                <b style="font-size: 9pt; color: #666;">${item.label}</b><br>
                <span style="font-size: 12pt; font-weight: bold; color: ${item.color};">${item.value}</span>
            </td>
        `;
        });
        totalsHtml += '</tr></table>';

        const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Bảng Chấm Công</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
            <style>
                body { font-family: 'Times New Roman', serif; }
                .title { color: #ff0000; font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
                .info { margin-bottom: 20px; font-weight: bold; }
                .info span { color: #ff0000; }
            </style>
        </head>
        <body>
            <div class="title">BẢNG CHẤM CÔNG KHOA PT - GMHS</div>
            <div class="info">
                HỌ VÀ TÊN: <span>${name.toUpperCase()}</span> &nbsp;&nbsp;&nbsp;
                CHỨC VỤ: <span>${position}</span> &nbsp;&nbsp;&nbsp;
                THÁNG: <span>${month.split('-')[1]}/${month.split('-')[0]}</span>
            </div>
            ${tableHtml}
            <div style="margin-top: 30px;">
                ${totalsHtml}
            </div>
            <div style="margin-top: 50px; text-align: right;">
                <div style="display: inline-block; text-align: center; width: 300px;">
                    <p>Ngày 26 tháng ${month.split('-')[1]} năm ${month.split('-')[0]}</p>
                    <p><b>NGƯỜI LẬP BẢNG</b></p>
                    <br><br><br>
                    <p><b style="color: #ff0000; font-size: 14pt;">${name.toUpperCase()}</b></p>
                </div>
            </div>
        </body>
        </html>
    `;

        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- DATA BACKUP & RESTORE ---
    const backupData = () => {
        const backup = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('attendance_') || key.startsWith('coeffs_')) {
                backup[key] = localStorage.getItem(key);
            }
        }

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const timestamp = now.toISOString().split('T')[0].replace(/-/g, '_');
        a.href = url;
        a.download = `Sao_Luu_Cham_Cong_${timestamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('Đã tải về file sao lưu dữ liệu!');
    };

    const restoreData = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (confirm('Bạn có chắc chắn muốn khôi phục dữ liệu? Hành động này sẽ ghi đè lên dữ liệu hiện tại.')) {
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(key, data[key]);
                    });
                    alert('Khôi phục dữ liệu thành công! Ứng dụng sẽ tự động tải lại.');
                    location.reload();
                }
            } catch (err) {
                alert('Lỗi: File dữ liệu không hợp lệ!');
            }
        };
        reader.readAsText(file);
    };

    // Event listeners for backup/restore
    const backupBtn = document.getElementById('backup-btn');
    const restoreBtn = document.getElementById('restore-btn');
    const restoreInput = document.getElementById('restore-input');

    if (backupBtn) backupBtn.addEventListener('click', backupData);
    if (restoreBtn) restoreBtn.addEventListener('click', () => restoreInput.click());
    if (restoreInput) restoreInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            restoreData(e.target.files[0]);
        }
    });

    // Control visibility of admin controls
    const adminControls = document.getElementById('admin-data-controls');
    if (adminControls && isAdmin()) {
        adminControls.style.display = 'flex';
    }

    // Network status detection
    const updateNetworkStatus = () => {
        const indicator = document.getElementById('status-indicator');
        if (!indicator) return;
        if (navigator.onLine) {
            indicator.className = 'status-indicator online';
            indicator.title = 'Đang trực tuyến';
        } else {
            indicator.className = 'status-indicator offline';
            indicator.title = 'Đang ngoại tuyến';
        }
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus(); // Initial check

    generateTable();

    // Check authentication on page load
    if (!getCurrentUser()) {
        showLoginModal();
    } else {
        updateUIForUser();
    }
});
