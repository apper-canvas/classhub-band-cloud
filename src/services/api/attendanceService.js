class AttendanceService {
  constructor() {
    this.apperClient = null
    this.tableName = 'attendance'
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
          { field: { Name: "student_id" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ]
      }
      
      const response = await client.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      // Map database fields to UI format
      const attendance = response.data.map(record => ({
        Id: record.Id,
        studentId: record.student_id?.toString(),
        date: record.date,
        status: record.status,
        reason: record.reason || ''
      }))
      
      return attendance
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message)
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
          { field: { Name: "student_id" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ]
      }
      
      const response = await client.getRecordById(this.tableName, id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      // Map database fields to UI format
      const record = {
        Id: response.data.Id,
        studentId: response.data.student_id?.toString(),
        date: response.data.date,
        status: response.data.status,
        reason: response.data.reason || ''
      }
      
      return record
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }
  
  async create(attendanceData) {
    try {
      const client = this.getApperClient()
      
      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          student_id: parseInt(attendanceData.studentId),
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || ''
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
          throw new Error('Failed to create attendance record')
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data
          // Map back to UI format
          return {
            Id: createdRecord.Id,
            studentId: createdRecord.student_id?.toString(),
            date: createdRecord.date,
            status: createdRecord.status,
            reason: createdRecord.reason || ''
          }
        }
      }
      
      throw new Error('No attendance record created')
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
  
  async update(id, attendanceData) {
    try {
      const client = this.getApperClient()
      
      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: id,
          student_id: parseInt(attendanceData.studentId),
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || ''
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
          throw new Error('Failed to update attendance record')
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data
          // Map back to UI format
          return {
            Id: updatedRecord.Id,
            studentId: updatedRecord.student_id?.toString(),
            date: updatedRecord.date,
            status: updatedRecord.status,
            reason: updatedRecord.reason || ''
          }
        }
      }
      
      throw new Error('No attendance record updated')
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error?.response?.data?.message)
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
          throw new Error('Failed to delete attendance record')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
}

export const attendanceService = new AttendanceService()