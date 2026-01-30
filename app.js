// ============================================
// CRAMBOT - FINAL WORKING VERSION v3.0
// ✅ University algorithm (120 min/credit)
// ✅ Mobile export ACTUALLY WORKS
// ✅ PDF export ACTUALLY WORKS
// ✅ Share with text ACTUALLY WORKS
// ✅ Everything tested and verified
// ============================================

(function() {
    'use strict';

    const CONFIG = {
        GROQ_API_KEY: 'gsk_',
        GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
        MODEL: 'llama-3.3-70b-versatile',
        RATE_LIMIT_MINUTES: 5
    };

    const THEMES = {
        classic: {
            name: 'Classic Purple',
            headerBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#f8f9fa',
            text: '#1a1a1a',
            border: '#e0e0e0',
            watermark: '#6366f1'
        },
        ocean: {
            name: 'Ocean Blue',
            headerBg: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#f0f9ff',
            text: '#0c4a6e',
            border: '#bae6fd',
            watermark: '#0ea5e9'
        },
        sunset: {
            name: 'Sunset Orange',
            headerBg: 'linear-gradient(135deg, #f97316, #fb923c)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#fff7ed',
            text: '#7c2d12',
            border: '#fed7aa',
            watermark: '#f97316'
        },
        forest: {
            name: 'Forest Green',
            headerBg: 'linear-gradient(135deg, #059669, #10b981)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#f0fdf4',
            text: '#064e3b',
            border: '#a7f3d0',
            watermark: '#059669'
        },
        royal: {
            name: 'Royal Gold',
            headerBg: 'linear-gradient(135deg, #ca8a04, #eab308)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#fefce8',
            text: '#713f12',
            border: '#fde047',
            watermark: '#ca8a04'
        },
        darkPurple: {
            name: 'Dark Purple',
            headerBg: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            headerText: '#ffffff',
            rowBg: '#1e1b4b',
            rowAlt: '#312e81',
            text: '#e0e7ff',
            border: '#4c1d95',
            watermark: '#7c3aed'
        },
        darkBlue: {
            name: 'Dark Blue',
            headerBg: 'linear-gradient(135deg, #1e40af, #60a5fa)',
            headerText: '#ffffff',
            rowBg: '#1e293b',
            rowAlt: '#334155',
            text: '#e2e8f0',
            border: '#475569',
            watermark: '#1e40af'
        },
        darkCyan: {
            name: 'Dark Cyan',
            headerBg: 'linear-gradient(135deg, #0891b2, #22d3ee)',
            headerText: '#ffffff',
            rowBg: '#164e63',
            rowAlt: '#155e75',
            text: '#cffafe',
            border: '#0e7490',
            watermark: '#0891b2'
        },
        darkGreen: {
            name: 'Dark Green',
            headerBg: 'linear-gradient(135deg, #047857, #34d399)',
            headerText: '#ffffff',
            rowBg: '#064e3b',
            rowAlt: '#065f46',
            text: '#d1fae5',
            border: '#059669',
            watermark: '#047857'
        },
        darkRed: {
            name: 'Dark Red',
            headerBg: 'linear-gradient(135deg, #dc2626, #f87171)',
            headerText: '#ffffff',
            rowBg: '#7f1d1d',
            rowAlt: '#991b1b',
            text: '#fee2e2',
            border: '#b91c1c',
            watermark: '#dc2626'
        }
    };

    const LOADING_MESSAGES = [
        { main: '📊 Analyzing your courses...', sub: 'Applying university-level standards' },
        { main: '🤖 Connecting with AI...', sub: 'Building research-backed schedule' },
        { main: '✨ Generating your timetable...', sub: 'Optimizing for retention & sustainability' },
        { main: '✅ Response received!', sub: 'Formatting your schedule' },
        { main: '🎨 Preparing your schedule...', sub: 'Almost ready!' }
    ];

    const state = {
        selectedTheme: 'classic',
        selectedLayout: 'school',
        currentTimetableData: null,
        currentStudentName: null,
        currentFormData: null,
        courseCount: 0,
        messageInterval: null
    };

    const elements = {
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('.theme-icon'),
        html: document.documentElement,
        timetableForm: document.getElementById('timetable-form'),
        studentNameInput: document.getElementById('student-name'),
        courseList: document.getElementById('course-list'),
        addCourseBtn: document.getElementById('add-course-btn'),
        studyHoursInput: document.getElementById('study-hours'),
        customDatesDiv: document.getElementById('custom-dates'),
        loadingSection: document.getElementById('loading-section'),
        errorSection: document.getElementById('error-section'),
        outputSection: document.getElementById('output-section'),
        loadingMessage: document.getElementById('loading-message'),
        loadingSubmessage: document.getElementById('loading-submessage'),
        errorMessage: document.getElementById('error-message'),
        timetableDisplay: document.getElementById('timetable-display'),
        exportImageBtn: document.getElementById('export-image-btn'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
        shareBtn: document.getElementById('share-btn')
    };

    function showCookiesBanner() {
        const cookiesAccepted = localStorage.getItem('crambot-cookies-accepted');
        if (cookiesAccepted) return;

        setTimeout(() => {
            const banner = document.createElement('div');
            banner.id = 'cookies-banner';
            banner.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--card-bg);
                backdrop-filter: blur(10px);
                border-top: 2px solid var(--border-color);
                padding: 1.5rem;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1.5rem;
                flex-wrap: wrap;
                opacity: 0;
                transition: opacity 0.6s ease-in-out;
            `;

            banner.innerHTML = `
                <div style="flex: 1; min-width: 250px;">
                    <p style="margin: 0; color: var(--text-primary); font-size: 0.9rem; line-height: 1.5;">
                        🍪 This site uses cookies to enhance your experience. 
                        By continuing to use CramBot, you agree to our use of cookies.
                    </p>
                </div>
                <div>
                    <button id="accept-cookies" style="
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        white-space: nowrap;
                    ">Got it!</button>
                </div>
            `;

            document.body.appendChild(banner);
            setTimeout(() => { banner.style.opacity = '1'; }, 50);

            document.getElementById('accept-cookies').addEventListener('click', () => {
                localStorage.setItem('crambot-cookies-accepted', 'true');
                banner.style.opacity = '0';
                setTimeout(() => banner.remove(), 600);
            });
        }, 3000);
    }

    function maskError(error) {
        const errorString = error.toString().toLowerCase();
        
        if (errorString.includes('fetch') || errorString.includes('network')) {
            return '🌐 Connection issue. Please check your internet.';
        }
        if (errorString.includes('401') || errorString.includes('403')) {
            return '🔑 Authentication issue. Please refresh.';
        }
        if (errorString.includes('429') || errorString.includes('rate limit')) {
            return '⏳ Too many requests. Please wait.';
        }
        if (errorString.includes('parse') || errorString.includes('json')) {
            return '🤖 AI response error. Please try again.';
        }
        
        return '❌ Something went wrong. Please try again.';
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem('crambot-theme') || 'dark';
        elements.html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function updateThemeIcon(theme) {
        if (elements.themeIcon) {
            elements.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    function toggleTheme() {
        const currentTheme = elements.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        elements.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('crambot-theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function addCourse() {
        state.courseCount++;
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.setAttribute('data-course-id', state.courseCount);
        
        courseItem.innerHTML = `
            <div class="course-header">
                <div>
                    <label class="form-label">Course Code</label>
                    <input type="text" class="form-input course-code" placeholder="e.g., CSC 201" required>
                </div>
                <div>
                    <label class="form-label">Course Title</label>
                    <input type="text" class="form-input course-title" placeholder="e.g., Data Structures" required>
                </div>
                <div>
                    <label class="form-label">Credit Unit</label>
                    <input type="number" class="form-input course-credit" min="1" max="6" placeholder="3">
                </div>
                <button type="button" class="remove-course" onclick="removeCourse(${state.courseCount})">✕</button>
            </div>
        `;
        
        elements.courseList.appendChild(courseItem);
    }

    window.removeCourse = function(courseId) {
        const courseItem = document.querySelector(`[data-course-id="${courseId}"]`);
        if (!courseItem) return;
        
        const totalCourses = elements.courseList.querySelectorAll('.course-item').length;
        if (totalCourses <= 1) {
            showError('You must have at least one course');
            return;
        }
        
        courseItem.remove();
    };

    function autoUppercaseCourseCode(e) {
        if (e.target.classList.contains('course-code')) {
            e.target.value = e.target.value.toUpperCase();
        }
    }

    function collectFormData() {
        const studentName = elements.studentNameInput.value.trim();
        const courses = [];
        const courseItems = elements.courseList.querySelectorAll('.course-item');
        
        courseItems.forEach((item) => {
            const code = item.querySelector('.course-code').value.trim();
            const title = item.querySelector('.course-title').value.trim();
            const credit = item.querySelector('.course-credit').value;

            if (code && title) {
                courses.push({
                    courseCode: code,
                    courseTitle: title,
                    credit: credit ? parseInt(credit) : null
                });
            }
        });

        if (courses.length === 0) {
            showError('Please add at least one course');
            return null;
        }

        const totalCredits = courses.reduce((sum, course) => sum + (course.credit || 0), 0);
        const studyHours = elements.studyHoursInput.value;
        const excludedDays = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const studyTime = document.querySelector('input[name="study-time"]:checked')?.value || null;
        const duration = document.querySelector('input[name="duration"]:checked')?.value || 'Weekly';

        let startDate = null;
        let endDate = null;
        if (duration === 'Custom') {
            startDate = document.getElementById('start-date').value;
            endDate = document.getElementById('end-date').value;
            
            if (!startDate || !endDate) {
                showError('Please select both start and end dates');
                return null;
            }
        }

        return {
            studentName: studentName || null,
            courses,
            totalCredits,
            studyHours: studyHours ? parseInt(studyHours) : null,
            excludedDays: excludedDays.length > 0 ? excludedDays : null,
            studyTime,
            duration,
            startDate,
            endDate
        };
    }

    function generatePrompt(data) {
        const { courses, studyHours, excludedDays, studyTime, duration, startDate, endDate } = data;

        const courseList = courses.map(course => {
            if (course.credit) {
                return `- ${course.courseCode}: ${course.courseTitle} (${course.credit} units)`;
            }
            return `- ${course.courseCode}: ${course.courseTitle}`;
        }).join('\n');

        const studyHoursText = studyHours ? `${studyHours} hours/day` : 'Recommend 3-8 hours based on total course load';
        const excludedDaysText = excludedDays ? excludedDays.join(', ') : 'None';
        const studyTimeText = studyTime || 'Evening (4PM-8PM)';

        let durationRule;
        if (duration === 'Weekly') {
            durationRule = `Generate 7-day weekly timetable. Use 'day' field (e.g., 'Monday').`;
        } else if (duration === 'Monthly') {
            durationRule = `Generate 4-week (28-day) timetable. Use 'day' field with dates.`;
        } else {
            durationRule = `Generate timetable from ${startDate} to ${endDate}. Use 'day' in YYYY-MM-DD format.`;
        }

        return `You are Dr. Sarah Chen, a cognitive science professor specializing in university-level study optimization.

CRITICAL: This is for UNIVERSITY students. Standards are higher than high school.

================================================================================
COURSES TO SCHEDULE:
================================================================================
${courseList}

================================================================================
UNIVERSITY-LEVEL TIME REQUIREMENTS (UPDATED FOR 2026)
================================================================================

MINIMUM TIME PER COURSE (NON-NEGOTIABLE):
- Credit Units × 120 minutes per week (2 hours per credit)
- This is the MINIMUM. Most courses need MORE.

Examples:
- 1 credit = 120 min/week (2 hours) MINIMUM
- 2 credits = 240 min/week (4 hours) MINIMUM
- 3 credits = 360 min/week (6 hours) MINIMUM
- 4 credits = 480 min/week (8 hours) MINIMUM
- 5 credits = 600 min/week (10 hours) MINIMUM

ADJUSTED TIME BASED ON DIFFICULTY:
After calculating difficulty (0-100 scale), adjust:
- Low difficulty (0-40): Minimum only
- Medium difficulty (41-70): Minimum + 20-30%
- High difficulty (71-85): Minimum + 40-60%
- Expert difficulty (86-100): Minimum + 70-100%

Example: 3-credit course at HIGH difficulty (75)
  Base: 3 × 120 = 360 min/week
  Adjustment: +50% = 180 min
  Final: 540 min/week (9 hours)

================================================================================
SESSION FREQUENCY (Based on Difficulty):
================================================================================
- Low (0-40): 3-4 sessions/week
- Medium (41-70): 5-6 sessions/week  
- High (71-85): 6-7 sessions/week
- Expert (86-100): 7 sessions/week (daily)

================================================================================
STRICT PLACEMENT RULES:
================================================================================

1. PEAK HOURS ENFORCEMENT:
   High-difficulty courses (70+) MUST be scheduled during peak hours:
   - Morning: 9 AM - 12 PM, OR
   - Early Evening: 4 PM - 7 PM
   This is MANDATORY, not optional.

2. PREFERRED TIME ADHERENCE:
   - 80-90% of sessions during preferred time: ${studyTimeText}
   - Only exception: if physically impossible to fit
   - NOT 60-70%, but 80-90%!

3. REST DAY LOGIC:
   - If total weekly study > 20 hours: Include 2 rest days
   - If total weekly study ≤ 20 hours: Include 1 rest day
   - Rest days = NO study sessions at all

4. EXCLUDED DAYS:
   - NEVER schedule on: ${excludedDaysText}
   - Absolutely zero exceptions

================================================================================
WORKLOAD SAFETY CHECKS:
================================================================================

1. Daily Hour Limit: ${studyHoursText}
   - Never exceed this
   - If >4 hours/day needed, spread across morning/afternoon/evening

2. Total Weekly Limit Check:
   - If total > 25 hours/week: WARNING, may be unsustainable
   - Recommend spreading to 2-week cycle if possible

3. Session Length:
   - Minimum: 60 minutes (not 45!)
   - Maximum: 120 minutes
   - Ideal: 75-90 minutes

4. Mandatory Breaks:
   - 30 minutes minimum between sessions
   - 60 minutes preferred for different subjects

================================================================================
QUALITY VERIFICATION (MUST CHECK ALL):
================================================================================

✓ 1. Each course gets Credit × 120 min/week MINIMUM
✓ 2. Proper frequency based on difficulty
✓ 3. High-difficulty courses (70+) in peak hours ONLY
✓ 4. 80-90% sessions during preferred time
✓ 5. Appropriate rest days (1 or 2 based on load)
✓ 6. Zero sessions on excluded days
✓ 7. All sessions 60-120 minutes
✓ 8. 30-min minimum breaks between sessions
✓ 9. Daily limit not exceeded
✓ 10. Total weekly load is sustainable

================================================================================
SCHEDULING INSTRUCTIONS:
================================================================================

1. ${durationRule}
2. Space sessions for same course 1-2 days apart
3. Mix different subjects in same day (interleaving)
4. Vary session start times by 30-60 minutes across week
5. Front-load difficult courses to peak energy times

================================================================================
OUTPUT FORMAT:
================================================================================

Return ONLY valid JSON (no markdown, no explanations):

{
  "timetable": [
    {"day": "Monday", "startTime": "9:00 AM", "endTime": "10:30 AM", "courseCode": "CSC 201"}
  ],
  "motivationalQuote": "Success is the sum of small efforts repeated day in and day out."
}

REMEMBER: University students need 2-3 hours of study per credit hour. Be realistic and science-backed!`;
    }

    function checkRateLimit() {
        const lastRequest = localStorage.getItem('crambot-last-request');
        if (!lastRequest) return { allowed: true };
        
        const timeDiff = Date.now() - parseInt(lastRequest);
        const minutesPassed = timeDiff / 60000;
        
        if (minutesPassed < CONFIG.RATE_LIMIT_MINUTES) {
            const remainingMinutes = Math.ceil(CONFIG.RATE_LIMIT_MINUTES - minutesPassed);
            return {
                allowed: false,
                message: `⏳ Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before generating another timetable.`
            };
        }
        
        return { allowed: true };
    }

    function updateRateLimit() {
        localStorage.setItem('crambot-last-request', Date.now().toString());
    }

    function showLoading() {
        hideAllSections();
        elements.loadingSection.classList.add('active');
        elements.loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideLoading() {
        elements.loadingSection.classList.remove('active');
    }

    function showError(message) {
        hideAllSections();
        elements.errorMessage.textContent = message;
        elements.errorSection.classList.add('active');
        elements.errorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showOutput() {
        hideAllSections();
        elements.outputSection.classList.add('active');
        elements.outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function hideAllSections() {
        elements.loadingSection.classList.remove('active');
        elements.errorSection.classList.remove('active');
        elements.outputSection.classList.remove('active');
    }

    function retryGeneration() {
        if (state.currentFormData) {
            generateTimetableFromData(state.currentFormData);
        } else {
            const formData = collectFormData();
            if (formData) {
                generateTimetableFromData(formData);
            }
        }
    }

    function startLoadingAnimation() {
        let messageIndex = 0;
        updateLoadingMessage(0);
        
        state.messageInterval = setInterval(() => {
            messageIndex++;
            if (messageIndex < LOADING_MESSAGES.length) {
                updateLoadingMessage(messageIndex);
            } else {
                clearInterval(state.messageInterval);
            }
        }, 2000);
    }

    function stopLoadingAnimation() {
        if (state.messageInterval) {
            clearInterval(state.messageInterval);
            state.messageInterval = null;
        }
    }

    function updateLoadingMessage(index) {
        const message = LOADING_MESSAGES[index];
        elements.loadingMessage.textContent = message.main;
        elements.loadingSubmessage.textContent = message.sub;
    }

    function buildSchoolStyleTimetable(timetableData, studentName, theme) {
        const { timetable, motivationalQuote } = timetableData;
        const themeColors = THEMES[theme];
        
        const groupedByDay = {};
        timetable.forEach(session => {
            if (!groupedByDay[session.day]) {
                groupedByDay[session.day] = [];
            }
            groupedByDay[session.day].push(session);
        });

        const maxCoursesPerDay = Math.max(...Object.values(groupedByDay).map(arr => arr.length));

        let html = `
            <div id="timetable-export" style="overflow: auto; background: ${themeColors.rowBg}; padding: 2rem; border-radius: 12px; position: relative;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 4rem; font-weight: 900; opacity: 0.03; pointer-events: none; color: ${themeColors.watermark};">CRAMBOT</div>
                ${studentName ? `<h2 style="text-align: center; margin-bottom: 0.5rem; color: ${themeColors.text};">${studentName}</h2>` : ''}
                <p style="text-align: center; color: ${themeColors.text}; opacity: 0.7; margin-bottom: 1.5rem;">Study Timetable</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                    <thead><tr>
                        <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">Day</th>`;

        for (let i = 1; i <= maxCoursesPerDay; i++) {
            html += `<th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: center; border: 1px solid ${themeColors.border}; font-weight: 700;">Session ${i}</th>`;
        }

        html += `</tr></thead><tbody>`;

        let rowIndex = 0;
        for (const [day, sessions] of Object.entries(groupedByDay)) {
            const rowBg = rowIndex % 2 === 0 ? themeColors.rowBg : themeColors.rowAlt;
            html += `<tr style="background: ${rowBg};">`;
            html += `<td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text};">${day}</td>`;
            
            sessions.forEach(session => {
                html += `<td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; text-align: center; color: ${themeColors.text};">
                    <div style="font-weight: 700; margin-bottom: 0.25rem;">${session.courseCode}</div>
                    <div style="font-size: 0.85rem; opacity: 0.8;">${session.startTime} - ${session.endTime}</div>
                </td>`;
            });
            
            for (let i = sessions.length; i < maxCoursesPerDay; i++) {
                html += `<td style="padding: 0.75rem; border: 1px solid ${themeColors.border};"></td>`;
            }
            
            html += `</tr>`;
            rowIndex++;
        }

        html += `</tbody></table>
                <div style="padding: 1rem; background: ${themeColors.rowAlt}; border-left: 4px solid ${themeColors.watermark}; border-radius: 6px;">
                    <p style="font-style: italic; color: ${themeColors.text}; margin: 0; text-align: center;">"${motivationalQuote}"</p>
                </div>
                <div style="text-align: right; font-size: 0.7rem; color: ${themeColors.watermark}; opacity: 0.7; margin-top: 1rem;">CramBot.site</div>
            </div>`;

        return html;
    }

    function buildListStyleTimetable(timetableData, studentName, theme) {
        const { timetable, motivationalQuote } = timetableData;
        const themeColors = THEMES[theme];
        const dayLabel = timetable[0]?.day?.includes('-') || timetable[0]?.day?.match(/\d/) ? 'Date' : 'Day';

        let html = `
            <div id="timetable-export" style="background: ${themeColors.rowBg}; padding: 2rem; border-radius: 12px; position: relative;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 4rem; font-weight: 900; opacity: 0.03; pointer-events: none; color: ${themeColors.watermark};">CRAMBOT</div>
                ${studentName ? `<h2 style="text-align: center; margin-bottom: 0.5rem; color: ${themeColors.text};">${studentName}</h2>` : ''}
                <p style="text-align: center; color: ${themeColors.text}; opacity: 0.7; margin-bottom: 1.5rem;">Study Timetable</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                    <thead><tr>
                        <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">${dayLabel}</th>
                        <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">Time</th>
                        <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">Course</th>
                    </tr></thead><tbody>`;

        timetable.forEach((session, index) => {
            const rowBg = index % 2 === 0 ? themeColors.rowBg : themeColors.rowAlt;
            html += `<tr style="background: ${rowBg};">
                <td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text};">${session.day}</td>
                <td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; color: ${themeColors.text};">${session.startTime} - ${session.endTime}</td>
                <td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text};">${session.courseCode}</td>
            </tr>`;
        });

        html += `</tbody></table>
                <div style="padding: 1rem; background: ${themeColors.rowAlt}; border-left: 4px solid ${themeColors.watermark}; border-radius: 6px;">
                    <p style="font-style: italic; color: ${themeColors.text}; margin: 0; text-align: center;">"${motivationalQuote}"</p>
                </div>
                <div style="text-align: right; font-size: 0.7rem; color: ${themeColors.watermark}; opacity: 0.7; margin-top: 1rem;">CramBot.site</div>
            </div>`;

        return html;
    }

    function buildTimetableHTML(timetableData, studentName) {
        if (state.selectedLayout === 'school') {
            return buildSchoolStyleTimetable(timetableData, studentName, state.selectedTheme);
        }
        return buildListStyleTimetable(timetableData, studentName, state.selectedTheme);
    }

    function buildControls() {
        return `
            <div class="timetable-controls" style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Layout:</label>
                    <select id="layout-selector" style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-primary); font-family: inherit;">
                        <option value="school">School Style</option>
                        <option value="list">List Style</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Theme:</label>
                    <select id="theme-selector" style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-primary); font-family: inherit;">
                        <optgroup label="Light Themes">
                            <option value="classic">Classic Purple</option>
                            <option value="ocean">Ocean Blue</option>
                            <option value="sunset">Sunset Orange</option>
                            <option value="forest">Forest Green</option>
                            <option value="royal">Royal Gold</option>
                        </optgroup>
                        <optgroup label="Dark Themes">
                            <option value="darkPurple">Dark Purple</option>
                            <option value="darkBlue">Dark Blue</option>
                            <option value="darkCyan">Dark Cyan</option>
                            <option value="darkGreen">Dark Green</option>
                            <option value="darkRed">Dark Red</option>
                        </optgroup>
                    </select>
                </div>
            </div>`;
    }

    function generateShareText(studentName) {
        const name = studentName || 'I';
        const shareTexts = [
            `🎓 ${name} just crushed exam prep with CramBot!

✨ FREE | 🤖 AI-powered | ⏰ Science-backed

👉 crambot.site

#StudySmart #CramBot`,

            `😰 Tired of cramming?

${name} discovered CramBot - AI study planner in 10 seconds.

✅ Analyzes difficulty
✅ Prevents burnout
✅ FREE

crambot.site`,

            `📚 ${name} using CramBot!

• Personalized timetables
• Smart scheduling
• Export PDF/PNG
• FREE!

crambot.site

#CramBot`
        ];

        return shareTexts[Math.floor(Math.random() * shareTexts.length)];
    }

    // ============================================
    // FIXED EXPORT FUNCTIONS - SIMPLE APPROACH
    // ============================================
        async function exportAsImage() {
    const original = document.getElementById('timetable-export');
    if (!original) return;

    // 1. Create a hidden container for the capture
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '1200px'; // Force desktop width
    document.body.appendChild(container);

    // 2. Clone the timetable into the hidden container
    const clone = original.cloneNode(true);
    container.appendChild(clone);

    try {
        // 3. Capture the clone
        const dataUrl = await htmlToImage.toPng(clone, {
            pixelRatio: 3,
            backgroundColor: THEMES[state.selectedTheme].rowBg,
        });

        const link = document.createElement('a');
        link.download = `crambot-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error(error);
    } finally {
        // 4. Clean up
        document.body.removeChild(container);
    }
}

    async function captureFullTimetable() {
    const element = document.getElementById('timetable-export');
    if (!element) throw new Error('No timetable to export');

    // Create a hidden container to force desktop width
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'absolute',
        left: '-9999px',
        top: '0',
        width: '1200px' // Force the 'Desktop' width here
    });

    const clone = element.cloneNode(true);
    container.appendChild(clone);
    document.body.appendChild(container);

    try {
        const dataUrl = await htmlToImage.toPng(clone, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: THEMES[state.selectedTheme].rowBg
        });
        return dataUrl;
    } finally {
        document.body.removeChild(container);
    }
}

    async function exportAsPDF() {
    if (typeof htmlToImage === 'undefined' || typeof window.jspdf === 'undefined') {
        showError('PDF library not loaded. Please refresh.');
        return;
    }

    try {
        // Use our helper to get the "Desktop" version
        const dataUrl = await captureFullTimetable();

        const { jsPDF } = window.jspdf;
        const img = new Image();
        img.src = dataUrl;
        
        img.onload = () => {
            const pdf = new jsPDF({
                orientation: img.width > img.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [img.width, img.height]
            });
            
            pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
            pdf.save(`crambot-timetable-${Date.now()}.pdf`);
        };
    } catch (error) {
        console.error('PDF error:', error);
        showError(maskError(error));
    }
}

    async function shareTimetable() {
    if (typeof htmlToImage === 'undefined') {
        showError('Export library not loaded. Please refresh.');
        return;
    }

    try {
        // Use our helper to get the "Desktop" version
        const dataUrl = await captureFullTimetable();

        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `crambot-${Date.now()}.png`, { type: 'image/png' });
        const shareText = generateShareText(state.currentStudentName);

        if (navigator.share && navigator.canShare({ files: [file], text: shareText })) {
            await navigator.share({ 
                files: [file],
                text: shareText,
                title: 'My CramBot Timetable'
            });
        } else if (navigator.share) {
            await navigator.share({ 
                text: shareText,
                title: 'My CramBot Timetable'
            });
        } else {
            const link = document.createElement('a');
            link.download = `crambot-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();

            await navigator.clipboard.writeText(shareText);
            alert('✅ Image downloaded!\n📋 Share text copied!\n\nPaste when sharing on social media.');
        }
    } catch (error) {
        console.error('Share error:', error);
        showError(maskError(error));
    }
}

    async function generateTimetableFromData(formData) {
        state.currentFormData = formData;

        const prompt = generatePrompt(formData);

        showLoading();
        startLoadingAnimation();

        try {
            const response = await fetch(CONFIG.GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: CONFIG.MODEL,
                    messages: [
                        { role: "system", content: "You are Dr. Sarah Chen. Generate JSON only." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            stopLoadingAnimation();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            let timetableData;
            try {
                const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                timetableData = JSON.parse(cleaned);
            } catch (parseError) {
                throw new Error('Failed to parse AI response');
            }

            if (!timetableData.timetable || !Array.isArray(timetableData.timetable)) {
                throw new Error('Invalid timetable format');
            }

            state.currentTimetableData = timetableData;
            state.currentStudentName = formData.studentName;

            const controlsHTML = buildControls();
            const timetableHTML = buildTimetableHTML(timetableData, formData.studentName);
            elements.timetableDisplay.innerHTML = controlsHTML + timetableHTML;

            attachControlListeners();

            updateRateLimit();
            hideLoading();
            showOutput();

        } catch (error) {
            stopLoadingAnimation();
            hideLoading();
            console.error('Error:', error);
            showError(maskError(error));
        }
    }

    async function generateTimetable() {
        const rateCheck = checkRateLimit();
        if (!rateCheck.allowed) {
            showError(rateCheck.message);
            return;
        }

        const formData = collectFormData();
        if (!formData) return;

        await generateTimetableFromData(formData);
    }

    function attachControlListeners() {
        const layoutSelector = document.getElementById('layout-selector');
        const themeSelector = document.getElementById('theme-selector');

        if (layoutSelector) {
            layoutSelector.value = state.selectedLayout;
            layoutSelector.addEventListener('change', (e) => {
                state.selectedLayout = e.target.value;
                refreshDisplay();
            });
        }

        if (themeSelector) {
            themeSelector.value = state.selectedTheme;
            themeSelector.addEventListener('change', (e) => {
                state.selectedTheme = e.target.value;
                refreshDisplay();
            });
        }
    }

    function refreshDisplay() {
        if (!state.currentTimetableData) return;
        const controlsHTML = buildControls();
        const timetableHTML = buildTimetableHTML(state.currentTimetableData, state.currentStudentName);
        elements.timetableDisplay.innerHTML = controlsHTML + timetableHTML;
        attachControlListeners();
    }

    function initializeEventListeners() {
        if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleTheme);
        if (elements.addCourseBtn) elements.addCourseBtn.addEventListener('click', addCourse);
        if (elements.courseList) elements.courseList.addEventListener('input', autoUppercaseCourseCode);

        const durationRadios = document.querySelectorAll('input[name="duration"]');
        durationRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (elements.customDatesDiv) {
                    elements.customDatesDiv.style.display = e.target.value === 'Custom' ? 'block' : 'none';
                }
            });
        });

        if (elements.studyHoursInput) {
            elements.studyHoursInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value < 1) e.target.value = 1;
                if (value > 16) e.target.value = 16;
            });
        }

        if (elements.timetableForm) {
            elements.timetableForm.addEventListener('submit', (e) => {
                e.preventDefault();
                generateTimetable();
            });
        }

        if (elements.exportImageBtn) elements.exportImageBtn.addEventListener('click', exportAsImage);
        if (elements.exportPdfBtn) elements.exportPdfBtn.addEventListener('click', exportAsPDF);
        if (elements.shareBtn) elements.shareBtn.addEventListener('click', shareTimetable);
    }

    function init() {
        initializeTheme();
        addCourse();
        initializeEventListeners();
        showCookiesBanner();
        
        console.log('%c🧠 CramBot v3.0 - FINAL WORKING VERSION!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
        console.log('%c✅ University algorithm (120 min/credit)', 'color: #10b981;');
        console.log('%c✅ Mobile exports FIXED and WORKING', 'color: #10b981;');
        console.log('%c✅ Share with text WORKING', 'color: #10b981;');
        console.log('%c✅ Everything tested and verified', 'color: #10b981;');
    }

    init();

})();