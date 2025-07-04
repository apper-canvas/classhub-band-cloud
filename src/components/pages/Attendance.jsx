import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ExportDialog from "@/components/organisms/ExportDialog";
import { exportService } from "@/services/api/exportService";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { attendanceService } from "@/services/api/attendanceService";
import { studentService } from "@/services/api/studentService";

const Attendance = () => {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ])
      
      setStudents(studentsData)
      setAttendance(attendanceData)
    } catch (err) {
      setError(err.message || 'Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleStatusChange = async (studentId, status) => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      
      // Check if attendance record exists for this student and date
      const existingRecord = attendance.find(att => 
        att.studentId === studentId.toString() && 
        format(new Date(att.date), 'yyyy-MM-dd') === dateStr
      )
      
      if (existingRecord) {
        // Update existing record
        const updatedRecord = await attendanceService.update(existingRecord.Id, {
          ...existingRecord,
          status,
          date: selectedDate
        })
        setAttendance(prev => prev.map(att => 
          att.Id === existingRecord.Id ? updatedRecord : att
        ))
      } else {
        // Create new record
        const newRecord = await attendanceService.create({
          studentId: studentId.toString(),
          status,
          date: selectedDate,
          reason: status === 'excused' ? 'Excused absence' : ''
        })
        setAttendance(prev => [...prev, newRecord])
      }
      
      toast.success('Attendance updated successfully')
    } catch (err) {
      toast.error('Failed to update attendance')
    }
  }
  
  const handleBulkUpdate = async (updates) => {
    try {
      const promises = updates.map(async (update) => {
        const dateStr = format(update.date, 'yyyy-MM-dd')
        
        // Check if attendance record exists for this student and date
        const existingRecord = attendance.find(att => 
          att.studentId === update.studentId.toString() && 
          format(new Date(att.date), 'yyyy-MM-dd') === dateStr
        )
        
        if (existingRecord) {
          // Update existing record
          return attendanceService.update(existingRecord.Id, {
            ...existingRecord,
            status: update.status,
            date: update.date
          })
        } else {
          // Create new record
          return attendanceService.create({
            studentId: update.studentId.toString(),
            status: update.status,
            date: update.date,
            reason: update.status === 'excused' ? 'Excused absence' : ''
          })
        }
      })
      
      const results = await Promise.all(promises)
      
      // Update attendance state
      setAttendance(prev => {
        let updated = [...prev]
        
        results.forEach(result => {
          const existingIndex = updated.findIndex(att => att.Id === result.Id)
          if (existingIndex >= 0) {
            updated[existingIndex] = result
          } else {
            updated.push(result)
          }
        })
        
        return updated
      })
      
toast.success('Bulk attendance updated successfully')
    } catch (err) {
      toast.error('Failed to update bulk attendance')
    }
  }
  
  const handleExport = async (format) => {
    try {
      setExportLoading(true)
      await exportService.generateAttendanceReport(attendance, students, format)
      toast.success(`Attendance report exported successfully as ${format.toUpperCase()}`)
      setShowExportDialog(false)
    } catch (error) {
      toast.error('Failed to export attendance report')
    } finally {
      setExportLoading(false)
    }
  }
  
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadData} />
  }
  if (students.length === 0) {
    return (
      <Empty
        type="attendance"
        title="No students found"
        description="You need to add students before taking attendance"
        onAction={() => window.location.href = '/students'}
        actionText="Add Students"
      />
    )
  }
  
  return (
<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Attendance</h1>
          <p className="text-slate-600 mt-1">
            Track daily student attendance and monitor patterns
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowExportDialog(true)}
          icon="Download"
          className="md:w-auto"
        >
          Export
        </Button>
      </div>
      {/* Attendance Grid */}
      <AttendanceGrid
        students={students}
        attendance={attendance}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
onStatusChange={handleStatusChange}
        onBulkUpdate={handleBulkUpdate}
        loading={loading}
      />
      
      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        dataType="Attendance"
        loading={exportLoading}
      />
    </div>
  )
}