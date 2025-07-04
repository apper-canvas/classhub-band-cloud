import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Card from '@/components/atoms/Card'

const GradeForm = ({ 
  grade = null, 
  students = [],
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    studentId: '',
    assignmentName: '',
    category: '',
    score: '',
    maxScore: '100',
    date: new Date().toISOString().split('T')[0]
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (grade) {
      setFormData({
        studentId: grade.studentId || '',
        assignmentName: grade.assignmentName || '',
        category: grade.category || '',
        score: grade.score?.toString() || '',
        maxScore: grade.maxScore?.toString() || '100',
        date: grade.date ? new Date(grade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })
    }
  }, [grade])
  
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
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student is required'
    }
    
    if (!formData.assignmentName.trim()) {
      newErrors.assignmentName = 'Assignment name is required'
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.score.trim()) {
      newErrors.score = 'Score is required'
    } else if (isNaN(formData.score) || formData.score < 0) {
      newErrors.score = 'Score must be a positive number'
    }
    
    if (!formData.maxScore.trim()) {
      newErrors.maxScore = 'Max score is required'
    } else if (isNaN(formData.maxScore) || formData.maxScore <= 0) {
      newErrors.maxScore = 'Max score must be a positive number'
    }
    
    if (formData.score && formData.maxScore && parseFloat(formData.score) > parseFloat(formData.maxScore)) {
      newErrors.score = 'Score cannot exceed max score'
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
    
    const submissionData = {
      ...formData,
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore),
      date: new Date(formData.date)
    }
    
    onSubmit(submissionData)
  }
  
  const studentOptions = students.map(student => ({
    value: student.Id.toString(),
    label: `${student.name} (${student.gradeLevel})`
  }))
  
  const categoryOptions = [
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'test', label: 'Test' },
{ value: 'project', label: 'Project' },
    { value: 'participation', label: 'Participation' },
    { value: 'final', label: 'Final' }
  ]
  
  const percentage = formData.score && formData.maxScore 
    ? ((parseFloat(formData.score) / parseFloat(formData.maxScore)) * 100).toFixed(1)
    : '0'
  
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            {grade ? 'Edit Grade' : 'Add New Grade'}
          </h2>
          <p className="text-slate-600 mt-1">
            {grade ? 'Update grade information' : 'Enter assignment and grade details'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Student"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
              options={studentOptions}
              required
            />
            
            <FormField
              type="select"
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              options={categoryOptions}
              required
            />
            
            <div className="md:col-span-2">
              <FormField
                label="Assignment Name"
                name="assignmentName"
                value={formData.assignmentName}
                onChange={handleChange}
                error={errors.assignmentName}
                required
                placeholder="Enter assignment name"
              />
            </div>
            
            <FormField
              type="number"
              label="Score"
              name="score"
              value={formData.score}
              onChange={handleChange}
              error={errors.score}
              required
              placeholder="0"
              min="0"
              step="0.1"
            />
            
            <FormField
              type="number"
              label="Max Score"
              name="maxScore"
              value={formData.maxScore}
              onChange={handleChange}
              error={errors.maxScore}
              required
              placeholder="100"
              min="1"
              step="0.1"
            />
            
            <FormField
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
            />
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">
                  {percentage}%
                </div>
                <div className="text-sm text-slate-600">
                  Percentage Score
                </div>
              </div>
            </div>
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
              {grade ? 'Update Grade' : 'Add Grade'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default GradeForm