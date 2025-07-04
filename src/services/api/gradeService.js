import mockGrades from '@/services/mockData/grades.json'

class GradeService {
  constructor() {
    this.grades = [...mockGrades]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.grades]
  }
  
  async getById(id) {
    await this.delay(200)
    const grade = this.grades.find(g => g.Id === id)
    if (!grade) {
      throw new Error('Grade not found')
    }
    return { ...grade }
  }
  
  async create(gradeData) {
    await this.delay(400)
    
    const newGrade = {
      ...gradeData,
      Id: this.getNextId(),
      date: gradeData.date || new Date().toISOString()
    }
    
    this.grades.push(newGrade)
    return { ...newGrade }
  }
  
  async update(id, gradeData) {
    await this.delay(400)
    
    const index = this.grades.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Grade not found')
    }
    
    const updatedGrade = {
      ...this.grades[index],
      ...gradeData,
      Id: id
    }
    
    this.grades[index] = updatedGrade
    return { ...updatedGrade }
  }
  
  async delete(id) {
    await this.delay(300)
    
    const index = this.grades.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Grade not found')
    }
    
    this.grades.splice(index, 1)
    return true
  }
  
  getNextId() {
    const maxId = this.grades.reduce((max, grade) => 
      grade.Id > max ? grade.Id : max, 0
    )
    return maxId + 1
}
  
  async getPerformanceData(studentId) {
    await this.delay(200)
    
    const studentGrades = this.grades.filter(g => g.studentId === studentId.toString())
    
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
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const gradeService = new GradeService()