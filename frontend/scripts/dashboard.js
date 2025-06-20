document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('.dashboard-main').hidden = true;

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

    // Active Courses - teraz pobieramy tylko kursy przypisane do studenta
    const studentCourses = await fetchData(`http://localhost:8080/api/courses/student/${currentUserId}`);
    let activeCoursesCount = studentCourses ? studentCourses.length : 0; // Liczba kursów studenta

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


    // Course Progress - fetch real progress from backend
    const courseProgressData = await fetchData(`http://localhost:8080/api/courses/student/${currentUserId}/progress`);
    if (courseProgressData) {
        populateCourseProgress(courseProgressData.map(course => ({
            title: course.courseTitle,
            percentage: course.progress
        })));
    } else {
        populateCourseProgress([]);
    }


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

    document.querySelector('.dashboard-main').hidden = false;
    const activityLoader = document.getElementById('activity-loader');
    if (activityLoader) activityLoader.remove();
    const deadlinesLoader = document.getElementById('deadlines-loader');
    if (deadlinesLoader) deadlinesLoader.remove();
    const progressLoader = document.getElementById('progress-loader');
    if (progressLoader) progressLoader.remove();
}); 