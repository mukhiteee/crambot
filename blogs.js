// ============================================
// BLOGS PAGE - JAVASCRIPT
// ============================================

(function() {
    'use strict';

    // ============================================
    // BLOG DATA
    // ============================================
    const BLOG_POSTS = {
        'spaced-repetition': {
            id: 'spaced-repetition',
            title: 'How to Use Spaced Repetition Effectively',
            category: 'study-technique',
            emoji: '📖',
            excerpt: 'Master the art of long-term retention with proven techniques that help you remember more with less effort.',
            date: 'January 15, 2026',
            readTime: '6 min read',
            author: 'Mukhiteee',
            body: `
                <h2>Understanding Spaced Repetition</h2>
                <p>Spaced repetition is one of the most powerful and scientifically-backed learning techniques available. Instead of cramming all your study material into one or two sessions, spaced repetition involves reviewing information at increasing intervals over time.</p>
                
                <p>When you first learn something, you need to review it fairly soon to strengthen the memory. As the memory becomes stronger, you can increase the time between reviews. This is based on the psychological phenomenon known as the <strong>forgetting curve</strong>, which shows how quickly we forget information that we don't review.</p>

                <h3>The Science Behind Spaced Repetition</h3>
                <p>The forgetting curve was first described by Hermann Ebbinghaus in 1885. His research showed that:</p>
                <ul>
                    <li>We forget about 50% of new information within one hour</li>
                    <li>We forget about 70% within 24 hours</li>
                    <li>Without reinforcement, we can lose up to 90% of what we learned within a month</li>
                </ul>

                <p>However, each time we review the information, the forgetting curve becomes less steep. This means we retain more information for longer periods between reviews. This is the core principle of spaced repetition.</p>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">💡 Key Insight</div>
                    <p>Each time you review material you've previously learned, the time it takes to forget it again extends. This is why spacing out your reviews is so effective.</p>
                </div>

                <h3>How to Implement Spaced Repetition</h3>
                <p>Here's a practical approach to implementing spaced repetition in your studies:</p>

                <ol>
                    <li><strong>First Review:</strong> Review the material the same day you learn it (within a few hours if possible)</li>
                    <li><strong>Second Review:</strong> Review it again the next day</li>
                    <li><strong>Third Review:</strong> Review it 3 days after the first review</li>
                    <li><strong>Fourth Review:</strong> Review it a week after the first review</li>
                    <li><strong>Fifth Review:</strong> Review it two weeks after the first review</li>
                    <li><strong>Sixth Review:</strong> Review it a month after the first review</li>
                </ol>

                <p>This schedule is just a guideline. The exact timing isn't as important as the principle: start with short intervals and gradually increase them as your memory strengthens.</p>

                <h3>Tools to Help With Spaced Repetition</h3>
                <p>Several tools can help you implement spaced repetition more effectively:</p>
                <ul>
                    <li><strong>Flashcard apps:</strong> Anki, Quizlet, and similar apps automatically manage spacing intervals</li>
                    <li><strong>Note-taking systems:</strong> Create your own system using notes organized by date</li>
                    <li><strong>CramBot:</strong> Use our AI-powered timetable to schedule your review sessions</li>
                </ul>

                <h3>Combining Spaced Repetition with Active Recall</h3>
                <p>Spaced repetition is even more powerful when combined with <strong>active recall</strong>. Instead of passively re-reading your notes, actively try to remember the information before looking at the answer. This forces your brain to retrieve the information, which strengthens the memory even more.</p>

                <p>When reviewing with spaced repetition, try to recall the information from memory first, then check your notes or flashcards to verify.</p>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">✨ Pro Tip</div>
                    <p>Create flashcard decks organized by topic. Review new material frequently at first, then gradually space out your reviews as you improve. This is the most efficient way to learn large amounts of material.</p>
                </div>

                <h2>Getting Started Today</h2>
                <p>Start implementing spaced repetition immediately:</p>
                <ol>
                    <li>Review your notes from today within the next few hours</li>
                    <li>Set a reminder to review again tomorrow</li>
                    <li>Use your calendar or CramBot to schedule future review sessions</li>
                    <li>Track your progress and adjust intervals as needed</li>
                </ol>

                <p>Remember: spaced repetition isn't just about memorization. It's about building genuine, lasting understanding that you can apply confidently in your exams.</p>
            `
        },
        'pomodoro-technique': {
            id: 'pomodoro-technique',
            title: 'The Pomodoro Technique for Students',
            category: 'time-management',
            emoji: '⏰',
            excerpt: 'Break your study sessions into focused intervals to maximize productivity and avoid burnout.',
            date: 'January 12, 2026',
            readTime: '5 min read',
            author: 'Mukhiteee',
            body: `
                <h2>What is the Pomodoro Technique?</h2>
                <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It's elegantly simple: break your work into focused 25-minute intervals (called "pomodoros"), separated by short breaks.</p>

                <p>The word "pomodoro" is Italian for "tomato" – Cirillo used a tomato-shaped kitchen timer when he was a student, and the name stuck!</p>

                <h3>The Basic Pomodoro Cycle</h3>
                <ol>
                    <li>Choose a task to work on</li>
                    <li>Set a timer for 25 minutes</li>
                    <li>Work with complete focus until the timer rings</li>
                    <li>Take a 5-minute break</li>
                    <li>After completing 4 pomodoros, take a longer break (15-30 minutes)</li>
                </ol>

                <h3>Why the Pomodoro Technique Works</h3>
                <p>This technique is particularly effective for students because:</p>
                <ul>
                    <li><strong>Manages mental fatigue:</strong> 25 minutes is long enough to make real progress but short enough to maintain focus</li>
                    <li><strong>Reduces procrastination:</strong> It's easier to start studying when you know you only have to focus for 25 minutes</li>
                    <li><strong>Improves focus:</strong> Knowing the timer is running helps eliminate distractions</li>
                    <li><strong>Prevents burnout:</strong> Regular breaks keep your mind fresh throughout the day</li>
                    <li><strong>Builds consistency:</strong> The rhythm becomes habitual and easier to maintain</li>
                </ul>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">⚡ Why 25 Minutes?</div>
                    <p>Research shows that 25 minutes is an optimal focus interval for most people. It's long enough to get into a productive flow state, but short enough that you can maintain peak concentration.</p>
                </div>

                <h2>Tips for Success with Pomodoro</h2>

                <h3>1. Choose Your Pomodoro Length</h3>
                <p>While 25 minutes is standard, you can adjust based on your needs:</p>
                <ul>
                    <li><strong>Beginners:</strong> Start with 15-20 minutes</li>
                    <li><strong>Standard:</strong> 25 minutes</li>
                    <li><strong>Deep work:</strong> 50 minutes (then take a longer break)</li>
                </ul>

                <h3>2. Eliminate Distractions</h3>
                <p>During your pomodoro:</p>
                <ul>
                    <li>Turn off your phone (or put it in another room)</li>
                    <li>Close unnecessary browser tabs</li>
                    <li>Let people around you know you're focusing</li>
                    <li>Use website blockers if needed</li>
                </ul>

                <h3>3. Use Breaks Effectively</h3>
                <p>Your 5-minute break isn't for checking social media. Use it to:</p>
                <ul>
                    <li>Stretch and move around</li>
                    <li>Get some water or a healthy snack</li>
                    <li>Close your eyes and rest them</li>
                    <li>Take deep breaths</li>
                </ul>

                <h3>4. Track Your Pomodoros</h3>
                <p>Keep a simple tally of how many pomodoros you complete. This serves as:</p>
                <ul>
                    <li>A visual representation of your work</li>
                    <li>Motivation to maintain your streak</li>
                    <li>Data to understand your productivity patterns</li>
                </ul>

                <h2>Using Pomodoro with CramBot</h2>
                <p>CramBot can help you structure your pomodoros effectively. Generate a timetable that allocates specific courses to specific pomodoro sessions. This combines the power of both techniques:</p>
                <ul>
                    <li>CramBot creates your overall study schedule</li>
                    <li>Pomodoro keeps you focused during each study session</li>
                </ul>

                <h2>Common Mistakes to Avoid</h2>
                <ul>
                    <li><strong>Skipping breaks:</strong> Breaks are essential for maintaining focus</li>
                    <li><strong>Starting a new task mid-pomodoro:</strong> Finish your current pomodoro first</li>
                    <li><strong>Using your break to check notifications:</strong> This defeats the purpose of a mental break</li>
                    <li><strong>Not tracking your pomodoros:</strong> Tracking provides motivation and data</li>
                </ul>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">✨ Pro Tip</div>
                    <p>Combine Pomodoro with spaced repetition for ultimate studying power. Use pomodoros to maintain focus during each study session, and space out your study sessions to maximize retention.</p>
                </div>

                <h2>Getting Started</h2>
                <p>Start using the Pomodoro Technique today:</p>
                <ol>
                    <li>Download a Pomodoro timer app or use an online timer</li>
                    <li>Choose your first study task</li>
                    <li>Set the timer for 25 minutes</li>
                    <li>Study with complete focus until the timer rings</li>
                    <li>Take a 5-minute break</li>
                    <li>Repeat!</li>
                </ol>

                <p>After just a few days of using this technique, you'll notice a significant improvement in your focus and productivity.</p>
            `
        },
        'active-recall': {
            id: 'active-recall',
            title: 'Active Recall: Study Smarter, Not Harder',
            category: 'study-technique',
            emoji: '🧠',
            excerpt: 'Learn why testing yourself is the most effective way to study for exams.',
            date: 'January 10, 2026',
            readTime: '7 min read',
            author: 'Mukhiteee',
            body: `
                <h2>What is Active Recall?</h2>
                <p>Active recall is the practice of retrieving information from memory without looking at your notes. Instead of passively re-reading material, you actively try to remember it. This might involve:</p>
                <ul>
                    <li>Answering practice questions</li>
                    <li>Creating flashcards and testing yourself</li>
                    <li>Writing summaries from memory</li>
                    <li>Teaching someone else the material</li>
                    <li>Completing practice exams</li>
                </ul>

                <h3>Why Active Recall Works</h3>
                <p>Research consistently shows that active recall is one of the most effective learning techniques. When you actively retrieve information from memory, you strengthen the neural pathways associated with that information, making it easier to recall in the future.</p>

                <p>In contrast, passive studying (like re-reading notes) feels easier and more familiar, but it doesn't strengthen your memory as effectively. This is known as the <strong>fluency illusion</strong> – material feels easier to understand the more familiar it becomes, but familiarity doesn't equal learning.</p>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">🔬 The Research</div>
                    <p>Studies show that students who use active recall perform significantly better on exams than those who use passive study methods. One meta-analysis found that the effect size of active recall on learning is comparable to other well-established learning interventions.</p>
                </div>

                <h2>How to Implement Active Recall</h2>

                <h3>Method 1: Flashcards</h3>
                <p>Create flashcards with questions on one side and answers on the other. Test yourself by reading the question and trying to recall the answer before flipping the card.</p>

                <p>Benefits:</p>
                <ul>
                    <li>Easy to create and use</li>
                    <li>Perfect for spaced repetition</li>
                    <li>Can be done anywhere</li>
                    <li>Works well with digital apps</li>
                </ul>

                <h3>Method 2: Practice Questions</h3>
                <p>Complete practice questions without looking at your notes. Use textbook end-of-chapter questions, past exams, or practice tests provided by your teacher.</p>

                <p>Benefits:</p>
                <ul>
                    <li>Mimics exam conditions</li>
                    <li>Identifies knowledge gaps</li>
                    <li>Builds exam confidence</li>
                    <li>Often provided by your course</li>
                </ul>

                <h3>Method 3: Writing Summaries</h3>
                <p>Close your notes and write a summary of what you remember. Then compare your summary to your notes and add any missing information.</p>

                <p>Benefits:</p>
                <ul>
                    <li>Engages multiple retrieval routes</li>
                    <li>Helps identify weak areas</li>
                    <li>Creates useful study material for later</li>
                    <li>Strengthens understanding</li>
                </ul>

                <h3>Method 4: Teaching Others</h3>
                <p>Explain the material to someone else (or even to an imaginary audience). This forces you to organize and articulate what you know.</p>

                <p>Benefits:</p>
                <ul>
                    <li>Reveals gaps in understanding</li>
                    <li>Forces organization of knowledge</li>
                    <li>Makes learning social and engaging</li>
                    <li>Helps you retain information longer</li>
                </ul>

                <h3>Method 5: Practice Exams</h3>
                <p>Take full practice exams under conditions similar to your actual exam. This is the ultimate form of active recall.</p>

                <p>Benefits:</p>
                <ul>
                    <li>Most realistic preparation</li>
                    <li>Builds exam stamina</li>
                    <li>Identifies weak topics</li>
                    <li>Builds confidence</li>
                </ul>

                <h2>Combining Active Recall with Spaced Repetition</h2>
                <p>Active recall is even more powerful when combined with spaced repetition. Here's how:</p>

                <ol>
                    <li>Create flashcards for new material</li>
                    <li>Test yourself immediately (active recall)</li>
                    <li>Review the same cards the next day (spaced repetition + active recall)</li>
                    <li>Review 3 days later, then a week later, then two weeks later</li>
                    <li>Each review session involves active recall – you try to remember before checking the answer</li>
                </ol>

                <p>This combination is incredibly powerful because you're both increasing the spacing between reviews AND strengthening the neural pathways through retrieval practice.</p>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">✨ Pro Tip</div>
                    <p>The difficulty of retrieval matters. If you can answer a question perfectly every time, that's a sign you're overlearning that material. Focus on material that's challenging but doable – this is where the most learning occurs.</p>
                </div>

                <h2>Common Mistakes with Active Recall</h2>
                <ul>
                    <li><strong>Looking at notes before answering:</strong> This defeats the purpose of active recall</li>
                    <li><strong>Only testing easy material:</strong> Focus on difficult material you're more likely to forget</li>
                    <li><strong>Not reading the answers:</strong> After recalling, always check if you're correct</li>
                    <li><strong>Stopping too early:</strong> Continue testing yourself even after you get answers right</li>
                </ul>

                <h2>Getting Started</h2>
                <p>Start implementing active recall in your studying today:</p>

                <ol>
                    <li>Identify key concepts in your current material</li>
                    <li>Create flashcards or write practice questions</li>
                    <li>Test yourself without looking at your notes</li>
                    <li>Check your answers and note any mistakes</li>
                    <li>Schedule review sessions for future dates</li>
                    <li>Use CramBot to organize your study schedule</li>
                </ol>

                <p>Remember: the goal isn't to feel like you're learning. The goal is to actually learn and remember the material for the long term. Active recall might feel harder, but that's a sign it's working!</p>
            `
        },
        'study-environment': {
            id: 'study-environment',
            title: 'Creating the Perfect Study Environment',
            category: 'wellness',
            emoji: '📝',
            excerpt: 'Optimize your workspace for maximum focus and minimal distractions.',
            date: 'January 8, 2026',
            readTime: '6 min read',
            author: 'Mukhiteee',
            body: `
                <h2>Why Your Study Environment Matters</h2>
                <p>Your environment has a profound impact on your ability to focus and learn. A well-designed study space can boost productivity by up to 25% or more. Conversely, a cluttered, noisy, or uncomfortable environment can drain your mental energy and make studying feel much harder.</p>

                <p>The good news? Creating an optimal study environment doesn't require expensive furniture or a dedicated study room. With some thoughtful planning, you can transform any space into a productivity powerhouse.</p>

                <h2>Key Elements of an Optimal Study Environment</h2>

                <h3>1. Minimize Distractions</h3>
                <p>Distractions are the enemy of deep learning. Here's how to minimize them:</p>

                <ul>
                    <li><strong>Physical distractions:</strong> Put your phone in another room, not just face-down on your desk</li>
                    <li><strong>Visual distractions:</strong> Clear your desk of unrelated items, close unnecessary browser tabs</li>
                    <li><strong>Auditory distractions:</strong> Use noise-cancelling headphones or white noise if needed</li>
                    <li><strong>Digital distractions:</strong> Turn off notifications, log out of social media, use apps like Freedom or Cold Turkey</li>
                </ul>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">⚡ The "Phone Away" Technique</div>
                    <p>Research shows that even the presence of your phone reduces cognitive performance. If your phone is in another room (not just out of sight), you'll focus better and think more clearly.</p>
                </div>

                <h3>2. Optimize Lighting</h3>
                <p>Lighting dramatically affects both mood and focus:</p>

                <ul>
                    <li><strong>Natural light:</strong> Best option when possible – natural light improves mood and alertness</li>
                    <li><strong>Bright light:</strong> Choose cool white (5000K+) rather than warm light for focused work</li>
                    <li><strong>Reduce glare:</strong> Position your desk to avoid glare on your screen</li>
                    <li><strong>Dim light is bad:</strong> Don't study in dim light – it causes eye strain and reduces focus</li>
                </ul>

                <h3>3. Control Temperature</h3>
                <p>Temperature significantly affects cognitive function:</p>

                <ul>
                    <li>Optimal study temperature: 69-72°F (20-22°C)</li>
                    <li>Too warm: Increases drowsiness</li>
                    <li>Too cold: Reduces focus</li>
                    <li>Keep a light layer to adjust easily</li>
                </ul>

                <h3>4. Choose the Right Furniture</h3>
                <p>You don't need a $1000 desk, but your furniture should:</p>

                <ul>
                    <li><strong>Chair:</strong> Support your back properly, allow feet to rest flat on ground</li>
                    <li><strong>Desk:</strong> High enough to keep elbows at 90 degrees</li>
                    <li><strong>Monitor:</strong> Top of screen at eye level, arm's length away</li>
                    <li><strong>Comfort:</strong> You'll study longer in a comfortable chair</li>
                </ul>

                <h3>5. Minimize Visual Clutter</h3>
                <p>A cluttered desk leads to a cluttered mind. Keep your study space clean:</p>

                <ul>
                    <li>Remove items you don't need for your current task</li>
                    <li>Use organizers for supplies and materials</li>
                    <li>Clean your desk before starting each study session</li>
                    <li>Keep the desk surface clear except for essentials</li>
                </ul>

                <h3>6. Curate Your Sound Environment</h3>
                <p>The ideal sound environment depends on your preference:</p>

                <ul>
                    <li><strong>Complete silence:</strong> Best for complex problem-solving</li>
                    <li><strong>White noise:</strong> Masks distracting sounds</li>
                    <li><strong>Music without lyrics:</strong> Try lo-fi hip-hop, classical, or ambient music</li>
                    <li><strong>Nature sounds:</strong> Rain, forest, or ocean sounds can improve focus</li>
                </ul>

                <h3>7. Add Some Greenery</h3>
                <p>Plants aren't just decorative – they have real benefits:</p>

                <ul>
                    <li>Improve air quality</li>
                    <li>Reduce stress and improve mood</li>
                    <li>Increase oxygen levels</li>
                    <li>Even fake plants provide some psychological benefits</li>
                </ul>

                <h2>Setting Up Your Study Space</h2>

                <h3>The "Three Zones" Approach</h3>
                <p>Consider setting up three different zones if you have space:</p>

                <ol>
                    <li><strong>Focus Zone:</strong> Minimal distractions, optimal for deep work</li>
                    <li><strong>Reading Zone:</strong> Comfortable seating for reading and review</li>
                    <li><strong>Break Zone:</strong> Separate space for breaks to recharge</li>
                </ol>

                <h3>The Quick Checklist</h3>
                <p>Before each study session, verify:</p>
                <ul>
                    <li>☑ Phone is in another room</li>
                    <li>☑ Desk is clean and organized</li>
                    <li>☑ All materials needed are available</li>
                    <li>☑ Lighting is adequate</li>
                    <li>☑ Temperature is comfortable</li>
                    <li>☑ No tabs or apps are open except those needed</li>
                </ul>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">✨ Pro Tip</div>
                    <p>Create a "study ritual" – perform the same setup steps before each session. Your brain will start associating this routine with focus and learning, making it easier to concentrate.</p>
                </div>

                <h2>On a Budget</h2>
                <p>If you can't invest in new furniture or equipment:</p>

                <ul>
                    <li>Use a hard surface (even a file box) as a monitor stand</li>
                    <li>Roll up a towel for lumbar support</li>
                    <li>Use apps like Noisli for white noise instead of machines</li>
                    <li>Open your window for natural light and fresh air</li>
                    <li>Use free websites for background music</li>
                </ul>

                <h2>Making It Personal</h2>
                <p>While the above principles are evidence-based, the best study environment is one that works for YOU. Experiment with:</p>

                <ul>
                    <li>Different types of music or silence</li>
                    <li>Different times of day</li>
                    <li>Different locations</li>
                    <li>Different study methods</li>
                </ul>

                <p>Track what works best and optimize accordingly.</p>
            `
        },
        'sleep-study': {
            id: 'sleep-study',
            title: 'Why Sleep is Your Secret Weapon',
            category: 'wellness',
            emoji: '💤',
            excerpt: 'Discover how proper rest dramatically improves memory consolidation and exam performance.',
            date: 'January 5, 2026',
            readTime: '8 min read',
            author: 'Mukhiteee',
            body: `
                <h2>The Science of Sleep and Learning</h2>
                <p>Here's a hard truth: cramming all night might feel productive, but it's actually one of the worst things you can do for your learning and performance. Sleep isn't a luxury – it's a biological necessity for learning and memory.</p>

                <p>During sleep, your brain consolidates memories, strengthens neural connections, and clears metabolic waste that accumulates during the day. Without adequate sleep, your brain simply cannot function at its best.</p>

                <h3>What Happens During Sleep?</h3>
                <p>Sleep consists of multiple stages, each playing a crucial role in learning:</p>

                <ul>
                    <li><strong>Light Sleep (NREM 1-2):</strong> Helps organize and process information</li>
                    <li><strong>Deep Sleep (NREM 3):</strong> Critical for memory consolidation and learning</li>
                    <li><strong>REM Sleep:</strong> Important for procedural learning and problem-solving</li>
                </ul>

                <p>A complete sleep cycle takes about 90 minutes. Most people need 4-6 complete cycles per night, which equals 6-9 hours of sleep.</p>

                <h2>How Sleep Affects Your Brain</h2>

                <h3>Memory Consolidation</h3>
                <p>When you learn something new, it's initially stored in your short-term memory. During sleep, your brain transfers this information to long-term memory through a process called <strong>memory consolidation</strong>.</p>

                <p>Without sleep, this transfer doesn't happen efficiently. You might remember something briefly, but without sleep, you'll forget it quickly.</p>

                <h3>Problem-Solving and Insight</h3>
                <p>Sleep doesn't just consolidate facts – it helps you understand concepts and solve problems. Many discoveries and breakthroughs come to people after sleep because their brain has had time to process and reorganize information.</p>

                <h3>Attention and Focus</h3>
                <p>Sleep deprivation severely impairs attention and focus. After just one night of poor sleep, you'll find it much harder to concentrate. This creates a vicious cycle: you study poorly, so you study longer, which causes you to sleep less, which makes you study even more poorly.</p>

                <h3>Learning Capacity</h3>
                <p>Your brain has a limited capacity to learn new information each day. Sleep resets this capacity. Without adequate sleep, you quickly reach diminishing returns – more hours of studying won't help because your brain simply can't absorb more.</p>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">🧠 The Sleep-Learning Connection</div>
                    <p>Studies show that students who get adequate sleep significantly outperform sleep-deprived students, even when the well-rested students study fewer hours. Quality sleep beats quantity of study time.</p>
                </div>

                <h2>How Much Sleep Do You Need?</h2>

                <h3>General Guidelines</h3>
                <ul>
                    <li><strong>Teenagers:</strong> 8-10 hours per night</li>
                    <li><strong>Adults:</strong> 7-9 hours per night</li>
                    <li><strong>Some people:</strong> Naturally need more or less (range is typically 6-10 hours)</li>
                </ul>

                <h3>How to Determine Your Optimal Sleep Duration</h3>
                <p>Try this experiment during a break from school:</p>

                <ol>
                    <li>Go to bed at a consistent time</li>
                    <li>Wake up naturally without an alarm (if possible)</li>
                    <li>Do this for 7-10 days to let your natural rhythm stabilize</li>
                    <li>Note how many hours you sleep and how you feel</li>
                    <li>Gradually adjust bedtime until you find the duration where you feel most alert</li>
                </ol>

                <h2>Sleep Strategies for Students</h2>

                <h3>1. Maintain a Consistent Schedule</h3>
                <p>Going to bed and waking up at the same time every day – even weekends – helps your body maintain a healthy sleep-wake cycle.</p>

                <ul>
                    <li>Choose a bedtime that allows 7-9 hours before you need to wake</li>
                    <li>Try to stick to this schedule ±30 minutes every day</li>
                    <li>Consistency is more important than perfection</li>
                </ul>

                <h3>2. Create a Sleep-Friendly Environment</h3>
                <p>Your bedroom should be optimized for sleep:</p>

                <ul>
                    <li><strong>Temperature:</strong> 60-67°F (15-19°C) is ideal</li>
                    <li><strong>Darkness:</strong> Use blackout curtains or an eye mask</li>
                    <li><strong>Quietness:</strong> Use earplugs or white noise if needed</li>
                    <li><strong>Cleanliness:</strong> A tidy room feels more relaxing</li>
                    <li><strong>Comfort:</strong> Good pillow and mattress make a huge difference</li>
                </ul>

                <h3>3. Develop a Pre-Sleep Routine</h3>
                <p>30-60 minutes before bed, start winding down:</p>

                <ul>
                    <li>Dim the lights</li>
                    <li>Avoid screens (or use blue light filters)</li>
                    <li>Read, journal, or do light stretching</li>
                    <li>Keep the room cool</li>
                    <li>Try meditation or deep breathing</li>
                </ul>

                <h3>4. Manage Light Exposure</h3>
                <p>Light is the primary signal that controls your sleep-wake cycle:</p>

                <ul>
                    <li><strong>Morning:</strong> Get bright light exposure right after waking</li>
                    <li><strong>Afternoon:</strong> Go outside during daylight</li>
                    <li><strong>Evening:</strong> Dim lights and avoid screens 1-2 hours before bed</li>
                    <li><strong>Night:</strong> Keep your bedroom completely dark</li>
                </ul>

                <h3>5. Mind Your Caffeine and Alcohol</h3>
                <p>What you consume affects your sleep quality:</p>

                <ul>
                    <li><strong>Caffeine:</strong> Avoid after 2 PM (half-life is 5-6 hours)</li>
                    <li><strong>Alcohol:</strong> Feels like it helps sleep but actually disrupts sleep quality</li>
                    <li><strong>Food:</strong> Avoid large meals 2-3 hours before bed</li>
                    <li><strong>Water:</strong> Hydrate during the day, reduce intake before bed</li>
                </ul>

                <h3>6. Exercise Regularly</h3>
                <p>Physical activity improves sleep quality:</p>

                <ul>
                    <li>Exercise during the day or early afternoon</li>
                    <li>Avoid intense exercise within 3 hours of bedtime</li>
                    <li>Even 20-30 minutes of daily exercise significantly improves sleep</li>
                </ul>

                <div class="blog-post-highlight">
                    <div class="blog-post-highlight-title">✨ Pro Tip</div>
                    <p>If you're about to take an exam and you have to choose between studying more and sleeping more, choose sleep. An extra hour of sleep will boost your exam performance more than an extra hour of studying.</p>
                </div>

                <h2>What About Naps?</h2>
                <p>Strategic napping can boost productivity:</p>

                <ul>
                    <li><strong>15-20 minute nap:</strong> Refreshes you without sleep inertia</li>
                    <li><strong>60-90 minute nap:</strong> Complete sleep cycle for full cognitive benefit</li>
                    <li><strong>Timing:</strong> Nap in early afternoon (1-3 PM) for best results</li>
                    <li><strong>Avoid late naps:</strong> Napping after 3 PM can disrupt nighttime sleep</li>
                </ul>

                <h2>The All-Nighter Reality Check</h2>
                <p>You might think you're being productive by pulling an all-nighter, but here's what actually happens:</p>

                <ul>
                    <li>Your cognitive performance drops by 40-50% with one night of no sleep</li>
                    <li>You feel like you're learning, but you're actually retaining very little</li>
                    <li>Your emotional regulation suffers – you become irritable</li>
                    <li>Your immune system is suppressed – you're more likely to get sick</li>
                    <li>The next day, your performance is even worse, and recovery takes days</li>
                </ul>

                <p>The better strategy: study effectively during the day, get adequate sleep, and do a brief review the morning of the exam if needed.</p>

                <h2>Getting Started</h2>
                <p>Start prioritizing sleep tonight:</p>

                <ol>
                    <li>Calculate what time you need to go to bed to get 7-9 hours of sleep</li>
                    <li>Set a consistent bedtime and stick to it for two weeks</li>
                    <li>Create a pre-sleep routine</li>
                    <li>Optimize your bedroom environment</li>
                    <li>Notice how your focus and learning improve</li>
                    <li>Use CramBot to schedule study sessions that don't interfere with sleep</li>
                </ol>

                <p>Remember: sleep isn't lazy. Sleep is when your brain does some of its most important work. Prioritize sleep, and you'll see improvements in every area of your life – including your academic performance.</p>
            `
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    document.addEventListener('DOMContentLoaded', function() {
        initializeBlogs();
    });

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    function initializeBlogs() {
        // Get the post ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('post');

        // Render blog list in sidebar
        renderBlogList(postId);

        // Render main content
        if (postId && BLOG_POSTS[postId]) {
            renderBlogPost(postId);
        } else {
            renderAllBlogsList();
        }

        // Setup theme toggle
        setupThemeToggle();
    }

    function renderBlogList(activePostId) {
        const blogListContainer = document.getElementById('blog-list');
        if (!blogListContainer) return;

        blogListContainer.innerHTML = '';

        Object.values(BLOG_POSTS).forEach(post => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = `./blogs.html?post=${post.id}`;
            a.textContent = post.title;
            a.className = activePostId === post.id ? 'active' : '';

            li.appendChild(a);
            blogListContainer.appendChild(li);
        });
    }

    function renderBlogPost(postId) {
        const post = BLOG_POSTS[postId];
        if (!post) {
            renderAllBlogsList();
            return;
        }

        const contentArea = document.getElementById('blog-content');
        contentArea.innerHTML = `
            <a href="./blogs.html" class="back-to-blog">← Back to All Posts</a>

            <article class="blog-post-view">
                <div class="blog-post-header">
                    <span class="blog-post-category">${getCategoryLabel(post.category)}</span>
                    <h1 class="blog-post-title">${post.title}</h1>
                    <div class="blog-post-meta">
                        <div class="blog-post-meta-item">📅 ${post.date}</div>
                        <div class="blog-post-meta-item">⏱️ ${post.readTime}</div>
                        <div class="blog-post-meta-item">✍️ By ${post.author}</div>
                    </div>
                </div>

                <div class="blog-post-body">
                    ${post.body}
                </div>

                <div class="blog-post-footer">
                    <div class="blog-post-actions">
                        <button class="btn btn-primary" onclick="sharePost('${postId}')">
                            <span class="btn-icon-left">🚀</span>
                            Share This Post
                        </button>
                        <button class="btn btn-secondary" onclick="startStudying()">
                            <span class="btn-icon-left">📚</span>
                            Start Studying
                        </button>
                    </div>

                    <div class="blog-post-navigation">
                        ${getPreviousPost(postId) ? `
                            <a href="./blogs.html?post=${getPreviousPost(postId)}" class="blog-nav-item">
                                <div class="blog-nav-label">← Previous</div>
                                <div class="blog-nav-title">${BLOG_POSTS[getPreviousPost(postId)].title}</div>
                            </a>
                        ` : `<div class="blog-nav-item disabled"><div class="blog-nav-label">← Previous</div><div class="blog-nav-title">No Previous Post</div></div>`}

                        ${getNextPost(postId) ? `
                            <a href="./blogs.html?post=${getNextPost(postId)}" class="blog-nav-item">
                                <div class="blog-nav-label">Next →</div>
                                <div class="blog-nav-title">${BLOG_POSTS[getNextPost(postId)].title}</div>
                            </a>
                        ` : `<div class="blog-nav-item disabled"><div class="blog-nav-label">Next →</div><div class="blog-nav-title">No Next Post</div></div>`}
                    </div>
                </div>
            </article>
        `;
    }

    function renderAllBlogsList() {
        const contentArea = document.getElementById('blog-content');
        
        const postsHtml = Object.values(BLOG_POSTS).map(post => `
            <article class="blog-list-item" onclick="window.location.href='./blogs.html?post=${post.id}'">
                <div class="blog-list-item-thumbnail">${post.emoji}</div>
                <div class="blog-list-item-content">
                    <h3 class="blog-list-item-title">${post.title}</h3>
                    <p class="blog-list-item-excerpt">${post.excerpt}</p>
                    <div class="blog-list-item-meta">
                        <div class="blog-list-item-meta-item">📅 ${post.date}</div>
                        <div class="blog-list-item-meta-item">⏱️ ${post.readTime}</div>
                        <span class="blog-list-item-category">${getCategoryLabel(post.category)}</span>
                    </div>
                </div>
            </article>
        `).join('');

        contentArea.innerHTML = `
            <div class="blog-list-view">
                ${postsHtml}
            </div>
        `;
    }

    function getCategoryLabel(category) {
        const labels = {
            'study-technique': '📚 Study Technique',
            'time-management': '⏱️ Time Management',
            'wellness': '😴 Wellness & Rest'
        };
        return labels[category] || category;
    }

    function getPreviousPost(currentId) {
        const postIds = Object.keys(BLOG_POSTS);
        const currentIndex = postIds.indexOf(currentId);
        return currentIndex > 0 ? postIds[currentIndex - 1] : null;
    }

    function getNextPost(currentId) {
        const postIds = Object.keys(BLOG_POSTS);
        const currentIndex = postIds.indexOf(currentId);
        return currentIndex < postIds.length - 1 ? postIds[currentIndex + 1] : null;
    }

    function filterByCategory(category) {
        const filteredPosts = Object.values(BLOG_POSTS).filter(post => post.category === category);
        const contentArea = document.getElementById('blog-content');

        const postsHtml = filteredPosts.map(post => `
            <article class="blog-list-item" onclick="window.location.href='./blogs.html?post=${post.id}'">
                <div class="blog-list-item-thumbnail">${post.emoji}</div>
                <div class="blog-list-item-content">
                    <h3 class="blog-list-item-title">${post.title}</h3>
                    <p class="blog-list-item-excerpt">${post.excerpt}</p>
                    <div class="blog-list-item-meta">
                        <div class="blog-list-item-meta-item">📅 ${post.date}</div>
                        <div class="blog-list-item-meta-item">⏱️ ${post.readTime}</div>
                    </div>
                </div>
            </article>
        `).join('');

        contentArea.innerHTML = `
            <div class="blog-list-view">
                ${postsHtml}
            </div>
        `;
    }

    function sharePost(postId) {
        const post = BLOG_POSTS[postId];
        const url = `${window.location.origin}${window.location.pathname}?post=${postId}`;
        const text = `Check out this study tip: "${post.title}" - ${url}`;

        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: url
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text);
            alert('Link copied to clipboard!');
        }
    }

    function startStudying() {
        window.location.href = './index.html#input-section';
    }

    function setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';

        themeToggle.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('crambot-theme', newTheme);
            updateThemeIcon(newTheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('crambot-theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        }
    }

})();
