class StudentService {
  constructor() {
    this.apperClient = null
    this.tableName = 'student'
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
          { field: { Name: "Name" } },
          { field: { Name: "grade_level" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "status" } },
          { field: { Name: "parent_name" } },
          { field: { Name: "parent_email" } },
          { field: { Name: "parent_phone" } }
        ]
      }
      
      const response = await client.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      // Map database fields to UI format
      const students = response.data.map(student => ({
        Id: student.Id,
        name: student.Name,
        gradeLevel: student.grade_level,
        email: student.email,
        phone: student.phone,
        enrollmentDate: student.enrollment_date,
        status: student.status,
        parentName: student.parent_name,
        parentEmail: student.parent_email,
        parentPhone: student.parent_phone
      }))
      
      return students
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message)
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
          { field: { Name: "Name" } },
          { field: { Name: "grade_level" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "status" } },
          { field: { Name: "parent_name" } },
          { field: { Name: "parent_email" } },
          { field: { Name: "parent_phone" } }
        ]
      }
      
      const response = await client.getRecordById(this.tableName, id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      // Map database fields to UI format
      const student = {
        Id: response.data.Id,
        name: response.data.Name,
        gradeLevel: response.data.grade_level,
        email: response.data.email,
        phone: response.data.phone,
        enrollmentDate: response.data.enrollment_date,
        status: response.data.status,
        parentName: response.data.parent_name,
        parentEmail: response.data.parent_email,
        parentPhone: response.data.parent_phone
      }
      
      return student
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }
  
  async create(studentData) {
    try {
      const client = this.getApperClient()
      
      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: studentData.name,
          grade_level: studentData.gradeLevel,
          email: studentData.email,
          phone: studentData.phone,
          enrollment_date: new Date().toISOString(),
          status: studentData.status || 'active',
          parent_name: studentData.parentName || '',
          parent_email: studentData.parentEmail || '',
          parent_phone: studentData.parentPhone || ''
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
          throw new Error('Failed to create student')
        }
        
        if (successfulRecords.length > 0) {
          const createdStudent = successfulRecords[0].data
          // Map back to UI format
          return {
            Id: createdStudent.Id,
            name: createdStudent.Name,
            gradeLevel: createdStudent.grade_level,
            email: createdStudent.email,
            phone: createdStudent.phone,
            enrollmentDate: createdStudent.enrollment_date,
            status: createdStudent.status,
            parentName: createdStudent.parent_name,
            parentEmail: createdStudent.parent_email,
            parentPhone: createdStudent.parent_phone
          }
        }
      }
      
      throw new Error('No student created')
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
  
  async update(id, studentData) {
    try {
      const client = this.getApperClient()
      
      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: id,
          Name: studentData.name,
          grade_level: studentData.gradeLevel,
          email: studentData.email,
          phone: studentData.phone,
          enrollment_date: studentData.enrollmentDate,
          status: studentData.status,
          parent_name: studentData.parentName || '',
          parent_email: studentData.parentEmail || '',
          parent_phone: studentData.parentPhone || ''
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
          throw new Error('Failed to update student')
        }
        
        if (successfulUpdates.length > 0) {
          const updatedStudent = successfulUpdates[0].data
          // Map back to UI format
          return {
            Id: updatedStudent.Id,
            name: updatedStudent.Name,
            gradeLevel: updatedStudent.grade_level,
            email: updatedStudent.email,
            phone: updatedStudent.phone,
            enrollmentDate: updatedStudent.enrollment_date,
            status: updatedStudent.status,
            parentName: updatedStudent.parent_name,
            parentEmail: updatedStudent.parent_email,
            parentPhone: updatedStudent.parent_phone
          }
        }
      }
      
      throw new Error('No student updated')
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message)
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
          throw new Error('Failed to delete student')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
}

export const studentService = new StudentService()