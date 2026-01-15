// ============================================
// CRAMBOT - BASIC JAVASCRIPT
// Theme, Course Management, Form Validation
// ============================================

(function() {
    'use strict';

    // ============================================
    // THEME TOGGLE
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('crambot-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Theme toggle click handler
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

    // Add first course on page load
    addCourse();

    // Add course button click handler
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
                    <input 
                        type="text" 
                        class="form-input course-code" 
                        placeholder="e.g., CSC 201" 
                        required>
                </div>
                <div>
                    <label class="form-label">Course Title</label>
                    <input 
                        type="text" 
                        class="form-input course-title" 
                        placeholder="e.g., Data Structures" 
                        required>
                </div>
                <div>
                    <label class="form-label">Credit Unit</label>
                    <input 
                        type="number" 
                        class="form-input course-credit" 
                        min="1" 
                        max="6" 
                        placeholder="3" 
                        required>
                </div>
                <button 
                    type="button" 
                    class="remove-course" 
                    onclick="removeCourse(${courseCount})"
                    aria-label="Remove course">
                    ✕
                </button>
            </div>
        `;
        
        courseList.appendChild(courseItem);
    }

    // Remove course function (global scope for onclick)
    window.removeCourse = function(courseId) {
        const courseItem = document.querySelector(`[data-course-id="${courseId}"]`);
        if (courseItem) {
            // Don't allow removing the last course
            const totalCourses = courseList.querySelectorAll('.course-item').length;
            if (totalCourses <= 1) {
                showError('You must have at least one course');
                return;
            }
            
            courseItem.remove();
        }
    };

    // ============================================
    // FORM VALIDATION
    // ============================================
    const timetableForm = document.getElementById('timetable-form');
    const studentNameInput = document.getElementById('student-name');

    // Prevent form submission (we'll handle it manually)
    timetableForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Form submission will be handled in the next phase
        console.log('Form submitted - AI generation will be added next');
    });

    // ============================================
    // COLLECT FORM DATA
    // ============================================
    function collectFormData() {
        // Student name
        const studentName = studentNameInput.value.trim();
        
        if (!studentName) {
            showError('Please enter your name');
            return null;
        }

        // Collect courses
        const courses = [];
        const courseItems = courseList.querySelectorAll('.course-item');
        
        courseItems.forEach((item) => {
            const code = item.querySelector('.course-code').value.trim();
            const title = item.querySelector('.course-title').value.trim();
            const credit = item.querySelector('.course-credit').value;

            if (code && title && credit) {
                courses.push({
                    code: code,
                    title: title,
                    credit: parseInt(credit)
                });
            }
        });

        if (courses.length === 0) {
            showError('Please add at least one course with all fields filled');
            return null;
        }

        // Collect optional preferences
        const studyHours = document.getElementById('study-hours').value;
        
        const excludedDays = Array.from(
            document.querySelectorAll('input[type="checkbox"]:checked')
        ).map(cb => cb.value);

        const studyTime = document.querySelector('input[name="study-time"]:checked')?.value || 'Evening';
        const duration = document.querySelector('input[name="duration"]:checked')?.value || 'Weekly';

        // Calculate total credit units
        const totalCredits = courses.reduce((sum, course) => sum + course.credit, 0);

        // Sort courses by credit (heavier courses first)
        courses.sort((a, b) => b.credit - a.credit);

        return {
            studentName,
            courses,
            totalCredits,
            studyHours: studyHours || null,
            excludedDays,
            studyTime,
            duration
        };
    }

    // Make collectFormData available globally for next phase
    window.collectFormData = collectFormData;

    // ============================================
    // UI STATE MANAGEMENT
    // ============================================
    const loadingSection = document.getElementById('loading-section');
    const errorSection = document.getElementById('error-section');
    const outputSection = document.getElementById('output-section');

    function showLoading() {
        hideAllSections();
        loadingSection.classList.add('active');
    }

    function hideLoading() {
        loadingSection.classList.remove('active');
    }

    function showError(message) {
        hideAllSections();
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorSection.classList.add('active');
        
        // Scroll to error
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showOutput() {
        hideAllSections();
        outputSection.classList.add('active');
        
        // Scroll to output
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function hideAllSections() {
        loadingSection.classList.remove('active');
        errorSection.classList.remove('active');
        outputSection.classList.remove('active');
    }

    // Make UI functions available globally
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.showError = showError;
    window.showOutput = showOutput;

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
        const loadingTitle = document.getElementById('loading-message');
        const loadingSubtitle = document.getElementById('loading-submessage');
        
        if (loadingTitle && loadingSubtitle) {
            loadingTitle.textContent = message.main;
            loadingSubtitle.textContent = message.sub;
        }
    }

    // Make loading animation functions available globally
    window.startLoadingAnimation = startLoadingAnimation;
    window.stopLoadingAnimation = stopLoadingAnimation;

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

    // Make rate limit functions available globally
    window.checkRateLimit = checkRateLimit;
    window.updateRateLimit = updateRateLimit;

    // ============================================
    // EXPORT FUNCTIONS (IMAGE & PDF)
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
            // Check if html-to-image library is loaded
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
            // Check if jsPDF library is loaded
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
    // FORM FIELD ENHANCEMENTS
    // ============================================
    
    // Auto-uppercase course codes
    courseList.addEventListener('input', (e) => {
        if (e.target.classList.contains('course-code')) {
            e.target.value = e.target.value.toUpperCase();
        }
    });

    // Limit study hours input
    const studyHoursInput = document.getElementById('study-hours');
    if (studyHoursInput) {
        studyHoursInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1) e.target.value = 1;
            if (value > 16) e.target.value = 16;
        });
    }

    // ============================================
    // CONSOLE INFO
    // ============================================
    console.log('%c🧠 CramBot Initialized', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cBasic features loaded. AI generation will be added next.', 'color: #8b5cf6; font-size: 14px;');

})();