import mockStudents from '@/services/mockData/students.json'

class StudentService {
  constructor() {
    this.students = [...mockStudents]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.students]
  }
  
  async getById(id) {
    await this.delay(200)
    const student = this.students.find(s => s.Id === id)
    if (!student) {
      throw new Error('Student not found')
    }
    return { ...student }
  }
  
  async create(studentData) {
    await this.delay(400)
    
    const newStudent = {
      ...studentData,
      Id: this.getNextId(),
      enrollmentDate: new Date().toISOString(),
      status: studentData.status || 'active'
    }
    
    this.students.push(newStudent)
    return { ...newStudent }
  }
  
  async update(id, studentData) {
    await this.delay(400)
    
    const index = this.students.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error('Student not found')
    }
    
    const updatedStudent = {
      ...this.students[index],
      ...studentData,
      Id: id
    }
    
    this.students[index] = updatedStudent
    return { ...updatedStudent }
  }
  
  async delete(id) {
    await this.delay(300)
    
    const index = this.students.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error('Student not found')
    }
    
    this.students.splice(index, 1)
    return true
  }
  
  getNextId() {
    const maxId = this.students.reduce((max, student) => 
      student.Id > max ? student.Id : max, 0
    )
    return maxId + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const studentService = new StudentService()