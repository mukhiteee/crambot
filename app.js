// ============================================
// CRAMBOT - ALGORITHM-MATCHED VERSION
// Implements every detail from ALGORITHM_GUIDE.txt
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
        { main: '📊 Analyzing your courses...', sub: 'Calculating optimal study distribution' },
        { main: '🤖 Connecting with AI...', sub: 'Preparing personalized recommendations' },
        { main: '✨ Generating your timetable...', sub: 'AI is working its magic' },
        { main: '✅ Response received!', sub: 'Formatting your schedule' },
        { main: '🎨 Preparing your schedule...', sub: 'Almost ready!' }
    ];

    const state = {
        selectedTheme: 'classic',
        selectedLayout: 'school',
        currentTimetableData: null,
        currentStudentName: null,
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

    // ============================================
    // THEME MANAGEMENT
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
    // COURSE MANAGEMENT
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
    // FORM DATA COLLECTION
    // ============================================
    
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
            showError('Please add at least one course with code and title filled');
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
    // AI PROMPT - EXACTLY MATCHES ALGORITHM GUIDE
    // ============================================
    
    function generatePrompt(data) {
        const { courses, totalCredits, studyHours, excludedDays, studyTime, duration, startDate, endDate } = data;

        const courseList = courses.map(course => {
            if (course.credit) {
                return `- ${course.courseCode}: ${course.courseTitle} (${course.credit} units)`;
            }
            return `- ${course.courseCode}: ${course.courseTitle} (credit unit not provided)`;
        }).join('\n');

        const studyHoursText = studyHours ? `${studyHours} hours` : 'Not specified (AI should recommend 2-8 hours based on difficulty)';
        const studyHoursRule = studyHours
            ? `Distribute approximately ${studyHours} hours per day across courses based on difficulty scores. Higher difficulty courses get proportionally more time.`
            : 'Calculate recommended study hours based on total difficulty score (2-8 hours/day depending on course load). Higher total difficulty = more daily hours needed.';

        const excludedDaysText = excludedDays ? excludedDays.join(', ') : 'None (all days available)';
        const studyTimeText = studyTime || 'Not specified';
        const studyTimeRule = studyTime
            ? `${studyTime} is the PREFERRED time (not mandatory). Aim for 60-70% of sessions during ${studyTime}. If difficulty scores are high or total study time increases, distribute sessions across other times of day to avoid jam-packing. Balance is key.`
            : 'Use Evening as default preference (60-70% of sessions), but distribute flexibly across the day based on course load. Avoid scheduling all sessions at the same time. Evening = 4PM-8PM.';

        let durationRule;
        if (duration === 'Weekly') {
            durationRule = `Generate a 7-day weekly timetable (Monday-Sunday). Exclude days from excluded list. Use 'day' field in JSON (e.g., 'Monday').`;
        } else if (duration === 'Monthly') {
            durationRule = `Generate a 4-week (28-day) monthly timetable. Exclude specified days each week. Use 'day' field with dates (e.g., 'January 20', 'January 21').`;
        } else {
            durationRule = `Generate a timetable from ${startDate} to ${endDate}. Exclude specified days. Use 'day' field with actual dates in format 'YYYY-MM-DD'.`;
        }

        return `You are Dr. Sarah Chen, a cognitive science professor with 15+ years of experience helping students optimize their study schedules. You understand the psychology of learning, retention, and burnout prevention.

TASK: Create a scientifically-backed, personalized study timetable that maximizes retention while preventing burnout.

================================================================================
STEP 1: DEEP COURSE DIFFICULTY ANALYSIS (0-100 Scale)
================================================================================

For EACH course, calculate a comprehensive difficulty score using these 5 factors:

A) CREDIT WEIGHT (BASELINE):
   Each credit unit = 10 points baseline
   - 1 credit = 10 points
   - 2 credits = 20 points
   - 3 credits = 30 points
   - 4 credits = 40 points
   - 5 credits = 50 points
   - 6 credits = 60 points

B) SUBJECT COMPLEXITY LEVEL (+5 to +30 points):
   Research the course level/number:
   - Introductory (100-level): +5 points (basic concepts)
   - Intermediate (200-level): +10 points (moderate complexity)
   - Advanced (300-level): +20 points (specialized knowledge)
   - Expert (400+ level): +30 points (highly specialized)

C) COGNITIVE LOAD TYPE (+10 to +25 points):
   Research the subject to determine mental processing type:
   - Memorization-heavy (History, Biology, Anatomy): +10 points
   - Application-heavy (Math, Programming, Physics): +20 points
   - Synthesis-heavy (Philosophy, Research, Advanced Writing): +25 points

D) PREREQUISITE REQUIREMENTS (+0 to +15 points):
   Research typical prerequisites:
   - No prerequisites: +0 points
   - 1-2 prerequisites: +8 points
   - 3+ prerequisites: +15 points

E) TYPICAL WORKLOAD (+5 to +20 points):
   Research typical time commitment:
   - Light (reading/practice): +5 points
   - Moderate (regular assignments): +10 points
   - Heavy (projects/labs): +15 points
   - Thesis/Capstone: +20 points

FINAL DIFFICULTY CALCULATION:
- IF credit provided: Final = (Credit Weight × 0.5) + (B+C+D+E × 0.5)
- IF NO credit: Final = B + C + D + E

DIFFICULTY CATEGORIES:
- Low (0-40): Basic courses
- Medium (41-70): Moderate challenge
- High (71-85): Challenging courses
- Expert (86-100): Extremely difficult

================================================================================
STEP 2: TIME ALLOCATION & SESSION PLANNING
================================================================================

For each course:

MINIMUM WEEKLY TIME (NON-NEGOTIABLE):
   Credit Units × 60 minutes per week
   Example: 3-credit course = minimum 180 minutes/week

ADJUSTED TIME BASED ON DIFFICULTY:
   - Low (0-40): Use minimum only
   - Medium (41-70): Minimum + 20-30%
   - High (71-85): Minimum + 40-50%
   - Expert (86-100): Minimum + 60-80%

SESSION FREQUENCY (How often per week):
   - Low (0-40): 2-3 sessions/week (allow gaps for absorption)
   - Medium (41-70): 4-5 sessions/week (regular reinforcement)
   - High (71-85): 5-6 sessions/week (consistent practice)
   - Expert (86-100): 6-7 sessions/week (daily reinforcement)

SESSION LENGTH (Individual session duration):
   - Ideal: 60-90 minutes (peak focus window)
   - Minimum: 45 minutes (anything less is ineffective)
   - Maximum: 120 minutes (diminishing returns after)
   - NEVER: 3+ hour marathons

DISTRIBUTION EXAMPLE:
   CSC 301 needs 261 min/week at 5-6 sessions
   → Five 52-minute sessions OR Six 45-minute sessions

================================================================================
STEP 3: COGNITIVE OPTIMIZATION PRINCIPLES
================================================================================

Apply these learning science principles:

SPACING EFFECT (Hermann Ebbinghaus):
   - Space sessions for same course 1-2 days apart when possible
   - Low-difficulty: 2-3 day gaps
   - High-difficulty: 1-2 day gaps
   - Example BAD: Monday, Tuesday, Wednesday (too close)
   - Example GOOD: Monday, Thursday, Saturday (spaced)

INTERLEAVING (Rohrer & Taylor):
   - Mix different subjects in the same day
   - Alternate subjects rather than blocking
   - Example BAD: 3 hours Math straight, then 3 hours Bio straight
   - Example GOOD: 90min Math, 90min Bio, 90min Math, 60min English

TIME-OF-DAY MATCHING:
   Peak energy times: 9 AM-12 PM (morning), 4 PM-7 PM (early evening)
   - High-difficulty (70+) → Peak energy times
   - Medium (40-70) → Flexible placement
   - Low (0-40) → Off-peak acceptable

ENERGY MANAGEMENT:
   - NEVER stack 3+ high-difficulty courses in one day
   - Track total difficulty per day
   - If total difficulty > 200 in one day, redistribute
   - Mix high and low difficulty courses

================================================================================
STEP 4: ANTI-BURNOUT PROTECTION RULES
================================================================================

MANDATORY SAFEGUARDS:

1. NO JAM-PACKING:
   If daily study > 4 hours, MUST spread across multiple time blocks
   - Morning (7 AM-12 PM)
   - Afternoon (12 PM-5 PM)
   - Evening (5 PM-10 PM)
   Example: 6 hours = 2hr morning + 2hr afternoon + 2hr evening

2. BREATHING SPACE:
   Minimum 30-minute gap between consecutive sessions
   - Brain needs reset time
   - Prevent cognitive overload

3. WEEKLY VARIATION:
   Vary session start times by 30-60 minutes
   - Monday: Math 9:00 AM
   - Wednesday: Math 10:00 AM
   - Friday: Math 9:30 AM

4. MANDATORY REST DAY:
   Include 1 complete rest day (no study) in weekly schedules
   - Brain consolidates memories during rest
   - Prevents chronic stress
   - If student excludes Sunday, that becomes rest day

5. REALISTIC LIMITS:
   - No sessions < 45 minutes
   - No sessions > 120 minutes
   - No more than 8 hours total study in one day

================================================================================
STUDENT DATA
================================================================================

COURSES:
${courseList}

TOTAL CREDITS: ${totalCredits || 'Not applicable'}
AVAILABLE STUDY HOURS PER DAY: ${studyHoursText}
EXCLUDED DAYS: ${excludedDaysText}
PREFERRED STUDY TIME: ${studyTimeText}
TIMETABLE DURATION: ${duration}

================================================================================
SCHEDULING RULES
================================================================================

1. MINIMUM TIME: Each course MUST get Credit × 60 min/week
2. DIFFICULTY-BASED FREQUENCY: Follow frequency rules above strictly
3. ${studyHoursRule}
4. ABSOLUTE DAY EXCLUSION: NEVER schedule on ${excludedDaysText}
5. TIME PREFERENCE: ${studyTimeRule}
6. SPACING: Space sessions 1-2 days apart when possible
7. ANTI-JAM-PACK: If >4 hours/day, spread across time blocks
8. MANDATORY BREAKS: 30-min minimum between sessions
9. REST DAY: Include 1 rest day in weekly schedules
10. ${durationRule}

================================================================================
QUALITY VERIFICATION CHECKLIST
================================================================================

Before returning, verify ALL 10 requirements:

✓ 1. Each course gets at least Credit × 60 minutes per week
✓ 2. Low-difficulty: 2-3 times/week; Medium: 4-5; High: 5-6; Expert: 6-7
✓ 3. No sessions longer than 120 minutes
✓ 4. Sessions for same course spaced 1-2 days apart (when possible)
✓ 5. Weekly schedules include at least 1 complete rest day
✓ 6. Absolutely zero sessions scheduled on excluded days
✓ 7. 60-70% of sessions during preferred time (if specified)
✓ 8. If >4 hours/day, sessions spread across multiple time blocks
✓ 9. Minimum 30-minute gaps between consecutive sessions
✓ 10. Total daily study ≤ user's specified hours (if provided)

If ANY requirement fails, regenerate the schedule.

================================================================================
OUTPUT FORMAT
================================================================================

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

REMEMBER: A great timetable is challenging but sustainable. Push the student, but don't break them.`;
    }

    // ============================================
    // RATE LIMITING
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
    // UI STATE MANAGEMENT
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
    // LOADING ANIMATION
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
    // TIMETABLE BUILDERS (MOBILE OPTIMIZED)
    // ============================================
    
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
            <div class="timetable-container" id="timetable-export" style="position: relative; background: ${themeColors.rowBg}; padding: 2rem; max-width: 100%; overflow-x: auto;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 4rem; font-weight: 900; color: ${themeColors.watermark}15; pointer-events: none; white-space: nowrap; z-index: 0;">CRAMBOT</div>
                <div style="position: absolute; bottom: 0.5rem; right: 0.5rem; font-size: 0.7rem; color: ${themeColors.watermark}; opacity: 0.8; z-index: 10; font-weight: 600;">Generated by CramBot.site</div>
                <div style="position: relative; z-index: 1;">
                    ${studentName ? `<h2 style="text-align: center; margin-bottom: 0.5rem; color: ${themeColors.text}; font-size: 1.5rem;">${studentName}</h2>` : ''}
                    <p style="text-align: center; color: ${themeColors.text}; opacity: 0.7; margin-bottom: 1.5rem; font-size: 0.85rem;">Study Timetable</p>
                    <div style="overflow-x: auto;">
                    <table style="width: 100%; min-width: 600px; border-collapse: collapse; margin-bottom: 1.5rem;">
                        <thead><tr>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700; font-size: 0.9rem;">Day/Date</th>`;

        for (let i = 1; i <= maxCoursesPerDay; i++) {
            html += `<th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: center; border: 1px solid ${themeColors.border}; font-weight: 700; font-size: 0.9rem;">Session ${i}</th>`;
        }

        html += `</tr></thead><tbody>`;

        let rowIndex = 0;
        for (const [day, sessions] of Object.entries(groupedByDay)) {
            const rowBg = rowIndex % 2 === 0 ? themeColors.rowBg : themeColors.rowAlt;
            html += `<tr style="background: ${rowBg};">`;
            html += `<td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text}; font-size: 0.85rem;">${day}</td>`;
            
            sessions.forEach(session => {
                html += `<td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; text-align: center; color: ${themeColors.text};">
                    <div style="font-weight: 700; margin-bottom: 0.25rem; font-size: 0.9rem;">${session.courseCode}</div>
                    <div style="font-size: 0.75rem; opacity: 0.8;">${session.startTime} - ${session.endTime}</div>
                </td>`;
            });
            
            for (let i = sessions.length; i < maxCoursesPerDay; i++) {
                html += `<td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; background: rgba(0,0,0,0.02);"></td>`;
            }
            
            html += `</tr>`;
            rowIndex++;
        }

        html += `</tbody></table>
                    </div>
                    <div style="padding: 1rem; background: ${themeColors.rowAlt}; border-left: 4px solid ${themeColors.watermark}; border-radius: 6px; text-align: center;">
                        <p style="font-style: italic; color: ${themeColors.text}; font-size: 0.9rem; margin: 0;">"${motivationalQuote}"</p>
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
            <div class="timetable-container" id="timetable-export" style="position: relative; background: ${themeColors.rowBg}; padding: 2rem; max-width: 100%;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 4rem; font-weight: 900; color: ${themeColors.watermark}15; pointer-events: none; white-space: nowrap; z-index: 0;">CRAMBOT</div>
                <div style="position: absolute; bottom: 0.5rem; right: 0.5rem; font-size: 0.7rem; color: ${themeColors.watermark}; opacity: 0.8; z-index: 10; font-weight: 600;">Generated by CramBot.site</div>
                <div style="position: relative; z-index: 1;">
                    ${studentName ? `<h2 style="text-align: center; margin-bottom: 0.5rem; color: ${themeColors.text}; font-size: 1.5rem;">${studentName}</h2>` : ''}
                    <p style="text-align: center; color: ${themeColors.text}; opacity: 0.7; margin-bottom: 1.5rem; font-size: 0.85rem;">Study Timetable</p>
                    <div style="overflow-x: auto;">
                    <table style="width: 100%; min-width: 500px; border-collapse: collapse; margin-bottom: 1.5rem;">
                        <thead><tr>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700; font-size: 0.9rem;">${dayLabel}</th>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700; font-size: 0.9rem;">Duration</th>
                            <th style="background: ${themeColors.headerBg}; color: ${themeColors.headerText}; padding: 0.75rem; text-align: left; border: 1px solid ${themeColors.border}; font-weight: 700; font-size: 0.9rem;">Course</th>
                        </tr></thead><tbody>`;

        timetable.forEach((session, index) => {
            const rowBg = index % 2 === 0 ? themeColors.rowBg : themeColors.rowAlt;
            html += `<tr style="background: ${rowBg};">
                <td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text}; font-size: 0.85rem;">${session.day}</td>
                <td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; color: ${themeColors.text}; font-size: 0.85rem;">${session.startTime} - ${session.endTime}</td>
                <td style="padding: 0.75rem; border: 1px solid ${themeColors.border}; font-weight: 600; color: ${themeColors.text}; font-size: 0.85rem;">${session.courseCode}</td>
            </tr>`;
        });

        html += `</tbody></table>
                    </div>
                    <div style="padding: 1rem; background: ${themeColors.rowAlt}; border-left: 4px solid ${themeColors.watermark}; border-radius: 6px; text-align: center;">
                        <p style="font-style: italic; color: ${themeColors.text}; font-size: 0.9rem; margin: 0;">"${motivationalQuote}"</p>
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
    // SHARE FUNCTION (VIRAL TEXT)
    // ============================================
    
    function generateShareText(studentName) {
        const name = studentName || 'I';
        
        const shareTexts = [
            `🎓 ${name} just crushed exam prep with CramBot's AI study planner!

No more panic. No more guessing. Just a smart, personalized schedule that actually works.

✨ FREE forever | 🤖 AI-powered | ⏰ Science-backed

Stop wasting time planning. Start studying smarter.

👉 crambot.site

#StudySmart #ExamPrep #CramBot #AITools #ProductivityHack`,

            `😰 Tired of cramming at the last minute?

${name} just discovered CramBot - AI that builds your perfect study schedule in 10 seconds.

✅ Analyzes course difficulty
✅ Optimizes study sessions
✅ Prevents burnout
✅ 100% FREE

Try it: crambot.site

#StudyPlanner #ExamSuccess #AIforStudents #CramBot`,

            `📚 ${name} joined thousands using CramBot!

This AI study planner is insane:
• Personalized timetables in seconds
• Smart difficulty-based scheduling
• Export to PDF/PNG
• Completely FREE!

Best part? It helps you STICK to the plan.

Get yours: crambot.site

#CramBot #StudyTips #StudentSuccess #AIProductivity`
        ];

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

            const clone = element.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.width = 'auto';
            clone.style.minWidth = 'auto';
            clone.style.maxWidth = 'none';
            clone.style.overflow = 'visible';
            
            const tables = clone.querySelectorAll('table');
            tables.forEach(table => {
                table.style.width = 'auto';
                table.style.minWidth = 'auto';
            });
            
            const scrollDivs = clone.querySelectorAll('div[style*="overflow"]');
            scrollDivs.forEach(div => {
                div.style.overflow = 'visible';
            });

            document.body.appendChild(clone);

            const dataUrl = await htmlToImage.toPng(clone, {
                quality: 1,
                backgroundColor: THEMES[state.selectedTheme].rowBg,
                pixelRatio: 2,
                width: clone.scrollWidth,
                height: clone.scrollHeight
            });

            document.body.removeChild(clone);

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
    // MAIN TIMETABLE GENERATION
    // ============================================
    
    async function generateTimetable() {
        const rateCheck = checkRateLimit();
        if (!rateCheck.allowed) {
            showError(rateCheck.message);
            return;
        }

        const formData = collectFormData();
        if (!formData) return;

        if (CONFIG.GROQ_API_KEY === 'PASTE_YOUR_GROQ_KEY_HERE') {
            showError('Please add your Groq API key. Get it from https://console.groq.com');
            return;
        }

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
                        {
                            role: "system",
                            content: "You are Dr. Sarah Chen, a cognitive science professor. Generate responses ONLY in valid JSON format. Follow ALL rules exactly."
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

            let timetableData;
            try {
                const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                timetableData = JSON.parse(cleanedResponse);
            } catch (parseError) {
                console.error('Parse Error:', parseError);
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
    // EXPORT FUNCTIONS (FULL WIDTH CAPTURE)
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

            const clone = element.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.width = 'auto';
            clone.style.minWidth = 'auto';
            clone.style.maxWidth = 'none';
            clone.style.overflow = 'visible';
            
            const tables = clone.querySelectorAll('table');
            tables.forEach(table => {
                table.style.width = 'auto';
                table.style.minWidth = 'auto';
            });
            
            const scrollDivs = clone.querySelectorAll('div[style*="overflow"]');
            scrollDivs.forEach(div => {
                div.style.overflow = 'visible';
            });

            document.body.appendChild(clone);

            const dataUrl = await htmlToImage.toPng(clone, {
                quality: 1,
                backgroundColor: THEMES[state.selectedTheme].rowBg,
                pixelRatio: 2,
                width: clone.scrollWidth,
                height: clone.scrollHeight
            });

            document.body.removeChild(clone);

            const link = document.createElement('a');
            link.download = `crambot-timetable-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export error:', error);
            showError('Failed to export image');
        }
    }

    async function exportAsPDF() {
        const element = document.getElementById('timetable-export');
        if (!element) {
            showError('No timetable to export');
            return;
        }

        try {
            if (typeof htmlToImage === 'undefined') {
                showError('Export library not loaded. Please refresh the page.');
                return;
            }

            if (typeof window.jspdf === 'undefined') {
                showError('PDF library not loaded. Please refresh the page.');
                return;
            }

            const clone = element.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.width = 'auto';
            clone.style.minWidth = 'auto';
            clone.style.maxWidth = 'none';
            clone.style.overflow = 'visible';
            
            const tables = clone.querySelectorAll('table');
            tables.forEach(table => {
                table.style.width = 'auto';
                table.style.minWidth = 'auto';
            });
            
            const scrollDivs = clone.querySelectorAll('div[style*="overflow"]');
            scrollDivs.forEach(div => {
                div.style.overflow = 'visible';
            });

            document.body.appendChild(clone);

            const dataUrl = await htmlToImage.toPng(clone, {
                quality: 1,
                backgroundColor: THEMES[state.selectedTheme].rowBg,
                pixelRatio: 2,
                width: clone.scrollWidth,
                height: clone.scrollHeight
            });

            document.body.removeChild(clone);

            const { jsPDF } = window.jspdf;
            
            const imgWidth = clone.scrollWidth;
            const imgHeight = clone.scrollHeight;
            
            const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
            const pdf = new jsPDF({
                orientation: orientation,
                unit: 'px',
                format: [imgWidth, imgHeight]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`crambot-timetable-${Date.now()}.pdf`);

        } catch (error) {
            console.error('PDF export error:', error);
            showError('Failed to export PDF. Please try exporting as image instead.');
        }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    function initializeEventListeners() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        if (elements.addCourseBtn) {
            elements.addCourseBtn.addEventListener('click', addCourse);
        }

        if (elements.courseList) {
            elements.courseList.addEventListener('input', autoUppercaseCourseCode);
        }

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
    // INITIALIZATION
    // ============================================
    
    function init() {
        initializeTheme();
        addCourse();
        initializeEventListeners();
        
        console.log('%c🧠 CramBot Ready! (Algorithm-Matched Version)', 'color: #6366f1; font-size: 20px; font-weight: bold;');
        console.log('%c✅ Implements ALGORITHM_GUIDE.txt exactly', 'color: #10b981;');
    }

    init();

})();