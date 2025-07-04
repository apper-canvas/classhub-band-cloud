import { format } from 'date-fns'
import jsPDF from 'jspdf'

class ExportService {
  async generateGradeReport(grades, students, format = 'pdf') {
    await this.delay(1000)
    
    const reportData = this.prepareGradeData(grades, students)
    
    if (format === 'pdf') {
      return this.exportToPDF(reportData, 'Grade Report')
    } else if (format === 'csv') {
      return this.exportToCSV(reportData.rows, reportData.headers, 'grades_report')
    }
    
    throw new Error('Unsupported export format')
  }
  
  async generateAttendanceReport(attendance, students, format = 'pdf') {
    await this.delay(1000)
    
    const reportData = this.prepareAttendanceData(attendance, students)
    
    if (format === 'pdf') {
      return this.exportToPDF(reportData, 'Attendance Report')
    } else if (format === 'csv') {
      return this.exportToCSV(reportData.rows, reportData.headers, 'attendance_report')
    }
    
    throw new Error('Unsupported export format')
  }
  
  prepareGradeData(grades, students) {
    const headers = ['Student Name', 'Assignment', 'Category', 'Score', 'Max Score', 'Percentage', 'Grade', 'Date']
    
    const rows = grades.map(grade => {
      const student = students.find(s => s.Id === parseInt(grade.studentId))
      const percentage = (grade.score / grade.maxScore) * 100
      const gradeLevel = this.getGradeLevel(percentage)
      
      return [
        student?.name || 'Unknown Student',
        grade.assignmentName,
        grade.category,
        grade.score.toString(),
        grade.maxScore.toString(),
        `${percentage.toFixed(1)}%`,
        gradeLevel,
        format(new Date(grade.date), 'MMM d, yyyy')
      ]
    })
    
    // Add summary statistics
    const totalGrades = grades.length
    const averageScore = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / totalGrades
    const excellentCount = grades.filter(grade => (grade.score / grade.maxScore) * 100 >= 90).length
    const needsImprovementCount = grades.filter(grade => (grade.score / grade.maxScore) * 100 < 70).length
    
    return {
      headers,
      rows,
      summary: {
        totalGrades,
        averageScore: averageScore.toFixed(1),
        excellentCount,
        needsImprovementCount
      },
      title: 'Grade Report'
    }
  }
  
  prepareAttendanceData(attendance, students) {
    const headers = ['Student Name', 'Date', 'Status', 'Reason']
    
    const rows = attendance.map(record => {
      const student = students.find(s => s.Id === parseInt(record.studentId))
      
      return [
        student?.name || 'Unknown Student',
        format(new Date(record.date), 'MMM d, yyyy'),
        record.status.charAt(0).toUpperCase() + record.status.slice(1),
        record.reason || '-'
      ]
    })
    
    // Add summary statistics
    const totalRecords = attendance.length
    const presentCount = attendance.filter(record => record.status === 'present').length
    const absentCount = attendance.filter(record => record.status === 'absent').length
    const lateCount = attendance.filter(record => record.status === 'late').length
    const excusedCount = attendance.filter(record => record.status === 'excused').length
    const attendanceRate = totalRecords > 0 ? ((presentCount + lateCount) / totalRecords * 100).toFixed(1) : '0'
    
    return {
      headers,
      rows,
      summary: {
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendanceRate
      },
      title: 'Attendance Report'
    }
  }
  
  exportToPDF(data, title) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let currentY = 20
    
    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(title, pageWidth / 2, currentY, { align: 'center' })
    currentY += 15
    
    // Generated date
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${format(new Date(), 'MMM d, yyyy h:mm a')}`, pageWidth / 2, currentY, { align: 'center' })
    currentY += 20
    
    // Summary section
    if (data.summary) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Summary', 20, currentY)
      currentY += 10
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      if (data.title === 'Grade Report') {
        doc.text(`Total Grades: ${data.summary.totalGrades}`, 20, currentY)
        currentY += 6
        doc.text(`Average Score: ${data.summary.averageScore}%`, 20, currentY)
        currentY += 6
        doc.text(`Excellent (90%+): ${data.summary.excellentCount}`, 20, currentY)
        currentY += 6
        doc.text(`Needs Improvement (<70%): ${data.summary.needsImprovementCount}`, 20, currentY)
        currentY += 15
      } else {
        doc.text(`Total Records: ${data.summary.totalRecords}`, 20, currentY)
        currentY += 6
        doc.text(`Present: ${data.summary.presentCount}`, 20, currentY)
        currentY += 6
        doc.text(`Absent: ${data.summary.absentCount}`, 20, currentY)
        currentY += 6
        doc.text(`Late: ${data.summary.lateCount}`, 20, currentY)
        currentY += 6
        doc.text(`Excused: ${data.summary.excusedCount}`, 20, currentY)
        currentY += 6
        doc.text(`Attendance Rate: ${data.summary.attendanceRate}%`, 20, currentY)
        currentY += 15
      }
    }
    
    // Table header
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Detailed Records', 20, currentY)
    currentY += 10
    
    // Simple table implementation
    const cellWidth = (pageWidth - 40) / data.headers.length
    const cellHeight = 8
    
    // Header row
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    data.headers.forEach((header, index) => {
      const x = 20 + (index * cellWidth)
      doc.rect(x, currentY, cellWidth, cellHeight)
      doc.text(header, x + 2, currentY + 5)
    })
    currentY += cellHeight
    
    // Data rows
    doc.setFont('helvetica', 'normal')
    data.rows.forEach((row, rowIndex) => {
      if (currentY + cellHeight > pageHeight - 20) {
        doc.addPage()
        currentY = 20
      }
      
      row.forEach((cell, colIndex) => {
        const x = 20 + (colIndex * cellWidth)
        doc.rect(x, currentY, cellWidth, cellHeight)
        const cellText = cell.toString()
        const truncatedText = cellText.length > 12 ? cellText.substring(0, 12) + '...' : cellText
        doc.text(truncatedText, x + 2, currentY + 5)
      })
      currentY += cellHeight
    })
    
    // Download the PDF
    const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
    doc.save(fileName)
    
    return fileName
  }
  
  exportToCSV(rows, headers, filename) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const fileName = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    return fileName
  }
  
  getGradeLevel(percentage) {
    if (percentage >= 90) return 'Excellent'
    if (percentage >= 80) return 'Good'
    if (percentage >= 70) return 'Satisfactory'
    return 'Needs Improvement'
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const exportService = new ExportService()