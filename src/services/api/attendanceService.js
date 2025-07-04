import mockAttendance from '@/services/mockData/attendance.json'

class AttendanceService {
  constructor() {
    this.attendance = [...mockAttendance]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.attendance]
  }
  
  async getById(id) {
    await this.delay(200)
    const record = this.attendance.find(a => a.Id === id)
    if (!record) {
      throw new Error('Attendance record not found')
    }
    return { ...record }
  }
  
  async create(attendanceData) {
    await this.delay(400)
    
    const newRecord = {
      ...attendanceData,
      Id: this.getNextId(),
      date: attendanceData.date || new Date().toISOString()
    }
    
    this.attendance.push(newRecord)
    return { ...newRecord }
  }
  
  async update(id, attendanceData) {
    await this.delay(400)
    
    const index = this.attendance.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    
    const updatedRecord = {
      ...this.attendance[index],
      ...attendanceData,
      Id: id
    }
    
    this.attendance[index] = updatedRecord
    return { ...updatedRecord }
  }
  
  async delete(id) {
    await this.delay(300)
    
    const index = this.attendance.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    
    this.attendance.splice(index, 1)
    return true
  }
  
  getNextId() {
    const maxId = this.attendance.reduce((max, record) => 
      record.Id > max ? record.Id : max, 0
    )
    return maxId + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const attendanceService = new AttendanceService()