// ============================================
// CRAMBOT - COMPLETE JAVASCRIPT
// With AI Generation & Timetable Rendering
// ============================================

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const GEMINI_API_KEY = 'AIzaSyBZgfnZQvgqLNNTTnwHWVO0MCCSx_cUVnw'; // <-- ADD YOUR API KEY HERE
    // Change this line in your code:
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent';

    // ============================================
    // THEME TOGGLE
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');

    const savedTheme = localStorage.getItem('crambot-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('crambot-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // ============================================
    // COURSE MANAGEMENT
    // ============================================
    let courseCount = 0;
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');

    addCourse();
    addCourseBtn.addEventListener('click', addCourse);

    function addCourse() {
        courseCount++;
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.setAttribute('data-course-id', courseCount);
        
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
                <button type="button" class="remove-course" onclick="removeCourse(${courseCount})">✕</button>
            </div>
        `;
        courseList.appendChild(courseItem);
    }

    window.removeCourse = function(courseId) {
        const courseItem = document.querySelector(`[data-course-id="${courseId}"]`);
        if (courseItem) {
            const totalCourses = courseList.querySelectorAll('.course-item').length;
            if (totalCourses <= 1) {
                showError('You must have at least one course');
                return;
            }
            courseItem.remove();
        }
    };

    // ============================================
    // CUSTOM DATE RANGE TOGGLE
    // ============================================
    const durationRadios = document.querySelectorAll('input[name="duration"]');
    const customDatesDiv = document.getElementById('custom-dates');

    durationRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Custom') {
                customDatesDiv.style.display = 'block';
            } else {
                customDatesDiv.style.display = 'none';
            }
        });
    });

    // ============================================
    // COLLECT FORM DATA
    // ============================================
    function collectFormData() {
        const studentName = document.getElementById('student-name').value.trim();
        
        // Collect courses
        const courses = [];
        const courseItems = courseList.querySelectorAll('.course-item');
        
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
        const totalCredits = courses.reduce((sum, course) => {
            return sum + (course.credit || 0);
        }, 0);

        // Collect preferences
        const studyHours = document.getElementById('study-hours').value;
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
            studyTime: studyTime,
            duration,
            startDate,
            endDate
        };
    }

    // ============================================
    // PROMPT GENERATION
    // ============================================
    function generatePrompt(data) {
        const { courses, totalCredits, studyHours, excludedDays, studyTime, duration, startDate, endDate } = data;

        // Build course list
        let courseList = '';
        courses.forEach(course => {
            if (course.credit) {
                courseList += `- ${course.courseCode}: ${course.courseTitle} (${course.credit} units)\n`;
            } else {
                courseList += `- ${course.courseCode}: ${course.courseTitle} (credit unit not provided)\n`;
            }
        });

        // Study hours logic
        let studyHoursText, studyHoursRule;
        if (studyHours) {
            studyHoursText = `${studyHours} hours`;
            studyHoursRule = `Distribute approximately ${studyHours} hours per day across courses based on difficulty scores.`;
        } else {
            studyHoursText = 'Not specified (AI should recommend)';
            studyHoursRule = 'Calculate recommended study hours based on total difficulty score of all courses. Recommend between 2-8 hours per day depending on course load.';
        }

        // Excluded days logic
        const excludedDaysText = excludedDays ? excludedDays.join(', ') : 'None (all days available)';

        // Study time logic
        let studyTimeText, studyTimeRule;
        if (studyTime) {
            studyTimeText = studyTime;
            studyTimeRule = `Prioritize ${studyTime} time slots (assign ~60-70% of sessions here). If course load is heavy, use other time periods as needed.`;
        } else {
            studyTimeText = 'Not specified';
            studyTimeRule = 'Use Evening as default preference (60-70% of sessions), but distribute flexibly based on course load. Evening = 4PM-8PM.';
        }

        // Duration logic
        let durationRule;
        if (duration === 'Weekly') {
            durationRule = `Generate a 7-day weekly timetable (Monday-Sunday). Exclude days from excluded list. Use 'day' field in JSON (e.g., 'Monday').`;
        } else if (duration === 'Monthly') {
            durationRule = `Generate a 4-week (28-day) monthly timetable. Exclude specified days each week. Use 'day' field with dates (e.g., 'January 20', 'January 21').`;
        } else if (duration === 'Custom') {
            durationRule = `Generate a timetable from ${startDate} to ${endDate}. Exclude specified days. Use 'day' field with actual dates in format 'YYYY-MM-DD'.`;
        }

        // Build the complete prompt
        const prompt = `You are an expert academic study planner with deep knowledge of course difficulty assessment and optimal learning schedules.

TASK: Generate a personalized study timetable based on the student's course load, preferences, and constraints.

===== COURSE ANALYSIS =====
Analyze each course using a difficulty scoring system (0-100):

1. DIFFICULTY CALCULATION:
   - If credit unit is provided: 
     • Credit Unit contributes 50% of difficulty score
     • Course title analysis contributes 50% (analyze course complexity, prerequisites, typical workload)
   - If credit unit is NOT provided:
     • Course title analysis contributes 100% of difficulty score
   
2. RESEARCH-BASED ANALYSIS:
   Research the course title to determine:
   - Subject complexity (introductory vs advanced)
   - Typical study requirements (problem-solving heavy vs reading heavy)
   - Prerequisite knowledge needed
   
3. TIME ALLOCATION:
   - Higher difficulty courses get more study time
   - Distribute study hours proportionally to difficulty scores

===== STUDENT DATA =====
COURSES:
${courseList}
TOTAL CREDITS: ${totalCredits || 'Not applicable'}
AVAILABLE STUDY HOURS PER DAY: ${studyHoursText}
EXCLUDED DAYS: ${excludedDaysText}
PREFERRED STUDY TIME: ${studyTimeText}
TIMETABLE DURATION: ${duration}

===== SCHEDULING RULES =====
1. STUDY HOURS CALCULATION:
   ${studyHoursRule}

2. DAY EXCLUSION:
   - DO NOT schedule any study sessions on: ${excludedDaysText}
   - Only use available days in the timetable

3. TIME PREFERENCE:
   ${studyTimeRule}

4. DURATION LOGIC:
   ${durationRule}

5. GENERAL CONSTRAINTS:
   - Multiple courses CAN be scheduled per day
   - Include 10-15 minute breaks between study sessions
   - Vary study times to prevent burnout
   - Include specific start and end times (e.g., "4:00 PM - 6:00 PM")
   - Balance course rotation (don't schedule same course 3 days in a row)
   - Make the schedule realistic and sustainable

===== OUTPUT FORMAT =====
Return ONLY valid JSON in this EXACT format (no markdown, no code blocks, no explanations):

{
  "timetable": [
    {
      "day": "Monday",
      "startTime": "4:00 PM",
      "endTime": "6:00 PM",
      "courseCode": "CSC 201"
    },
    {
      "day": "Monday",
      "startTime": "6:15 PM",
      "endTime": "7:30 PM",
      "courseCode": "MTH 101"
    }
  ],
  "motivationalQuote": "Success is the sum of small efforts repeated day in and day out. - Robert Collier"
}

EXAMPLE OUTPUT (for reference):
{
  "timetable": [
    {
      "day": "Monday",
      "startTime": "5:00 PM",
      "endTime": "7:00 PM",
      "courseCode": "BIO 301"
    }
  ],
  "motivationalQuote": "The expert in anything was once a beginner."
}

===== CRITICAL REQUIREMENTS =====
1. Return ONLY the JSON object (no markdown formatting, no \`\`\`json blocks)
2. Include a motivational quote related to studying, exams, or academic success
3. Ensure all times are realistic (no 12-hour study marathons)
4. Respect excluded days absolutely
5. For monthly or custom durations, use actual dates in the 'day' field`;

        return prompt;
    }

    // ============================================
    // RATE LIMITING
    // ============================================
    function checkRateLimit() {
        const lastRequest = localStorage.getItem('crambot-last-request');
        
        if (lastRequest) {
            const timeDiff = Date.now() - parseInt(lastRequest);
            const minutesPassed = timeDiff / 60000;
            
            if (minutesPassed < 10) {
                const remainingMinutes = Math.ceil(10 - minutesPassed);
                return {
                    allowed: false,
                    message: `⏳ Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before generating another timetable.`
                };
            }
        }
        
        return { allowed: true };
    }

    function updateRateLimit() {
        localStorage.setItem('crambot-last-request', Date.now().toString());
    }

    // ============================================
    // UI STATE MANAGEMENT
    // ============================================
    const loadingSection = document.getElementById('loading-section');
    const errorSection = document.getElementById('error-section');
    const outputSection = document.getElementById('output-section');

    function showLoading() {
        hideAllSections();
        loadingSection.classList.add('active');
        loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideLoading() {
        loadingSection.classList.remove('active');
    }

    function showError(message) {
        hideAllSections();
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorSection.classList.add('active');
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showOutput() {
        hideAllSections();
        outputSection.classList.add('active');
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function hideAllSections() {
        loadingSection.classList.remove('active');
        errorSection.classList.remove('active');
        outputSection.classList.remove('active');
    }

    // ============================================
    // LOADING MESSAGES ANIMATION
    // ============================================
    const loadingMessages = [
        { main: '📊 Analyzing your courses...', sub: 'Calculating optimal study distribution' },
        { main: '🤖 Connecting with AI...', sub: 'Preparing personalized recommendations' },
        { main: '✨ Generating your timetable...', sub: 'AI is working its magic' },
        { main: '✅ Response received!', sub: 'Formatting your schedule' },
        { main: '🎨 Preparing your schedule...', sub: 'Almost ready!' }
    ];

    let messageInterval = null;

    function startLoadingAnimation() {
        let messageIndex = 0;
        updateLoadingMessage(0);
        
        messageInterval = setInterval(() => {
            messageIndex++;
            if (messageIndex < loadingMessages.length) {
                updateLoadingMessage(messageIndex);
            } else {
                clearInterval(messageInterval);
            }
        }, 2000);
    }

    function stopLoadingAnimation() {
        if (messageInterval) {
            clearInterval(messageInterval);
            messageInterval = null;
        }
    }

    function updateLoadingMessage(index) {
        const message = loadingMessages[index];
        document.getElementById('loading-message').textContent = message.main;
        document.getElementById('loading-submessage').textContent = message.sub;
    }

    // ============================================
    // BUILD TIMETABLE HTML
    // ============================================
    function buildTimetableHTML(timetableData, studentName) {
        const { timetable, motivationalQuote } = timetableData;

        // Build table rows
        let tableRows = '';
        timetable.forEach(session => {
            tableRows += `
                <tr>
                    <td>${session.day}</td>
                    <td>${session.startTime} - ${session.endTime}</td>
                    <td>${session.courseCode}</td>
                </tr>
            `;
        });

        // Determine column headers based on first entry
        const dayLabel = timetable[0]?.day?.includes('-') || timetable[0]?.day?.match(/\d/) ? 'Date' : 'Day';

        // Build complete HTML
        const html = `
            ${studentName ? `<h3>Welcome back, ${studentName}! 🎓</h3>` : '<h3>Your Personalized Timetable 🎓</h3>'}
            <table class="timetable-table">
                <thead>
                    <tr>
                        <th>${dayLabel}</th>
                        <th>Duration</th>
                        <th>Course</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <div style="margin-top: 2rem; padding: 1.5rem; background: var(--input-bg); border-left: 3px solid var(--accent-primary); border-radius: 8px; text-align: center;">
                <p style="font-style: italic; color: var(--text-secondary); font-size: 1.1rem;">"${motivationalQuote}"</p>
            </div>
        `;

        return html;
    }

    // ============================================
    // GENERATE TIMETABLE (MAIN FUNCTION)
    // ============================================
    const timetableForm = document.getElementById('timetable-form');
    
    timetableForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await generateTimetable();
    });

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
        if (GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
            showError('Please add your Gemini API key in the JavaScript file (crambot.js)');
            return;
        }

        // Generate prompt
        const prompt = generatePrompt(formData);

        // Show loading
        showLoading();
        startLoadingAnimation();

        try {
            // Call Gemini API
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            stopLoadingAnimation();

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            // Parse JSON response
            let timetableData;
            try {
                // Clean up response (remove markdown code blocks if present)
                const cleanedResponse = aiResponse
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();
                
                timetableData = JSON.parse(cleanedResponse);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.log('AI Response:', aiResponse);
                throw new Error('Failed to parse AI response. Please try again.');
            }

            // Validate response structure
            if (!timetableData.timetable || !Array.isArray(timetableData.timetable)) {
                throw new Error('Invalid timetable format received from AI');
            }

            // Build and display HTML
            const timetableHTML = buildTimetableHTML(timetableData, formData.studentName);
            document.getElementById('timetable-display').innerHTML = timetableHTML;

            // Update rate limit
            updateRateLimit();

            // Show output
            hideLoading();
            showOutput();

        } catch (error) {
            stopLoadingAnimation();
            hideLoading();
            console.error('Generation Error:', error);
            showError(`Failed to generate timetable: ${error.message}`);
        }
    }

    // ============================================
    // EXPORT FUNCTIONS
    // ============================================
    const exportImageBtn = document.getElementById('export-image-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    if (exportImageBtn) {
        exportImageBtn.addEventListener('click', exportAsImage);
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportAsPDF);
    }

    async function exportAsImage() {
        const element = document.getElementById('timetable-display');
        
        if (!element) {
            showError('No timetable to export');
            return;
        }

        try {
            if (typeof htmlToImage === 'undefined') {
                showError('Export library not loaded. Please refresh the page.');
                return;
            }

            const dataUrl = await htmlToImage.toPng(element, {
                quality: 1,
                backgroundColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--bg-card').trim(),
                pixelRatio: 2
            });

            const link = document.createElement('a');
            link.download = `crambot-timetable-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export error:', error);
            showError('Failed to export image. Please try again.');
        }
    }

    function exportAsPDF() {
        const element = document.getElementById('timetable-display');
        
        if (!element) {
            showError('No timetable to export');
            return;
        }

        try {
            if (typeof window.jspdf === 'undefined') {
                showError('PDF library not loaded. Please refresh the page.');
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
            console.error('PDF export error:', error);
            showError('Failed to export PDF. Please try again.');
        }
    }

    // ============================================
    // FORM ENHANCEMENTS
    // ============================================
    courseList.addEventListener('input', (e) => {
        if (e.target.classList.contains('course-code')) {
            e.target.value = e.target.value.toUpperCase();
        }
    });

    const studyHoursInput = document.getElementById('study-hours');
    if (studyHoursInput) {
        studyHoursInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1) e.target.value = 1;
            if (value > 16) e.target.value = 16;
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    console.log('%c🧠 CramBot Fully Initialized', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cAI Generation Ready! Add your API key to start.', 'color: #8b5cf6; font-size: 14px;');

})();