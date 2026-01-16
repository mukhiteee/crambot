// ============================================
// CRAMBOT - CLEAN & ORGANIZED JAVASCRIPT
// AI-Powered Study Timetable Generator
// ============================================

(function() {
    'use strict';

    // ============================================
    // 1. CONFIGURATION & CONSTANTS
    // ============================================
    
    const CONFIG = {
        GROQ_API_KEY: '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',
        GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
        MODEL: 'llama-3.3-70b-versatile',
        RATE_LIMIT_MINUTES: 10
    };

    const THEMES = {
        // Light Themes
        classic: {
            name: 'Classic Purple',
            headerBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#f8f9fa',
            text: '#1a1a1a',
            border: '#e0e0e0'
        },
        ocean: {
            name: 'Ocean Blue',
            headerBg: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#f0f9ff',
            text: '#0c4a6e',
            border: '#bae6fd'
        },
        sunset: {
            name: 'Sunset Orange',
            headerBg: 'linear-gradient(135deg, #f97316, #fb923c)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#fff7ed',
            text: '#7c2d12',
            border: '#fed7aa'
        },
        forest: {
            name: 'Forest Green',
            headerBg: 'linear-gradient(135deg, #059669, #10b981)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#f0fdf4',
            text: '#064e3b',
            border: '#a7f3d0'
        },
        royal: {
            name: 'Royal Gold',
            headerBg: 'linear-gradient(135deg, #ca8a04, #eab308)',
            headerText: '#ffffff',
            rowBg: '#ffffff',
            rowAlt: '#fefce8',
            text: '#713f12',
            border: '#fde047'
        },
        
        // Dark Themes
        darkPurple: {
            name: 'Dark Purple',
            headerBg: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            headerText: '#ffffff',
            rowBg: '#1a1a2e',
            rowAlt: '#16213e',
            text: '#e5e5e5',
            border: '#2d3748'
        },
        darkBlue: {
            name: 'Dark Blue',
            headerBg: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            headerText: '#ffffff',
            rowBg: '#0f172a',
            rowAlt: '#1e293b',
            text: '#e2e8f0',
            border: '#334155'
        },
        darkCyan: {
            name: 'Dark Cyan',
            headerBg: 'linear-gradient(135deg, #0891b2, #06b6d4)',
            headerText: '#ffffff',
            rowBg: '#164e63',
            rowAlt: '#155e75',
            text: '#e0f2fe',
            border: '#0e7490'
        },
        darkGreen: {
            name: 'Dark Green',
            headerBg: 'linear-gradient(135deg, #047857, #10b981)',
            headerText: '#ffffff',
            rowBg: '#064e3b',
            rowAlt: '#065f46',
            text: '#d1fae5',
            border: '#059669'
        },
        darkRed: {
            name: 'Dark Red',
            headerBg: 'linear-gradient(135deg, #dc2626, #ef4444)',
            headerText: '#ffffff',
            rowBg: '#7f1d1d',
            rowAlt: '#991b1b',
            text: '#fee2e2',
            border: '#b91c1c'
        }
    };

    const LOADING_MESSAGES = [
        { main: '📊 Analyzing your courses...', sub: 'Calculating optimal study distribution' },
        { main: '🤖 Connecting with AI...', sub: 'Preparing personalized recommendations' },
        { main: '✨ Generating your timetable...', sub: 'AI is working its magic' },
        { main: '✅ Response received!', sub: 'Formatting your schedule' },
        { main: '🎨 Preparing your schedule...', sub: 'Almost ready!' }
    ];

    // ============================================
    // 2. STATE MANAGEMENT
    // ============================================
    
    const state = {
        selectedTheme: 'classic',
        selectedLayout: 'school',
        currentTimetableData: null,
        currentStudentName: null,
        courseCount: 0,
        messageInterval: null
    };

    // ============================================
    // 3. DOM ELEMENTS
    // ============================================
    
    const elements = {
        // Theme
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('.theme-icon'),
        html: document.documentElement,
        
        // Form
        timetableForm: document.getElementById('timetable-form'),
        studentNameInput: document.getElementById('student-name'),
        courseList: document.getElementById('course-list'),
        addCourseBtn: document.getElementById('add-course-btn'),
        studyHoursInput: document.getElementById('study-hours'),
        customDatesDiv: document.getElementById('custom-dates'),
        
        // Sections
        loadingSection: document.getElementById('loading-section'),
        errorSection: document.getElementById('error-section'),
        outputSection: document.getElementById('output-section'),
        
        // Messages
        loadingMessage: document.getElementById('loading-message'),
        loadingSubmessage: document.getElementById('loading-submessage'),
        errorMessage: document.getElementById('error-message'),
        
        // Output
        timetableDisplay: document.getElementById('timetable-display'),
        exportImageBtn: document.getElementById('export-image-btn'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
        shareBtn: document.getElementById('share-btn')
    };

    // ============================================
    // 4. THEME MANAGEMENT
    // ============================================
    
    function initializeTheme() {
        const savedTheme = localStorage.getItem('crambot-theme') || 'dark';
        elements.html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function updateThemeIcon(theme) {
        elements.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    function toggleTheme() {
        const currentTheme = elements.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        elements.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('crambot-theme', newTheme);
        updateThemeIcon(newTheme);
    }

    // ============================================
    // 5. COURSE MANAGEMENT
    // ============================================
    
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

    // ============================================
    // 6. FORM DATA COLLECTION
    // ============================================
    
    function collectFormData() {
        const studentName = elements.studentNameInput.value.trim();
        
        // Collect courses
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
            showError('Please add at least one course with code and title filled');
            return null;
        }

        // Calculate total credits
        const totalCredits = courses.reduce((sum, course) => sum + (course.credit || 0), 0);

        // Collect preferences
        const studyHours = elements.studyHoursInput.value;
        const excludedDays = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        const studyTime = document.querySelector('input[name="study-time"]:checked')?.value || null;
        const duration = document.querySelector('input[name="duration"]:checked')?.value || 'Weekly';

        let startDate = null;
        let endDate = null;
        if (duration === 'Custom') {
            startDate = document.getElementById('start-date').value;
            endDate = document.getElementById('end-date').value;
            
            if (!startDate || !endDate) {
                showError('Please select both start and end dates for custom duration');
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

    // ============================================
    // 7. AI PROMPT GENERATION
    // ============================================
    
    function generatePrompt(data) {
        const { courses, totalCredits, studyHours, excludedDays, studyTime, duration, startDate, endDate } = data;

        // Build course list
        const courseList = courses.map(course => {
            if (course.credit) {
                return `- ${course.courseCode}: ${course.courseTitle} (${course.credit} units)`;
            }
            return `- ${course.courseCode}: ${course.courseTitle} (credit unit not provided)`;
        }).join('\n');

        // Study hours text
        const studyHoursText = studyHours 
            ? `${studyHours} hours` 
            : 'Not specified (AI should recommend)';
        
        const studyHoursRule = studyHours
            ? `Distribute approximately ${studyHours} hours per day across courses based on difficulty scores. Higher difficulty courses get proportionally more time.`
            : 'Calculate recommended study hours based on total difficulty score of all courses. Recommend between 2-8 hours per day depending on course load. Higher difficulty = more daily hours.';

        // Excluded days text
        const excludedDaysText = excludedDays 
            ? excludedDays.join(', ') 
            : 'None (all days available)';

        // Study time text
        const studyTimeText = studyTime || 'Not specified';
        const studyTimeRule = studyTime
            ? `${studyTime} is the PREFERRED time (not mandatory). Aim for 60-70% of sessions during ${studyTime}. If difficulty scores are high or total study time increases, distribute sessions across other times of day to avoid jam-packing. Balance is key.`
            : 'Use Evening as default preference (60-70% of sessions), but distribute flexibly across the day based on course load. Avoid scheduling all sessions at the same time. Evening = 4PM-8PM.';

        // Duration rule
        let durationRule;
        if (duration === 'Weekly') {
            durationRule = `Generate a 7-day weekly timetable (Monday-Sunday). Exclude days from excluded list. Use 'day' field in JSON (e.g., 'Monday').`;
        } else if (duration === 'Monthly') {
            durationRule = `Generate a 4-week (28-day) monthly timetable. Exclude specified days each week. Use 'day' field with dates (e.g., 'January 20', 'January 21').`;
        } else if (duration === 'Custom') {
            durationRule = `Generate a timetable from ${startDate} to ${endDate}. Exclude specified days. Use 'day' field with actual dates in format 'YYYY-MM-DD'.`;
        }

        return `You are Dr. Sarah Chen, a cognitive science professor and academic performance consultant with 15+ years of experience helping students optimize their study schedules. You've worked with thousands of students and understand the psychology of learning, retention, and burnout prevention.

TASK: Create a scientifically-backed, personalized study timetable that maximizes retention while preventing burnout.

===== STEP 1: DEEP COURSE ANALYSIS =====

For EACH course, calculate a comprehensive difficulty score (0-100) using these factors:

A) CREDIT WEIGHT (if provided):
   - Each credit unit = 10 points baseline
   - 1 credit = 10 points, 2 credits = 20 points, etc.

B) COURSE COMPLEXITY ANALYSIS:
   Research the course title and consider:
   
   1. Subject Difficulty (+0 to +30 points):
      - Introductory/100-level: +5 points
      - Intermediate/200-level: +10 points  
      - Advanced/300-level: +20 points
      - Expert/400+ level: +30 points
   
   2. Cognitive Load (+0 to +25 points):
      - Memorization-heavy (History, Biology): +10
      - Application-heavy (Math, Programming): +20
      - Synthesis-heavy (Philosophy, Research): +25
   
   3. Prerequisites (+0 to +15 points):
      - No prerequisites: +0
      - 1-2 prerequisites: +8
      - 3+ prerequisites: +15
   
   4. Typical Workload (+0 to +20 points):
      - Light reading/practice: +5
      - Moderate assignments: +10
      - Heavy projects/labs: +15
      - Thesis/capstone level: +20

C) FINAL DIFFICULTY SCORE:
   - If credit provided: (Credit Weight × 0.5) + (Complexity Score × 0.5)
   - If NO credit: Use full Complexity Score

===== STEP 2: SMART TIME ALLOCATION =====

For each course, calculate weekly study requirement:

MINIMUM TIME = Credit Units × 60 minutes (non-negotiable baseline)

ADJUSTED TIME based on difficulty:
- Low difficulty (0-40): Use minimum time only
- Medium difficulty (41-70): Add 20-30% to minimum
- High difficulty (71-85): Add 40-50% to minimum  
- Expert difficulty (86-100): Add 60-80% to minimum

FREQUENCY RULES:
- Low difficulty (0-40): 2-3 sessions/week (allow gaps for absorption)
- Medium difficulty (41-70): 4-5 sessions/week
- High difficulty (71-85): 5-6 sessions/week
- Expert difficulty (86-100): 6-7 sessions/week (near-daily)

SESSION LENGTH OPTIMIZATION:
- Ideal session: 60-90 minutes (peak focus window)
- Minimum session: 45 minutes (anything less is ineffective)
- Maximum session: 120 minutes (diminishing returns after)
- NEVER schedule 3+ hour marathon sessions

===== STEP 3: STUDENT DATA =====
COURSES:
${courseList}

TOTAL CREDITS: ${totalCredits || 'Not applicable'}
AVAILABLE STUDY HOURS PER DAY: ${studyHoursText}
EXCLUDED DAYS: ${excludedDaysText}
PREFERRED STUDY TIME: ${studyTimeText}
TIMETABLE DURATION: ${duration}

===== STEP 4: SCHEDULING STRATEGY =====

CORE RULES:
1. RESPECT MINIMUM TIME: Each course MUST get Credit × 60 min/week minimum
2. DIFFICULTY-BASED FREQUENCY: Follow the frequency rules above strictly
3. ${studyHoursRule}
4. ABSOLUTE DAY EXCLUSION: NEVER schedule on ${excludedDaysText}
5. TIME PREFERENCE: ${studyTimeRule}

COGNITIVE OPTIMIZATION:
1. SPACING EFFECT: Space sessions 1-2 days apart when possible (better retention)
2. INTERLEAVING: Alternate subjects rather than blocking same subject
3. TIME-OF-DAY MATCHING:
   - High-difficulty courses → Peak energy times (morning or early evening)
   - Medium-difficulty → Flexible placement
   - Low-difficulty → Can use off-peak times
4. ENERGY MANAGEMENT: Never stack 3+ high-difficulty courses in one day

ANTI-BURNOUT MEASURES:
1. NO JAM-PACKING: If daily study > 4 hours, MUST spread across multiple time slots
   - Example: Don't do 5 hours straight 4PM-9PM
   - Instead: 2 hours morning, 1.5 hours afternoon, 1.5 hours evening
2. BREATHING SPACE: Minimum 30-minute gap between sessions (brain reset time)
3. WEEKLY VARIATION: Vary start times by 30-60 minutes to prevent monotony
4. ONE REST DAY: If weekly schedule, include 1 complete rest day (no study)

DURATION LOGIC:
${durationRule}

===== STEP 5: OUTPUT FORMAT =====

Return ONLY valid JSON (no markdown, no explanations):

{
  "timetable": [
    {
      "day": "Monday",
      "startTime": "9:00 AM",
      "endTime": "10:30 AM",
      "courseCode": "CSC 201"
    }
  ],
  "motivationalQuote": "Success is the sum of small efforts repeated day in and day out."
}

===== QUALITY CHECKLIST =====
Before returning, verify:
✓ Each course meets minimum weekly time (Credit × 60 min)
✓ Low-difficulty courses appear 2-3x/week (not daily)
✓ High-difficulty courses appear 5-7x/week
✓ No sessions longer than 120 minutes
✓ Daily study spread across multiple time blocks if > 4 hours
✓ Sessions spaced 1-2 days apart when possible
✓ Excluded days have ZERO sessions
✓ 60-70% of sessions in preferred time (if specified)
✓ At least one complete rest day in weekly schedules

REMEMBER: A great timetable is challenging but sustainable. Push the student, but don't break them.`;
    }

    // ============================================
    // 8. RATE LIMITING
    // ============================================
    
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

    // ============================================
    // 9. UI STATE MANAGEMENT
    // ============================================
    
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

    // ============================================
    // 10. LOADING ANIMATION
    // ============================================
    
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

    // ============================================
    // 11. TIMETABLE BUILDERS
    // ============================================
    
    function buildSchoolStyleTimetable(timetableData, studentName, theme) {
        const { timetable, motivationalQuote } = timetableData;
        const themeColors = THEMES[theme];
        
        // Group by day
        const groupedByDay = {};
        timetable.forEach(session => {
            if (!groupedByDay[session.day]) {
                groupedByDay[session.day] = [];
            }
            groupedByDay[session.day].push(session);
        });

        const maxCoursesPerDay = Math.max(...Object.values(groupedByDay).map(arr => arr.length));

        let html = `
            <div class="timetable-container" id="timetable-export" style="position: relative; background: white; padding: 3rem;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 6rem; font-weight: 900; color: rgba(0,0,0,0.02); pointer-events: none; white-space: nowrap; z-index: 0;">CRAMBOT</div>
                <div style="position: absolute; bottom: 1rem; right: 1rem; font-size: 0.75rem; color: rgba(0,0,0,0.3); z-index: 10;">Generated by CramBot.com</div>
                <div style="position: relative; z-index: 1;">
                    ${studentName ? `<h2 style="text-align: center; margin-bottom: 0.5rem; color: ${themeColors.text}; font-size: 1.8rem;">${studentName}</h2>` : ''}
                    <p style="text-align: center; color: ${themeColors.text}; opacity: 0.7; margin-bottom: 2rem; font-size: 0.9rem;">Study Timetable</p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
                        <thead><tr>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 1rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">Day/Date</th>`;

        for (let i = 1; i <= maxCoursesPerDay; i++) {
            html += `<th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 1rem; text-align: center; border: 1px solid ${themeColors.border}; font-weight: 700;">Session ${i}</th>`;
        }

        html += `</tr></thead><tbody>`;

        let rowIndex = 0;
        for (const [day, sessions] of Object.entries(groupedByDay)) {
            const rowBg = rowIndex % 2 === 0 ? themeColors.rowBg : themeColors.rowAlt;
            html += `<tr style="background: ${rowBg};">`;
            html += `<td style="padding: 1rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text};">${day}</td>`;
            
            sessions.forEach(session => {
                html += `<td style="padding: 1rem; border: 1px solid ${themeColors.border}; text-align: center; color: ${themeColors.text};">
                    <div style="font-weight: 700; margin-bottom: 0.25rem;">${session.courseCode}</div>
                    <div style="font-size: 0.85rem; opacity: 0.7;">${session.startTime} - ${session.endTime}</div>
                </td>`;
            });
            
            for (let i = sessions.length; i < maxCoursesPerDay; i++) {
                html += `<td style="padding: 1rem; border: 1px solid ${themeColors.border}; background: rgba(0,0,0,0.02);"></td>`;
            }
            
            html += `</tr>`;
            rowIndex++;
        }

        const headerColor = themeColors.headerBg.split(',')[0].replace('linear-gradient(135deg', '').trim();
        html += `</tbody></table>
                    <div style="padding: 1.5rem; background: ${themeColors.rowAlt}; border-left: 4px solid ${headerColor}; border-radius: 8px; text-align: center;">
                        <p style="font-style: italic; color: ${themeColors.text}; font-size: 1rem;">"${motivationalQuote}"</p>
                    </div>
                </div>
            </div>`;

        return html;
    }

    function buildListStyleTimetable(timetableData, studentName, theme) {
        const { timetable, motivationalQuote } = timetableData;
        const themeColors = THEMES[theme];
        const dayLabel = timetable[0]?.day?.includes('-') || timetable[0]?.day?.match(/\d/) ? 'Date' : 'Day';

        let html = `
            <div class="timetable-container" id="timetable-export" style="position: relative; background: white; padding: 3rem;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 6rem; font-weight: 900; color: rgba(0,0,0,0.02); pointer-events: none; white-space: nowrap; z-index: 0;">CRAMBOT</div>
                <div style="position: absolute; bottom: 1rem; right: 1rem; font-size: 0.75rem; color: rgba(0,0,0,0.3); z-index: 10;">Generated by CramBot.com</div>
                <div style="position: relative; z-index: 1;">
                    ${studentName ? `<h2 style="text-align: center; margin-bottom: 0.5rem; color: ${themeColors.text}; font-size: 1.8rem;">${studentName}</h2>` : ''}
                    <p style="text-align: center; color: ${themeColors.text}; opacity: 0.7; margin-bottom: 2rem; font-size: 0.9rem;">Study Timetable</p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
                        <thead><tr>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 1rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">${dayLabel}</th>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 1rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">Duration</th>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 1rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700;">Course</th>
                        </tr></thead><tbody>`;

        timetable.forEach((session, index) => {
            const rowBg = index % 2 === 0 ? themeColors.rowBg : themeColors.rowAlt;
            html += `<tr style="background: ${rowBg};">
                <td style="padding: 1rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text};">${session.day}</td>
                <td style="padding: 1rem; border: 1px solid ${themeColors.border}; color: ${themeColors.text};">${session.startTime} - ${session.endTime}</td>
                <td style="padding: 1rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text};">${session.courseCode}</td>
            </tr>`;
        });

        const headerColor = themeColors.headerBg.split(',')[0].replace('linear-gradient(135deg', '').trim();
        html += `</tbody></table>
                    <div style="padding: 1.5rem; background: ${themeColors.rowAlt}; border-left: 4px solid ${headerColor}; border-radius: 8px; text-align: center;">
                        <p style="font-style: italic; color: ${themeColors.text}; font-size: 1rem;">"${motivationalQuote}"</p>
                    </div>
                </div>
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

    // ============================================
    // 12. SHARE FUNCTION
    // ============================================
    
    function generateShareText(studentName) {
        const name = studentName || 'I';
        
        const shareTexts = [
            // Version 1: Success Story
            `🎓 ${name} just crushed exam prep with CramBot's AI-powered study timetable! 

No more panic. No more guessing. Just a smart, personalized schedule that actually works.

✨ FREE forever
🤖 AI analyzes course difficulty
⏰ Optimized study sessions
📊 Zero manual planning

Stop wasting time planning. Start studying smarter.

👉 Get yours FREE: crambot.com

#StudySmart #ExamPrep #CramBot #StudentLife #AITools #ProductivityHack`,

            // Version 2: Problem/Solution
            `😰 Tired of cramming at the last minute?

${name} just discovered CramBot - the AI that builds your perfect study schedule in 10 seconds.

Here's what it does:
✅ Analyzes each course's difficulty
✅ Calculates optimal study hours
✅ Spreads sessions throughout the week
✅ Avoids burnout with smart breaks

🔥 100% FREE. No signup. No BS.

Try it: crambot.com

#StudyPlanner #ExamSuccess #AIforStudents #CramBot #NoMoreProcrastination`,

            // Version 3: Social Proof
            `📚 ${name} just joined thousands of students using CramBot!

This AI study planner is insane:
• Generates personalized timetables in seconds
• Smart scheduling based on course difficulty  
• Multiple export options (PDF, PNG)
• Completely FREE (seriously!)

Best part? It actually helps you STICK to the plan.

Stop stressing. Start cramming smarter.

Get yours: crambot.com

#CramBot #StudyTips #StudentSuccess #AIProductivity #ExamPrep #FreeTool`
        ];

        // Randomly select one share text
        return shareTexts[Math.floor(Math.random() * shareTexts.length)];
    }

    async function shareTimetable() {
        const element = document.getElementById('timetable-export');
        if (!element) {
            showError('No timetable to share');
            return;
        }

        try {
            if (typeof htmlToImage === 'undefined') {
                showError('Export library not loaded. Please refresh the page.');
                return;
            }

            const dataUrl = await htmlToImage.toPng(element, {
                quality: 1,
                backgroundColor: '#ffffff',
                pixelRatio: 2
            });

            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `crambot-timetable-${Date.now()}.png`, { type: 'image/png' });
            const shareText = generateShareText(state.currentStudentName);

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({ text: shareText, files: [file] });
            } else {
                const link = document.createElement('a');
                link.download = `crambot-timetable-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();

                await navigator.clipboard.writeText(shareText);
                alert('✅ Timetable downloaded!\n📋 Viral share text copied to clipboard!\n\nPaste it when sharing on social media.');
            }
        } catch (error) {
            console.error('Share error:', error);
            showError('Failed to share. Please try again.');
        }
    }

    // ============================================
    // 13. MAIN TIMETABLE GENERATION
    // ============================================
    
    async function generateTimetable() {
        // Check rate limit
        const rateCheck = checkRateLimit();
        if (!rateCheck.allowed) {
            showError(rateCheck.message);
            return;
        }

        // Collect form data
        const formData = collectFormData();
        if (!formData) return;

        // Check API key
        if (CONFIG.GROQ_API_KEY === 'PASTE_YOUR_GROQ_KEY_HERE') {
            showError('Please add your Groq API key. Get it from https://console.groq.com');
            return;
        }

        // Generate prompt
        const prompt = generatePrompt(formData);

        // Show loading
        showLoading();
        startLoadingAnimation();

        try {
            // Call API
            const response = await fetch(CONFIG.GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: CONFIG.MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert academic study planner. Generate responses ONLY in valid JSON format."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            stopLoadingAnimation();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Parse response
            let timetableData;
            try {
                const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                timetableData = JSON.parse(cleanedResponse);
            } catch (parseError) {
                console.error('Parse Error:', parseError);
                throw new Error('Failed to parse AI response');
            }

            // Validate
            if (!timetableData.timetable || !Array.isArray(timetableData.timetable)) {
                throw new Error('Invalid timetable format');
            }

            // Store data
            state.currentTimetableData = timetableData;
            state.currentStudentName = formData.studentName;

            // Build and display
            const controlsHTML = buildControls();
            const timetableHTML = buildTimetableHTML(timetableData, formData.studentName);
            elements.timetableDisplay.innerHTML = controlsHTML + timetableHTML;

            // Attach listeners
            attachControlListeners();

            // Update rate limit and show
            updateRateLimit();
            hideLoading();
            showOutput();

        } catch (error) {
            stopLoadingAnimation();
            hideLoading();
            console.error('Error:', error);
            showError(`Failed to generate timetable: ${error.message}`);
        }
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

    // ============================================
    // 14. EXPORT FUNCTIONS
    // ============================================
    
    async function exportAsImage() {
        const element = document.getElementById('timetable-export');
        if (!element) {
            showError('No timetable to export');
            return;
        }

        try {
            if (typeof htmlToImage === 'undefined') {
                showError('Export library not loaded');
                return;
            }

            const dataUrl = await htmlToImage.toPng(element, {
                quality: 1,
                backgroundColor: '#ffffff',
                pixelRatio: 2
            });

            const link = document.createElement('a');
            link.download = `crambot-timetable-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export error:', error);
            showError('Failed to export image');
        }
    }

    function exportAsPDF() {
        const element = document.getElementById('timetable-export');
        if (!element) {
            showError('No timetable to export');
            return;
        }

        try {
            if (typeof window.jspdf === 'undefined') {
                showError('PDF library not loaded');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            
            doc.html(element, {
                callback: function(doc) {
                    doc.save(`crambot-timetable-${Date.now()}.pdf`);
                },
                x: 20,
                y: 20,
                width: 550,
                windowWidth: 800
            });
        } catch (error) {
            console.error('PDF error:', error);
            showError('Failed to export PDF');
        }
    }

    // ============================================
    // 15. EVENT LISTENERS
    // ============================================
    
    function initializeEventListeners() {
        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        // Course management
        if (elements.addCourseBtn) {
            elements.addCourseBtn.addEventListener('click', addCourse);
        }

        if (elements.courseList) {
            elements.courseList.addEventListener('input', autoUppercaseCourseCode);
        }

        // Duration toggle
        const durationRadios = document.querySelectorAll('input[name="duration"]');
        durationRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (elements.customDatesDiv) {
                    elements.customDatesDiv.style.display = e.target.value === 'Custom' ? 'block' : 'none';
                }
            });
        });

        // Study hours limit
        if (elements.studyHoursInput) {
            elements.studyHoursInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value < 1) e.target.value = 1;
                if (value > 16) e.target.value = 16;
            });
        }

        // Form submit
        if (elements.timetableForm) {
            elements.timetableForm.addEventListener('submit', (e) => {
                e.preventDefault();
                generateTimetable();
            });
        }

        // Export buttons
        if (elements.exportImageBtn) {
            elements.exportImageBtn.addEventListener('click', exportAsImage);
        }

        if (elements.exportPdfBtn) {
            elements.exportPdfBtn.addEventListener('click', exportAsPDF);
        }

        if (elements.shareBtn) {
            elements.shareBtn.addEventListener('click', shareTimetable);
        }
    }

    // ============================================
    // 16. INITIALIZATION
    // ============================================
    
    function init() {
        initializeTheme();
        addCourse(); // Add first course
        initializeEventListeners();
        
        console.log('%c🧠 CramBot Ready!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
        console.log('%cGet Groq API key: https://console.groq.com', 'color: #8b5cf6;');
    }

    // Start the app
    init();

})();