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

    // Upcoming Deadlines - Pobieramy zadania z kursów, na które zapisany jest student
    const studentAssignments = await fetchData(`http://localhost:8080/api/assignments/student/${currentUserId}`);
    let upcomingDeadlines = [];
    if (studentAssignments) {
        const now = new Date();
        upcomingDeadlines = studentAssignments
            .filter(assignment => new Date(assignment.dueDate) > now)
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
            id: notification.id,
            icon: notification.isRead ? 'fas fa-check-circle' : 'fas fa-info-circle',
            title: notification.content,
            time: new Date(notification.timestamp || Date.now()).toLocaleTimeString(),
            isRead: notification.isRead
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
        
        if (activities.length === 0) {
            activityList.innerHTML = '<div class="no-activity">No recent activity</div>';
            return;
        }
        
        activities.forEach(activity => {
            const activityItem = `
                <div class="activity-item ${activity.isRead ? 'read' : 'unread'}" data-notification-id="${activity.id}">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                    ${!activity.isRead ? '<div class="unread-indicator"></div>' : ''}
                </div>
            `;
            activityList.innerHTML += activityItem;
        });

        // Add click event listeners
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', async function() {
                const notificationId = this.dataset.notificationId;
                const isRead = this.classList.contains('read');
                
                if (!isRead) {
                    try {
                        // Mark as read
                        const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (response.ok) {
                            // Update UI
                            this.classList.remove('unread');
                            this.classList.add('read');
                            this.querySelector('.activity-icon i').className = 'fas fa-check-circle';
                            this.querySelector('.unread-indicator')?.remove();
                            
                            // Update pending tasks count (decrease by 1)
                            const currentCount = parseInt(document.getElementById('assignments-count').textContent);
                            document.getElementById('assignments-count').textContent = Math.max(0, currentCount - 1);
                        }
                    } catch (error) {
                        console.error('Error marking notification as read:', error);
                    }
                }
            });
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