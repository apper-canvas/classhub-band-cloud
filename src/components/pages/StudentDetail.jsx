import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import PerformanceChart from '@/components/organisms/PerformanceChart'
import { studentService } from '@/services/api/studentService'
import { gradeService } from '@/services/api/gradeService'
import { attendanceService } from '@/services/api/attendanceService'

const StudentDetail = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadStudentData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [studentData, gradesData, attendanceData] = await Promise.all([
        studentService.getById(parseInt(id)),
        gradeService.getAll(),
        attendanceService.getAll()
      ])
      
      setStudent(studentData)
      setGrades(gradesData.filter(grade => grade.studentId === id))
      setAttendance(attendanceData.filter(att => att.studentId === id))
    } catch (err) {
      setError(err.message || 'Failed to load student data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadStudentData()
  }, [id])
  
  const calculateGradeStats = () => {
    if (grades.length === 0) return { average: 0, total: 0, byCategory: {} }
    
    const total = grades.length
    const totalPercentage = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0)
    const average = totalPercentage / total
    
    const byCategory = grades.reduce((acc, grade) => {
      if (!acc[grade.category]) {
        acc[grade.category] = { grades: [], average: 0 }
      }
      acc[grade.category].grades.push(grade)
      return acc
    }, {})
    
    Object.keys(byCategory).forEach(category => {
      const categoryGrades = byCategory[category].grades
      const categoryTotal = categoryGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0)
      byCategory[category].average = categoryTotal / categoryGrades.length
    })
    
    return { average, total, byCategory }
  }
  
  const calculateAttendanceStats = () => {
    if (attendance.length === 0) return { rate: 0, total: 0, present: 0, absent: 0, late: 0, excused: 0 }
    
    const total = attendance.length
    const present = attendance.filter(att => att.status === 'present').length
    const absent = attendance.filter(att => att.status === 'absent').length
    const late = attendance.filter(att => att.status === 'late').length
    const excused = attendance.filter(att => att.status === 'excused').length
    const rate = (present / total) * 100
    
    return { rate, total, present, absent, late, excused }
  }
  
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'excellent'
    if (percentage >= 80) return 'good'
    if (percentage >= 70) return 'satisfactory'
    return 'needs-improvement'
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadStudentData} />
  }
  
  if (!student) {
    return <Error message="Student not found" showRetry={false} />
  }
  
  const gradeStats = calculateGradeStats()
  const attendanceStats = calculateAttendanceStats()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/students">
            <Button variant="ghost" size="small" icon="ArrowLeft">
              Back to Students
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold gradient-text">{student.name}</h1>
            <p className="text-slate-600">Student ID: {student.Id} • {student.gradeLevel}</p>
          </div>
        </div>
        
        <Badge variant={student.status === 'active' ? 'success' : 'danger'}>
          {student.status}
        </Badge>
      </div>
{/* Student Info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <p className="text-slate-900">{student.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                <p className="text-slate-900">{student.gradeLevel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <p className="text-slate-900">{student.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <p className="text-slate-900">{student.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Enrollment Date</label>
                <p className="text-slate-900">
                  {student.enrollmentDate ? format(new Date(student.enrollmentDate), 'MMMM d, yyyy') : 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <Badge variant={student.status === 'active' ? 'success' : 'danger'}>
                  {student.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {student.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Parent Contact */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Parent Contact</h2>
          <ApperIcon name="Users" className="w-6 h-6 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Name</label>
            <p className="text-slate-900">{student.parentName || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            {student.parentEmail ? (
              <a 
                href={`mailto:${student.parentEmail}`}
                className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors duration-200 flex items-center gap-1"
              >
                <ApperIcon name="Mail" className="w-4 h-4" />
                {student.parentEmail}
              </a>
            ) : (
              <p className="text-slate-500">Not specified</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            {student.parentPhone ? (
              <a 
                href={`tel:${student.parentPhone}`}
                className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors duration-200 flex items-center gap-1"
              >
                <ApperIcon name="Phone" className="w-4 h-4" />
                {student.parentPhone}
              </a>
            ) : (
              <p className="text-slate-500">Not specified</p>
            )}
          </div>
        </div>
      </Card>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {gradeStats.average.toFixed(1)}%
          </div>
          <div className="text-slate-600 mb-1">Average Grade</div>
          <div className="text-sm text-slate-500">
            {gradeStats.total} assignments
          </div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {attendanceStats.rate.toFixed(1)}%
          </div>
          <div className="text-slate-600 mb-1">Attendance Rate</div>
          <div className="text-sm text-slate-500">
            {attendanceStats.present} of {attendanceStats.total} days
          </div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {attendanceStats.absent}
          </div>
          <div className="text-slate-600 mb-1">Absences</div>
          <div className="text-sm text-slate-500">
            {attendanceStats.late} late arrivals
          </div>
</Card>
      </div>
      
      {/* Performance Chart */}
      <PerformanceChart grades={grades} loading={loading} />
      
      {/* Grades and Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Grades</h2>
            <Link to="/grades">
              <Button variant="ghost" size="small" icon="Plus">
                Add Grade
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {grades.length > 0 ? (
              grades
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((grade, index) => (
                  <motion.div
                    key={grade.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{grade.assignmentName}</div>
                      <div className="text-sm text-slate-500">
                        {grade.category} • {format(new Date(grade.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {grade.score}/{grade.maxScore}
                      </div>
                      <Badge variant={getGradeColor((grade.score / grade.maxScore) * 100)}>
                        {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </motion.div>
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="BookOpen" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No grades recorded</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Recent Attendance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Attendance</h2>
            <Link to="/attendance">
              <Button variant="ghost" size="small" icon="Calendar">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {attendance.length > 0 ? (
              attendance
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((record, index) => (
                  <motion.div
                    key={record.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900">
                        {format(new Date(record.date), 'EEEE, MMM d, yyyy')}
                      </div>
                      {record.reason && (
                        <div className="text-sm text-slate-500">{record.reason}</div>
                      )}
                    </div>
                    <Badge variant={record.status}>
                      {record.status}
                    </Badge>
                  </motion.div>
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No attendance records</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StudentDetail