document.addEventListener('DOMContentLoaded', async () => {
    // Function to set the current date
    function setCurrentDate() {
        const dateElement = document.getElementById('current-date');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString(undefined, options);
        if (dateElement) {
            dateElement.textContent = today;
        }
    }

    // Generic fetch function
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // Retrieve user data from localStorage
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let currentUserId = null;
    let currentUserName = 'User'; // Default name

    if (currentUser && currentUser.id && currentUser.name) {
        currentUserId = currentUser.id;
        currentUserName = currentUser.name;

        // Update welcome message and user name in navbar
        if (document.getElementById('welcome-name')) {
            document.getElementById('welcome-name').textContent = currentUserName;
        }
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUserName;
        }
    } else {
        console.warn('User data not found in localStorage. Redirecting to login.');
        window.location.href = 'pages/login.html'; // Redirect if no user data
        return; // Stop execution if no user data
    }


    // Quick Stats - will need more specific endpoints or logic
    // For now, let's make some assumptions or simplified calls based on available endpoints.
    // Active Courses - Difficult without a specific endpoint for student enrolled courses.
    // Assuming for now, we'll fetch all courses and count. This is a simplification.
    const allCourses = await fetchData(`http://localhost:8080/api/courses`);
    let activeCoursesCount = allCourses ? allCourses.length : 0; // Simplified, assuming all are active for demo

    // Pending Tasks - Count submissions with null grades for the current user
    const studentSubmissions = await fetchData(`http://localhost:8080/api/submissions/student/${currentUserId}`);
    let pendingTasksCount = 0;
    if (studentSubmissions) {
        pendingTasksCount = studentSubmissions.filter(s => s.grade === null).length;
    }

    // Upcoming Deadlines - This requires filtering assignments.
    // Need to fetch assignments for courses the student is enrolled in.
    // This is still complex without a direct endpoint for student's assignments.
    // For now, I'll simplify: fetch all assignments and check if their due date is in the future.
    // This is a *temporary simplification* as it doesn't filter by student enrollment.
    const allAssignments = await fetchData(`http://localhost:8080/api/assignments/course/101`); // Using a placeholder courseId
    let upcomingDeadlines = [];
    if (allAssignments) {
        const now = new Date();
        upcomingDeadlines = allAssignments.filter(assignment => new Date(assignment.dueDate) > now)
                                        .map(assignment => ({
                                            title: assignment.title,
                                            date: new Date(assignment.dueDate).toLocaleDateString()
                                        }));
    }


    populateQuickStats({
        activeCourses: activeCoursesCount,
        pendingTasks: pendingTasksCount,
        upcomingDeadlines: upcomingDeadlines.length
    });


    // Recent Activity - Fetch notifications for the current user
    const notifications = await fetchData(`http://localhost:8080/api/notifications/user/${currentUserId}`);
    let recentActivityData = [];
    if (notifications) {
        recentActivityData = notifications.map(notification => ({
            icon: 'fas fa-info-circle', // Generic icon, could be dynamic
            title: notification.message,
            time: new Date(notification.timestamp || Date.now()).toLocaleTimeString() // Assuming timestamp field exists
        }));
    }
    populateRecentActivity(recentActivityData);


    // Upcoming Deadlines - Re-use the upcomingDeadlines fetched earlier
    populateUpcomingDeadlines(upcomingDeadlines);


    // Course Progress - This needs a more sophisticated backend endpoint or complex frontend logic.
    // For now, I'll use placeholder data or very simplified logic.
    // To get real progress, we'd need to know which courses a student is enrolled in,
    // and then calculate progress based on completed assignments/quizzes for that course.
    // Since there's no direct endpoint like /api/students/{id}/courses or /api/students/{id}/progress,
    // I will use a simplified approach by showing progress for *some* courses that are likely.
    let courseProgressData = [];
    if (allCourses) { // Re-using allCourses, but this is a simplification
        // Example: Assume Jan is in the first few courses and has some arbitrary progress
        const janCourses = allCourses.slice(0, 3); // Arbitrarily pick first 3 courses
        courseProgressData = janCourses.map((course, index) => ({
            title: course.title,
            percentage: (index + 1) * 20 + 10 // Arbitrary increasing percentage
        }));
    }
    populateCourseProgress(courseProgressData);


    setCurrentDate();

    // Function to populate quick stats
    function populateQuickStats(stats) {
        document.getElementById('courses-count').textContent = stats.activeCourses;
        document.getElementById('assignments-count').textContent = stats.pendingTasks;
        document.getElementById('upcoming-count').textContent = stats.upcomingDeadlines;
    }

    // Function to populate recent activity
    function populateRecentActivity(activities) {
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = ''; // Clear existing content
        activities.forEach(activity => {
            const activityItem = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `;
            activityList.innerHTML += activityItem;
        });
    }

    // Function to populate upcoming deadlines
    function populateUpcomingDeadlines(deadlines) {
        const deadlinesList = document.getElementById('deadlines-list');
        deadlinesList.innerHTML = ''; // Clear existing content
        deadlines.forEach(deadline => {
            const deadlineItem = `
                <div class="deadline-item">
                    <div class="deadline-content">
                        <div class="deadline-title">${deadline.title}</div>
                        <div class="deadline-date">Due: ${deadline.date}</div>
                    </div>
                </div>
            `;
            deadlinesList.innerHTML += deadlineItem;
        });
    }

    // Function to populate course progress
    function populateCourseProgress(progressData) {
        const progressList = document.getElementById('progress-list');
        progressList.innerHTML = ''; // Clear existing content
        progressData.forEach(course => {
            const progressItem = `
                <div class="progress-item">
                    <div class="progress-header">
                        <div class="progress-title">${course.title}</div>
                        <div class="progress-percentage">${course.percentage}%</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${course.percentage}%"></div>
                    </div>
                </div>
            `;
            progressList.innerHTML += progressItem;
        });
    }

}); 