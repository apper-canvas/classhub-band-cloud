import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import StudentTable from '@/components/organisms/StudentTable'
import StudentForm from '@/components/organisms/StudentForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { studentService } from '@/services/api/studentService'

const Students = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  
  const loadStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await studentService.getAll()
      setStudents(data)
      setFilteredStudents(data)
    } catch (err) {
      setError(err.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadStudents()
  }, [])
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStudents(filtered)
    }
  }, [searchTerm, students])
  
  const handleAddStudent = () => {
    setEditingStudent(null)
    setShowForm(true)
  }
  
  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setShowForm(true)
  }
  
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(studentId)
        setStudents(prev => prev.filter(s => s.Id !== studentId))
        toast.success('Student deleted successfully')
      } catch (err) {
        toast.error('Failed to delete student')
      }
    }
  }
  
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true)
      
      if (editingStudent) {
        const updatedStudent = await studentService.update(editingStudent.Id, formData)
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s))
        toast.success('Student updated successfully')
      } else {
        const newStudent = await studentService.create(formData)
        setStudents(prev => [...prev, newStudent])
        toast.success('Student added successfully')
      }
      
      setShowForm(false)
      setEditingStudent(null)
    } catch (err) {
      toast.error(err.message || 'Failed to save student')
    } finally {
      setFormLoading(false)
    }
  }
  
  const handleFormCancel = () => {
    setShowForm(false)
    setEditingStudent(null)
  }
  
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadStudents} />
  }
  
  if (showForm) {
    return (
      <StudentForm
        student={editingStudent}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        loading={formLoading}
      />
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Students</h1>
          <p className="text-slate-600 mt-1">
            Manage your student roster • {students.length} total students
          </p>
        </div>
        
        <Button
          onClick={handleAddStudent}
          icon="UserPlus"
          className="md:w-auto"
        >
          Add Student
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar
          placeholder="Search students by name, grade, or email..."
          onSearch={setSearchTerm}
          className="flex-1"
        />
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600">
            {filteredStudents.length} of {students.length} students
          </span>
        </div>
      </div>
      
      {/* Students Table */}
      {filteredStudents.length > 0 ? (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      ) : students.length === 0 ? (
        <Empty
          type="students"
          onAction={handleAddStudent}
        />
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No students found</h3>
          <p className="text-slate-500">
            Try adjusting your search terms or{' '}
            <button
              onClick={() => setSearchTerm('')}
              className="text-primary hover:underline"
            >
              clear filters
            </button>
          </p>
        </div>
      )}
    </div>
  )
}

export default Students