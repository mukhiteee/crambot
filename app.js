// ============================================
// CRAMBOT - COMPLETE JAVASCRIPT
// With Groq AI Generation & Timetable Rendering
// ============================================

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const GROQ_API_KEY = 'PASTE_YOUR_GROQ_KEY_HERE'; // Get from https://console.groq.com
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
            studyHoursRule = `Distribute approximately ${studyHours} hours per day across courses based on difficulty scores. Higher difficulty courses get proportionally more time.`;
        } else {
            studyHoursText = 'Not specified (AI should recommend)';
            studyHoursRule = 'Calculate recommended study hours based on total difficulty score of all courses. Recommend between 2-8 hours per day depending on course load. Higher difficulty = more daily hours.';
        }

        // Excluded days logic
        const excludedDaysText = excludedDays ? excludedDays.join(', ') : 'None (all days available)';

        // Study time logic
        let studyTimeText, studyTimeRule;
        if (studyTime) {
            studyTimeText = studyTime;
            studyTimeRule = `${studyTime} is the PREFERRED time (not mandatory). Aim for 60-70% of sessions during ${studyTime}. If difficulty scores are high or total study time increases, distribute sessions across other times of day to avoid jam-packing. Balance is key.`;
        } else {
            studyTimeText = 'Not specified';
            studyTimeRule = 'Use Evening as default preference (60-70% of sessions), but distribute flexibly across the day based on course load. Avoid scheduling all sessions at the same time. Evening = 4PM-8PM.';
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
   
3. TIME ALLOCATION BASED ON DIFFICULTY:
   - Higher difficulty courses get MORE study time and MORE frequent sessions
   - Lower difficulty courses (score < 40) may NOT require daily study - schedule 2-3 times per week
   - Medium difficulty courses (40-70) should be scheduled 4-5 times per week
   - High difficulty courses (70+) should be scheduled 5-7 times per week

===== STUDENT DATA =====
COURSES:
${courseList}
TOTAL CREDITS: ${totalCredits || 'Not applicable'}
AVAILABLE STUDY HOURS PER DAY: ${studyHoursText}
EXCLUDED DAYS: ${excludedDaysText}
PREFERRED STUDY TIME: ${studyTimeText}
TIMETABLE DURATION: ${duration}

===== SCHEDULING RULES =====

1. MINIMUM TIME PER COURSE (CRITICAL):
   For each course with credit units:
   - WEEKLY study time MUST be at least: Credit Unit × 60 minutes
   - Example: 3-credit course = minimum 180 minutes (3 hours) per week
   - This is the ABSOLUTE MINIMUM - higher difficulty courses should get MORE time
   - Distribute this time across multiple sessions (not one long session)

2. DIFFICULTY-BASED FREQUENCY:
   - Low difficulty (< 40): Schedule 2-3 times per week (not daily)
   - Medium difficulty (40-70): Schedule 4-5 times per week
   - High difficulty (70+): Schedule 5-7 times per week
   - Higher difficulty = more study time AND more frequent sessions

3. STUDY HOURS CALCULATION:
   ${studyHoursRule}

4. DAY EXCLUSION:
   - DO NOT schedule any study sessions on: ${excludedDaysText}
   - Only use available days in the timetable

5. TIME PREFERENCE (FLEXIBLE):
   ${studyTimeRule}

6. AVOID TIME JAM-PACKING:
   - DO NOT schedule all sessions at the same time of day
   - Spread sessions throughout the day for better retention and breathing space
   - If total daily study time > 4 hours, MUST use multiple time slots (morning, afternoon, evening)
   - Leave gaps between sessions for rest and processing
   - Example: Don't schedule all 5 courses from 4PM-9PM. Instead: 2 courses morning, 2 afternoon, 1 evening

7. DURATION LOGIC:
   ${durationRule}

8. GENERAL CONSTRAINTS:
   - Multiple courses CAN be scheduled per day (but spread across different times)
   - Include 10-15 minute breaks between consecutive study sessions
   - Vary study times to prevent burnout
   - Include specific start and end times (e.g., "4:00 PM - 6:00 PM")
   - Balance course rotation (don't schedule same course 3 days in a row if low difficulty)
   - Make the schedule realistic and sustainable
   - Sessions should be 45-120 minutes long (not too short, not marathons)

===== OUTPUT FORMAT =====
Return ONLY valid JSON in this EXACT format (no markdown, no code blocks, no explanations):

{
  "timetable": [
    {
      "day": "Monday",
      "startTime": "9:00 AM",
      "endTime": "10:30 AM",
      "courseCode": "CSC 201"
    },
    {
      "day": "Monday",
      "startTime": "4:00 PM",
      "endTime": "6:00 PM",
      "courseCode": "MTH 101"
    },
    {
      "day": "Tuesday",
      "startTime": "10:00 AM",
      "endTime": "11:30 AM",
      "courseCode": "PHY 102"
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
2. Each course MUST meet minimum weekly time: Credit Unit × 60 minutes
3. Low difficulty courses should NOT appear daily - space them out
4. DO NOT jam-pack all sessions at the same time - spread throughout the day
5. Include a motivational quote related to studying, exams, or academic success
6. Ensure all times are realistic (no 12-hour study marathons)
7. Respect excluded days absolutely
8. For monthly or custom durations, use actual dates in the 'day' field
9. Preferred study time is a PREFERENCE (60-70%), not a mandate - use other times when needed`;

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
        if (GROQ_API_KEY === 'PASTE_YOUR_GROQ_KEY_HERE') {
            showError('Please add your Groq API key in the JavaScript file. Get it from https://console.groq.com');
            return;
        }

        // Generate prompt
        const prompt = generatePrompt(formData);

        // Show loading
        showLoading();
        startLoadingAnimation();

        try {
            // Call Groq API
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert academic study planner. Generate responses ONLY in valid JSON format with no additional text, markdown, or code blocks. Return pure JSON only."
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

            // Parse JSON response
            let timetableData;
            try {
                // Clean up response (remove any potential markdown)
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

})();