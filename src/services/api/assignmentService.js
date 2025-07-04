import { gradeService } from './gradeService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const assignmentService = {
  async getAll() {
    try {
      await delay(200)
      const grades = await gradeService.getAll()
      
      // Transform grades into assignment format
      const assignments = grades.map(grade => ({
        Id: grade.Id,
        name: grade.assignmentName,
        dueDate: grade.date,
        category: grade.category,
        studentId: grade.studentId,
        score: grade.score,
        maxScore: grade.maxScore
      }))
      
      return [...assignments]
    } catch (error) {
      throw new Error('Failed to fetch assignments')
    }
  },
  
  async getById(id) {
    try {
      await delay(200)
      const assignments = await this.getAll()
      const assignment = assignments.find(a => a.Id === parseInt(id))
      
      if (!assignment) {
        throw new Error('Assignment not found')
      }
      
      return { ...assignment }
    } catch (error) {
      throw new Error('Failed to fetch assignment')
    }
  },
  
  async getByDateRange(startDate, endDate) {
    try {
      await delay(200)
      const assignments = await this.getAll()
      
      const filtered = assignments.filter(assignment => {
        const assignmentDate = new Date(assignment.dueDate)
        return assignmentDate >= new Date(startDate) && assignmentDate <= new Date(endDate)
      })
      
      return [...filtered]
    } catch (error) {
      throw new Error('Failed to fetch assignments for date range')
    }
  },
  
  async getUpcoming(days = 7) {
    try {
      await delay(200)
      const assignments = await this.getAll()
      const now = new Date()
      const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))
      
      const upcoming = assignments.filter(assignment => {
        const assignmentDate = new Date(assignment.dueDate)
        return assignmentDate >= now && assignmentDate <= futureDate
      })
      
      return [...upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))]
    } catch (error) {
      throw new Error('Failed to fetch upcoming assignments')
    }
  }
}