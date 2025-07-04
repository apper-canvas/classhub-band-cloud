import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import StatCard from '@/components/molecules/StatCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import AssignmentCalendar from '@/components/organisms/AssignmentCalendar'
import { studentService } from '@/services/api/studentService'
import { gradeService } from '@/services/api/gradeService'
import { attendanceService } from '@/services/api/attendanceService'

const Dashboard = () => {
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ])
      
      setStudents(studentsData)
      setGrades(gradesData)
      setAttendance(attendanceData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const getDashboardStats = () => {
    const totalStudents = students.length
    
    // Calculate average grade
    const totalGrades = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0)
    const averageGrade = grades.length > 0 ? (totalGrades / grades.length).toFixed(1) : '0'
    
    // Calculate today's attendance
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayAttendance = attendance.filter(att => 
      format(new Date(att.date), 'yyyy-MM-dd') === today
    )
    const presentToday = todayAttendance.filter(att => att.status === 'present').length
    const attendanceRate = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : '0'
    
    // Recent assignments
    const recentAssignments = grades.length
    
    return {
      totalStudents,
      averageGrade,
      attendanceRate,
      presentToday,
      recentAssignments
    }
  }
  
  const getRecentActivity = () => {
    const recentGrades = grades
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(grade => {
        const student = students.find(s => s.Id === parseInt(grade.studentId))
        return {
          ...grade,
          studentName: student?.name || 'Unknown Student',
          percentage: ((grade.score / grade.maxScore) * 100).toFixed(1)
        }
      })
    
    return recentGrades
}
  
  const getUpcomingAssignments = () => {
    return grades.map(grade => ({
      Id: grade.Id,
      name: grade.assignmentName,
      dueDate: grade.date,
      category: grade.category,
      studentName: students.find(s => s.Id === parseInt(grade.studentId))?.name || 'Unknown'
    }))
  }
  
  const getTodayAttendance = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return attendance.filter(att => 
      format(new Date(att.date), 'yyyy-MM-dd') === today
    )
  }
  
  if (loading) {
    return <Loading type="dashboard" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }
  
const stats = getDashboardStats()
  const recentActivity = getRecentActivity()
  const todayAttendance = getTodayAttendance()
  const upcomingAssignments = getUpcomingAssignments()
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Welcome to ClassHub</h1>
        <p className="text-slate-600 text-lg">
          Your complete student management solution • {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
          index={0}
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="BookOpen"
          color="secondary"
          index={1}
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="accent"
          index={2}
        />
        <StatCard
          title="Recent Assignments"
          value={stats.recentAssignments}
          icon="FileText"
          color="success"
          index={3}
        />
      </div>
      
      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/students">
            <Button
              variant="outline"
              className="w-full justify-start"
              icon="UserPlus"
            >
              Add Student
            </Button>
          </Link>
          <Link to="/grades">
            <Button
              variant="outline"
              className="w-full justify-start"
              icon="Plus"
            >
              Add Grade
            </Button>
          </Link>
          <Link to="/attendance">
            <Button
              variant="outline"
              className="w-full justify-start"
              icon="Calendar"
            >
              Take Attendance
            </Button>
          </Link>
          <Link to="/students">
            <Button
              variant="outline"
              className="w-full justify-start"
              icon="Search"
            >
              Find Student
            </Button>
          </Link>
        </div>
      </Card>
      
      {/* Recent Activity and Today's Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Grades</h2>
            <Link to="/grades">
              <Button variant="ghost" size="small" icon="ArrowRight">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((grade, index) => (
                <motion.div
                  key={grade.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                      <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{grade.studentName}</div>
                      <div className="text-sm text-slate-500">{grade.assignmentName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{grade.percentage}%</div>
                    <div className="text-sm text-slate-500">{grade.category}</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="BookOpen" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No recent grades</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Today's Attendance Summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Today's Attendance</h2>
            <Link to="/attendance">
              <Button variant="ghost" size="small" icon="ArrowRight">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {/* Attendance Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-success">{stats.presentToday}</div>
                <div className="text-sm text-slate-600">Present</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{stats.totalStudents - stats.presentToday}</div>
                <div className="text-sm text-slate-600">Absent</div>
              </div>
            </div>
            
            {/* Recent Status Changes */}
            <div className="space-y-2">
              {todayAttendance.length > 0 ? (
                todayAttendance.slice(0, 3).map((record, index) => {
                  const student = students.find(s => s.Id === parseInt(record.studentId))
                  return (
                    <div key={record.Id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="font-medium">{student?.name || 'Unknown'}</span>
                      <Badge variant={record.status}>
                        {record.status}
                      </Badge>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>No attendance taken today</p>
                </div>
              )}
            </div>
          </div>
</Card>
      </div>
      
      {/* Assignment Calendar */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Assignment Calendar</h2>
          <Link to="/grades">
            <Button variant="ghost" size="small" icon="Calendar">
              View All Grades
            </Button>
          </Link>
        </div>
        <AssignmentCalendar assignments={upcomingAssignments} />
      </Card>
    </div>
  )
}

export default Dashboard