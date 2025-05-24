"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUser,
  FaChartBar,
  FaBook,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaBars,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaGlobe,
  FaEdit,
  FaKey,
  FaSignOutAlt,
  FaSearch,
  FaHome,
  FaGraduationCap,
  FaClipboardList,
  FaChalkboardTeacher,
  FaFileAlt,
  FaUsers,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import {
  fetchDoctorProfile,
  fetchCourses,
  fetchSchedule,
  fetchAttendanceStats,
  fetchStudentsList,
  fetchGradeDistribution,
} from "./services/doctorService"
import "./dashboard.css"

function DoctorDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("english")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedDay, setSelectedDay] = useState("All")
  const profileDropdownRef = useRef(null)

  // Doctor data states
  const [doctor, setDoctor] = useState({})
  const [courses, setCourses] = useState([])
  const [schedule, setSchedule] = useState([])
  const [attendanceStats, setAttendanceStats] = useState({})
  const [students, setStudents] = useState([])
  const [gradeDistribution, setGradeDistribution] = useState({})
  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await fetchDoctorProfile()
        const coursesData = await fetchCourses()
        const scheduleData = await fetchSchedule()
        const attendanceData = await fetchAttendanceStats()
        const studentsData = await fetchStudentsList()

        setDoctor(profile)
        setCourses(coursesData)
        setSchedule(scheduleData)
        setAttendanceStats(attendanceData)
        setStudents(studentsData)
        // Set default selected course
        if (coursesData.length > 0) {
          setSelectedCourse(coursesData[0].courseCode)
        }
      } catch (error) {
        console.error("Error loading doctor data:", error)
      }
    }
    loadData()

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/")
    }
  }

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "arabic" : "english")
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "courses", label: "Courses", icon: <FaBook /> },
    { id: "students", label: "Students", icon: <FaUsers /> },
    { id: "attendance", label: "Attendance", icon: <FaClipboardList /> },
    { id: "schedule", label: "Schedule", icon: <FaCalendarAlt /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ]

  // Get breadcrumb title based on active tab
  const getBreadcrumbTitle = () => {
    const tab = tabs.find((t) => t.id === activeTab)
    return tab ? tab.label : ""
  }

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter schedule based on selected day
  const filteredSchedule = selectedDay === "All" 
    ? schedule 
    : schedule.filter(item => item.day === selectedDay)

  return (
    <div className={`layout ${darkMode ? "dark-mode" : ""} ${language === "arabic" ? "rtl" : "ltr"}`}>
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">🎓 Akhbar El-Youm</h2>
          <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            <FaBars />
          </div>
        </div>

        <div className="sidebar-content">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-icon">{tab.icon}</div>
              {!collapsed && (
                <>
                  <span className="tab-label">{tab.label}</span>
                  {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
            {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </div>
        </div>
      </div>

      <div className="main">
        <header className="header">
          <div className="header-left">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right" ref={profileDropdownRef}>
            <div className="profile-dropdown" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              <div className="profile-info">
                <div className="profile-avatar">{doctor.name?.charAt(0) || "D"}</div>
                <span className="profile-name">{doctor.name}</span>
                <FaChevronDown className="dropdown-icon" />
              </div>

              {profileDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{doctor.name?.charAt(0) || "D"}</div>
                    <div className="dropdown-user-info">
                      <h4>{doctor.name}</h4>
                      <p>{doctor.email}</p>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-item">
                    <FaEdit className="dropdown-item-icon" />
                    <span>Edit Profile</span>
                  </div>

                  <div className="dropdown-item">
                    <FaKey className="dropdown-item-icon" />
                    <span>Change Password</span>
                  </div>

                  <div className="dropdown-item" onClick={toggleLanguage}>
                    <FaGlobe className="dropdown-item-icon" />
                    <span>{language === "english" ? "العربية" : "English"}</span>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-item-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{getBreadcrumbTitle()}</span>
          </div>

          <div className="content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="tab-content"
              >
                {activeTab === "dashboard" && (
                  <div className="dashboard-layout">
                    <div className="dashboard-header">
                      <h1>Welcome back, {doctor.name}</h1>
                      <p className="subtitle">Here's an overview of your teaching activities</p>
                    </div>

                    <div className="dashboard-stats">
                      <div className="stat-card">
                        <div className="stat-icon courses">
                          <FaBook />
                        </div>
                        <div className="stat-info">
                          <h3>Active Courses</h3>
                          <div className="stat-value">{courses.filter(c => c.status === "Active").length}</div>
                          <div className="stat-detail">
                            <span>Total: {courses.length} courses</span>
                          </div>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon attendance">
                          <FaUsers />
                        </div>
                        <div className="stat-info">
                          <h3>Total Students</h3>
                          <div className="stat-value">{students.length}</div>
                          <div className="stat-detail">
                            <span>Across all courses</span>
                          </div>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon gpa">
                          <FaChartBar />
                        </div>
                        <div className="stat-info">
                          <h3>Average Attendance</h3>
                          <div className="stat-value">{attendanceStats.averageAttendance}%</div>
                          <div className="stat-detail">
                            <span>Across all courses</span>
                          </div>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon fingerprint">
                          <FaCalendarAlt />
                        </div>
                        <div className="stat-info">
                          <h3>Today's Classes</h3>
                          <div className="stat-value">
                            {schedule.filter(s => {
                              const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
                              return s.day === today
                            }).length}
                          </div>
                          <div className="stat-detail">
                            <span>Classes scheduled today</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <div className="dashboard-card">
                          <div className="card-header">
                            <h3>Today's Schedule</h3>
                            <button className="view-all-btn" onClick={() => setActiveTab("schedule")}>
                              View All
                            </button>
                          </div>

                          <div className="schedule-list">
                            {(() => {
                              const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
                              const todaySessions = schedule.filter((session) => session.day === today)

                              if (todaySessions.length === 0) {
                                return <p className="no-data">No classes scheduled for today.</p>
                              }

                              return todaySessions.map((session, index) => (
                                <div key={index} className="schedule-item">
                                  <div className="schedule-time">{session.startTime}</div>
                                  <div className="schedule-details">
                                    <h4>{session.courseName}</h4>
                                    <p>
                                      {session.location} • {session.duration}
                                    </p>
                                  </div>
                                </div>
                              ))
                            })()}
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="dashboard-card">
                      <div className="card-header">
                        <h3>Course Attendance Overview</h3>
                        <select 
                          className="course-select"
                          value={selectedCourse || ""}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                          {courses.map(course => (
                            <option key={course.courseCode} value={course.courseCode}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="attendance-chart-container">
                        <div className="attendance-summary">
                          <div className="attendance-metric">
                            <h4>Average Attendance</h4>
                            <div className="metric-value">
                              {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.averageAttendance || 0}%
                            </div>
                          </div>
                          <div className="attendance-metric">
                            <h4>Last Session</h4>
                            <div className="metric-value">
                              {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.lastSessionAttendance || 0}%
                            </div>
                          </div>
                          <div className="attendance-metric">
                            <h4>At Risk Students</h4>
                            <div className="metric-value">
                              {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.atRiskStudents || 0}
                            </div>
                          </div>
                        </div>

                        <div className="attendance-bars">
                          {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.sessions.map((session, index) => (
                            <div key={index} className="attendance-bar-container">
                              <div className="attendance-date">{session.date}</div>
                              <div className="attendance-bar-wrapper">
                                <div 
                                  className="attendance-bar" 
                                  style={{height: `${session.attendancePercentage}%`}}
                                ></div>
                              </div>
                              <div className="attendance-percentage">{session.attendancePercentage}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="profile-layout">
                    <div className="profile-header">
                      <div className="profile-avatar-large">{doctor.name?.charAt(0) || "D"}</div>
                      <div className="profile-header-info">
                        <h1>{doctor.name}</h1>
                        <p>
                          {doctor.title} • {doctor.department}
                        </p>
                      </div>
                      <button className="edit-profile-btn">
                        <FaEdit /> Edit Profile
                      </button>
                    </div>

                    <div className="profile-content">
                      <div className="profile-section">
                        <h3>Personal Information</h3>
                        <div className="profile-info-grid">
                          <div className="profile-info-item">
                            <label>Full Name</label>
                            <p>{doctor.name}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Email Address</label>
                            <p>{doctor.email}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Faculty ID</label>
                            <p>{doctor.id}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Phone Number</label>
                            <p>{doctor.phone || "Not provided"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <h3>Academic Information</h3>
                        <div className="profile-info-grid">
                          <div className="profile-info-item">
                            <label>Department</label>
                            <p>{doctor.department}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Title</label>
                            <p>{doctor.title}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Office</label>
                            <p>{doctor.office}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Office Hours</label>
                            <p>{doctor.officeHours}</p>
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <h3>Teaching Summary</h3>
                        <div className="profile-info-grid">
                          <div className="profile-info-item">
                            <label>Active Courses</label>
                            <p>{courses.filter(c => c.status === "Active").length}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Total Students</label>
                            <p>{students.length}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Teaching Experience</label>
                            <p>{doctor.experience} years</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Research Areas</label>
                            <p>{doctor.researchAreas?.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "courses" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Courses</h1>
                      <p className="subtitle">Manage your courses and teaching materials</p>
                    </div>

                    <div className="data-filters">
                      <div className="filter-group">
                        <select className="filter-select">
                          <option value="all">All Courses</option>
                          <option value="active">Active Courses</option>
                          <option value="completed">Completed Courses</option>
                          <option value="upcoming">Upcoming Courses</option>
                        </select>
                      </div>

                      <button className="action-button">
                        <FaBook /> Add New Course
                      </button>
                    </div>

                    <div className="courses-grid">
                      {filteredCourses.map((course, index) => (
                        <div key={index} className={`course-card ${course.status.toLowerCase()}`}>
                          <div className="course-header">
                            <h3>{course.name}</h3>
                            <span className={`course-status ${course.status.toLowerCase()}`}>
                              {course.status}
                            </span>
                          </div>
                          <div className="course-details">
                            <div className="course-info">
                              <div className="course-info-item">
                                <label>Course Code</label>
                                <p>{course.courseCode}</p>
                              </div>
                              <div className="course-info-item">
                                <label>Credit Hours</label>
                                <p>{course.creditHours}</p>
                              </div>
                              <div className="course-info-item">
                                <label>Students</label>
                                <p>{course.studentsCount}</p>
                              </div>
                              <div className="course-info-item">
                                <label>Average Attendance</label>
                                <p>{course.averageAttendance}%</p>
                              </div>
                            </div>
                          </div>
                          <div className="course-actions">
                            <button className="course-action-btn">View Details</button>
                            <button className="course-action-btn">Attendance</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "students" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Students</h1>
                      <p className="subtitle">View and manage your students</p>
                    </div>

                    <div className="data-filters">
                      <div className="filter-group">
                        <select className="filter-select">
                          <option value="all">All Students</option>
                          {courses.map(course => (
                            <option key={course.courseCode} value={course.courseCode}>
                              {course.name}
                            </option>
                          ))}
                        </select>

                        <select className="filter-select">
                          <option value="all">All Years</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>

                      <button className="action-button">
                        <FaFileAlt /> Export List
                      </button>
                    </div>

                    <div className="data-table-container">
                      {filteredStudents.length === 0 ? (
                        <div className="no-data-message">
                          <p>No students found matching your search criteria.</p>
                        </div>
                      ) : (
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Department</th>
                              <th>Year</th>
                              <th>Attendance</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student, index) => (
                              <tr key={index}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.department}</td>
                                <td>{student.year}</td>
                                <td>
                                  <span className={`status-badge ${student.attendance >= 75 ? "success" : "error"}`}>
                                    {student.attendance}%
                                  </span>
                                </td>
                                <td>
                                  <div className="table-actions">
                                    <button className="table-action-btn">View</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "attendance" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Attendance Management</h1>
                      <p className="subtitle">Track and manage student attendance</p>
                    </div>

                    <div className="data-filters">
                      <div className="filter-group">
                        <select 
                          className="filter-select"
                          value={selectedCourse || ""}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                          <option value="">Select Course</option>
                          {courses.map(course => (
                            <option key={course.courseCode} value={course.courseCode}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="action-buttons">
                        <button className="action-button">
                          <FaClipboardList /> Take Attendance
                        </button>
                        <button className="action-button secondary">
                          <FaFileAlt /> Export Report
                        </button>
                      </div>
                    </div>

                    {selectedCourse ? (
                      <div className="attendance-container">
                        <div className="attendance-overview">
                          <div className="attendance-stat-card">
                            <h3>Average Attendance</h3>
                            <div className="attendance-stat-value">
                              {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.averageAttendance || 0}%
                            </div>
                          </div>
                          <div className="attendance-stat-card">
                            <h3>Last Session</h3>
                            <div className="attendance-stat-value">
                              {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.lastSessionAttendance || 0}%
                            </div>
                          </div>
                          <div className="attendance-stat-card">
                            <h3>At Risk Students</h3>
                            <div className="attendance-stat-value">
                              {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.atRiskStudents || 0}
                            </div>
                          </div>
                        </div>

                        <div className="attendance-sessions">
                          <h3>Attendance Sessions</h3>
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Percentage</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {attendanceStats.courseStats?.find(c => c.courseCode === selectedCourse)?.sessions.map((session, index) => (
                                <tr key={index}>
                                  <td>{session.date}</td>
                                  <td>{session.time}</td>
                                  <td>{session.location}</td>
                                  <td>{session.presentCount}</td>
                                  <td>{session.absentCount}</td>
                                  <td>
                                    <span className={`status-badge ${session.attendancePercentage >= 75 ? "success" : "error"}`}>
                                      {session.attendancePercentage}%
                                    </span>
                                  </td>
                                  <td>
                                    <div className="table-actions">
                                      <button className="table-action-btn">View</button>
                                      <button className="table-action-btn">Edit</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="no-course-selected">
                        <div className="no-data-message">
                          <FaBook className="no-data-icon" />
                          <h3>No Course Selected</h3>
                          <p>Please select a course to view attendance data</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Teaching Schedule</h1>
                      <p className="subtitle">View and manage your teaching schedule</p>
                    </div>

                    <div className="schedule-calendar">
                      <div className="day-selector">
                        <button
                          className={`day-btn ${selectedDay === "All" ? "active" : ""}`}
                          onClick={() => setSelectedDay("All")}
                        >
                          All Days
                        </button>
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`day-btn ${selectedDay === day ? "active" : ""}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>

                      <div className="schedule-content">
                        {filteredSchedule.length === 0 ? (
                          <div className="no-classes">
                            <div className="no-classes-icon">📅</div>
                            <h3>No Classes Scheduled</h3>
                            <p>You have no classes scheduled for {selectedDay === "All" ? "any day" : selectedDay}.</p>
                          </div>
                        ) : (
                          <div className="timeline">
                            {filteredSchedule.map((session, index) => (
                              <div key={index} className="timeline-item">
                                <div className="timeline-day">{session.day}</div>
                                <div className="timeline-time">
                                  <span>{session.startTime}</span>
                                  <span className="timeline-duration">{session.duration}</span>
                                </div>
                                <div className="timeline-content">
                                  <div className="timeline-card">
                                    <h3>{session.courseName}</h3>
                                    <div className="timeline-details">
                                      <span>
                                        <strong>Code:</strong> {session.courseCode}
                                      </span>
                                      <span>
                                        <strong>Location:</strong> {session.location}
                                      </span>
                                      <span>
                                        <strong>Students:</strong> {session.studentsCount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "settings" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Settings</h1>
                      <p className="subtitle">Manage your account preferences</p>
                    </div>

                    <div className="settings-container">
                      <div className="settings-section">
                        <h3>Account Settings</h3>

                        <div className="settings-group">
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Profile Information</h4>
                              <p>Update your personal information</p>
                            </div>
                            <button className="settings-btn">Edit</button>
                          </div>

                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Change Password</h4>
                              <p>Update your password regularly for security</p>
                            </div>
                            <button className="settings-btn">Change</button>
                          </div>

                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Two-Factor Authentication</h4>
                              <p>Add an extra layer of security to your account</p>
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="twoFactor" />
                              <label htmlFor="twoFactor"></label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="settings-section">
                        <h3>Appearance</h3>

                        <div className="settings-group">
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Dark Mode</h4>
                              <p>Switch between light and dark themes</p>
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="darkMode" checked={darkMode} onChange={toggleDarkMode} />
                              <label htmlFor="darkMode"></label>
                            </div>
                          </div>

                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Language</h4>
                              <p>Choose your preferred language</p>
                            </div>
                            <select className="settings-select" value={language} onChange={toggleLanguage}>
                              <option value="english">English</option>
                              <option value="arabic">العربية</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="settings-section">
                        

                        <div className="settings-group">
                          <div className="settings-item">
                            <div className="settings-item-info">
                             
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="emailNotif" defaultChecked />
                              <label htmlFor="emailNotif"></label>
                            </div>
                          </div>

                          <div className="settings-item">
                            <div className="settings-item-info">
                              
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="smsNotif" />
                              <label htmlFor="smsNotif"></label>
                            </div>
                          </div>

                          <div className="settings-item">
                            <div className="settings-item-info">
                             
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="browserNotif" defaultChecked />
                              <label htmlFor="browserNotif"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
