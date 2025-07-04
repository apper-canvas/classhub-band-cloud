import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import StatusToggle from '@/components/molecules/StatusToggle'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const AttendanceGrid = ({ 
  students = [], 
  attendance = [], 
  selectedDate,
  onDateChange,
  onStatusChange,
  onBulkUpdate,
  loading = false 
}) => {
  const [bulkStatus, setBulkStatus] = useState('present')
  
  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(att => 
      att.studentId === studentId && 
      format(new Date(att.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    )
    return record?.status || 'present'
  }
  
  const getStatusCounts = () => {
    const counts = { present: 0, absent: 0, late: 0, excused: 0 }
    students.forEach(student => {
      const status = getAttendanceStatus(student.Id)
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }
  
  const statusCounts = getStatusCounts()
  const totalStudents = students.length
  
  const handleBulkUpdate = () => {
    const updates = students.map(student => ({
      studentId: student.Id,
      status: bulkStatus,
      date: selectedDate
    }))
    onBulkUpdate(updates)
  }
  
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Date Selector and Summary */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Daily Attendance</h2>
            <p className="text-slate-600 mt-1">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')} • {totalStudents} students
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              className="input-premium"
            />
            
            <div className="flex items-center space-x-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="input-premium"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
              <Button
                variant="secondary"
                size="small"
                onClick={handleBulkUpdate}
                icon="Users"
              >
                Mark All
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{statusCounts.present}</div>
            <div className="text-sm text-slate-600">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{statusCounts.absent}</div>
            <div className="text-sm text-slate-600">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{statusCounts.late}</div>
            <div className="text-sm text-slate-600">Late</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info">{statusCounts.excused}</div>
            <div className="text-sm text-slate-600">Excused</div>
          </div>
        </div>
      </Card>
      
      {/* Attendance Grid */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student, index) => (
            <motion.div
              key={student.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium">
                    {student.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{student.name}</div>
                    <div className="text-sm text-slate-500">{student.gradeLevel}</div>
                  </div>
                </div>
                
                <Badge variant={getAttendanceStatus(student.Id)}>
                  {getAttendanceStatus(student.Id)}
                </Badge>
              </div>
              
              <StatusToggle
                status={getAttendanceStatus(student.Id)}
                onStatusChange={(status) => onStatusChange(student.Id, status)}
                studentName={student.name}
              />
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default AttendanceGrid