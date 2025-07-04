class GradeService {
  constructor() {
    this.apperClient = null
    this.tableName = 'grade'
  }
  
  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
    return this.apperClient
  }
  
  async getAll() {
    try {
      const client = this.getApperClient()
const params = {
        fields: [
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "assignment_name" } },
          { field: { Name: "category" } },
          { field: { Name: "score" } },
          { field: { Name: "max_score" } },
          { field: { Name: "date" } }
        ]
      }
      
      const response = await client.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
// Map database fields to UI format
      const grades = response.data.map(grade => ({
        Id: grade.Id,
        studentId: grade.student_id?.Id?.toString() || grade.student_id?.toString(),
        studentName: grade.student_id?.Name || 'Unknown Student',
        assignmentName: grade.assignment_name,
        category: grade.category,
        score: grade.score,
        maxScore: grade.max_score,
        date: grade.date
      }))
      return grades
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }
  
  async getById(id) {
    try {
      const client = this.getApperClient()
const params = {
        fields: [
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "assignment_name" } },
          { field: { Name: "category" } },
          { field: { Name: "score" } },
          { field: { Name: "max_score" } },
          { field: { Name: "date" } }
        ]
      }
      
      const response = await client.getRecordById(this.tableName, id, params)
      
      if (!response || !response.data) {
        return null
      }
      
// Map database fields to UI format
      const grade = {
        Id: response.data.Id,
        studentId: response.data.student_id?.Id?.toString() || response.data.student_id?.toString(),
        studentName: response.data.student_id?.Name || 'Unknown Student',
        assignmentName: response.data.assignment_name,
        category: response.data.category,
        score: response.data.score,
        maxScore: response.data.max_score,
        date: response.data.date
      }
      return grade
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }
  
  async create(gradeData) {
    try {
      const client = this.getApperClient()
      
// Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          student_id: parseInt(gradeData.studentId),
          student_name: gradeData.studentName,
          assignment_name: gradeData.assignmentName,
          category: gradeData.category,
          score: gradeData.score,
          max_score: gradeData.maxScore,
          date: gradeData.date
        }]
      }
      
      const response = await client.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to create grade')
        }
        
if (successfulRecords.length > 0) {
          const createdGrade = successfulRecords[0].data
          // Map back to UI format
          return {
            Id: createdGrade.Id,
            studentId: createdGrade.student_id?.Id?.toString() || createdGrade.student_id?.toString(),
            studentName: createdGrade.student_id?.Name || 'Unknown Student',
            assignmentName: createdGrade.assignment_name,
            category: createdGrade.category,
            score: createdGrade.score,
            maxScore: createdGrade.max_score,
            date: createdGrade.date
          }
        }
      }
      
      throw new Error('No grade created')
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
  
  async update(id, gradeData) {
    try {
      const client = this.getApperClient()
      
// Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: id,
          student_id: parseInt(gradeData.studentId),
          student_name: gradeData.studentName,
          assignment_name: gradeData.assignmentName,
          category: gradeData.category,
          score: gradeData.score,
          max_score: gradeData.maxScore,
          date: gradeData.date
        }]
      }
      
      const response = await client.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`)
          throw new Error('Failed to update grade')
        }
        
if (successfulUpdates.length > 0) {
          const updatedGrade = successfulUpdates[0].data
          // Map back to UI format
          return {
            Id: updatedGrade.Id,
            studentId: updatedGrade.student_id?.Id?.toString() || updatedGrade.student_id?.toString(),
            studentName: updatedGrade.student_id?.Name || 'Unknown Student',
            assignmentName: updatedGrade.assignment_name,
            category: updatedGrade.category,
            score: updatedGrade.score,
            maxScore: updatedGrade.max_score,
            date: updatedGrade.date
          }
        }
      }
      
      throw new Error('No grade updated')
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
  
  async delete(id) {
    try {
      const client = this.getApperClient()
      const params = {
        RecordIds: [id]
      }
      
      const response = await client.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`)
          throw new Error('Failed to delete grade')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
  
  async getPerformanceData(studentId) {
    try {
      const grades = await this.getAll()
      const studentGrades = grades.filter(g => g.studentId === studentId.toString())
      
      if (studentGrades.length === 0) {
        return { trends: [], averages: {}, totalAssignments: 0 }
      }
      
      // Sort by date
      const sortedGrades = studentGrades.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      // Calculate performance trends
      const trends = sortedGrades.map(grade => ({
        date: grade.date,
        percentage: (grade.score / grade.maxScore) * 100,
        assignmentName: grade.assignmentName,
        category: grade.category
      }))
      
      // Calculate averages by category
      const averages = sortedGrades.reduce((acc, grade) => {
        if (!acc[grade.category]) {
          acc[grade.category] = { total: 0, count: 0, average: 0 }
        }
        acc[grade.category].total += (grade.score / grade.maxScore) * 100
        acc[grade.category].count += 1
        acc[grade.category].average = acc[grade.category].total / acc[grade.category].count
        return acc
      }, {})
      
      return {
        trends: [...trends],
        averages: { ...averages },
        totalAssignments: studentGrades.length
      }
    } catch (error) {
      console.error("Error getting performance data:", error.message)
      return { trends: [], averages: {}, totalAssignments: 0 }
    }
  }
}

export const gradeService = new GradeService()