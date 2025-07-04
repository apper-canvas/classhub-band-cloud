import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Card from '@/components/atoms/Card'

const StudentForm = ({ 
  student = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
const [formData, setFormData] = useState({
    name: '',
    gradeLevel: '',
    email: '',
    phone: '',
    status: 'active',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  })
  
  const [errors, setErrors] = useState({})
  
useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        gradeLevel: student.gradeLevel || '',
        email: student.email || '',
        phone: student.phone || '',
        status: student.status || 'active',
        parentName: student.parentName || '',
        parentEmail: student.parentEmail || '',
        parentPhone: student.parentPhone || ''
      })
    }
  }, [student])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.gradeLevel.trim()) {
      newErrors.gradeLevel = 'Grade level is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }
    
    return newErrors
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    onSubmit(formData)
  }
  
  const gradeOptions = [
    { value: 'Kindergarten', label: 'Kindergarten' },
    { value: '1st Grade', label: '1st Grade' },
    { value: '2nd Grade', label: '2nd Grade' },
    { value: '3rd Grade', label: '3rd Grade' },
    { value: '4th Grade', label: '4th Grade' },
    { value: '5th Grade', label: '5th Grade' },
    { value: '6th Grade', label: '6th Grade' },
    { value: '7th Grade', label: '7th Grade' },
    { value: '8th Grade', label: '8th Grade' },
    { value: '9th Grade', label: '9th Grade' },
    { value: '10th Grade', label: '10th Grade' },
    { value: '11th Grade', label: '11th Grade' },
    { value: '12th Grade', label: '12th Grade' }
  ]
  
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ]
  
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <p className="text-slate-600 mt-1">
            {student ? 'Update student information' : 'Fill in the student details below'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Enter student's full name"
            />
            
            <FormField
              type="select"
              label="Grade Level"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              error={errors.gradeLevel}
              options={gradeOptions}
              required
            />
            
            <FormField
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="student@example.com"
            />
            
            <FormField
              type="tel"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="(555) 123-4567"
            />
            
            <FormField
              type="select"
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              error={errors.status}
              options={statusOptions}
required
            />
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Parent Information</h3>
            </div>
            
<FormField
              label="Parent Name"
              name="parentName"
              value={formData.parentName || ''}
              onChange={handleChange}
              placeholder="Enter parent's full name"
            />
            
            <FormField
              type="email"
              label="Parent Email"
              name="parentEmail"
              value={formData.parentEmail || ''}
              onChange={handleChange}
              placeholder="parent@example.com"
            />
            
            <FormField
              type="tel"
              label="Parent Phone"
              name="parentPhone"
              value={formData.parentPhone || ''}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {student ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default StudentForm