import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import ExportDialog from "@/components/organisms/ExportDialog";
import GradeForm from "@/components/organisms/GradeForm";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import { exportService } from "@/services/api/exportService";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";

const Grades = () => {
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [filteredGrades, setFilteredGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingGrade, setEditingGrade] = useState(null)
const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [assignmentNameFilter, setAssignmentNameFilter] = useState('')
  const [minScore, setMinScore] = useState('')
  const [maxScore, setMaxScore] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [gradesData, studentsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll()
      ])
      
      setGrades(gradesData)
      setStudents(studentsData)
      setFilteredGrades(gradesData)
    } catch (err) {
      setError(err.message || 'Failed to load grades')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
useEffect(() => {
    let filtered = grades
    
    if (searchTerm) {
      filtered = filtered.filter(grade => {
        const student = students.find(s => s.Id === parseInt(grade.studentId))
        return (
          grade.assignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(grade => grade.category === selectedCategory)
    }
    
    if (assignmentNameFilter) {
      filtered = filtered.filter(grade => 
        grade.assignmentName.toLowerCase().includes(assignmentNameFilter.toLowerCase())
      )
    }
    
    if (minScore !== '' || maxScore !== '') {
      filtered = filtered.filter(grade => {
        const percentage = (grade.score / grade.maxScore) * 100
        const min = minScore !== '' ? parseFloat(minScore) : 0
        const max = maxScore !== '' ? parseFloat(maxScore) : 100
        return percentage >= min && percentage <= max
      })
    }
    
    setFilteredGrades(filtered)
  }, [searchTerm, selectedCategory, assignmentNameFilter, minScore, maxScore, grades, students])
  
  const handleAddGrade = () => {
    setEditingGrade(null)
    setShowForm(true)
  }
  
  const handleEditGrade = (grade) => {
    setEditingGrade(grade)
    setShowForm(true)
  }
  
  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradeService.delete(gradeId)
        setGrades(prev => prev.filter(g => g.Id !== gradeId))
        toast.success('Grade deleted successfully')
      } catch (err) {
        toast.error('Failed to delete grade')
      }
    }
  }
  
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true)
      
      if (editingGrade) {
        const updatedGrade = await gradeService.update(editingGrade.Id, formData)
        setGrades(prev => prev.map(g => g.Id === editingGrade.Id ? updatedGrade : g))
        toast.success('Grade updated successfully')
      } else {
        const newGrade = await gradeService.create(formData)
        setGrades(prev => [...prev, newGrade])
        toast.success('Grade added successfully')
      }
      
      setShowForm(false)
      setEditingGrade(null)
    } catch (err) {
      toast.error(err.message || 'Failed to save grade')
    } finally {
      setFormLoading(false)
    }
  }
  
const handleFormCancel = () => {
    setShowForm(false)
    setEditingGrade(null)
  }
  
  const handleExport = async (format) => {
    try {
      setExportLoading(true)
      await exportService.generateGradeReport(filteredGrades, students, format)
      toast.success(`Grade report exported successfully as ${format.toUpperCase()}`)
      setShowExportDialog(false)
    } catch (error) {
      toast.error('Failed to export grade report')
    } finally {
      setExportLoading(false)
    }
  }
  
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'excellent'
    if (percentage >= 80) return 'good'
    if (percentage >= 70) return 'satisfactory'
    return 'needs-improvement'
  }
  
const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId))
    return student?.name || 'Unknown Student'
  }

  // Define available categories for filtering
  const categories = ['homework', 'quiz', 'test', 'project', 'participation', 'final']
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadData} />
  }
  
  if (showForm) {
    return (
      <GradeForm
        grade={editingGrade}
        students={students}
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
          <h1 className="text-3xl font-bold gradient-text">Grades</h1>
          <p className="text-slate-600 mt-1">
            Track student performance and assignments • {grades.length} total grades
          </p>
</div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setShowExportDialog(true)}
            icon="Download"
            className="sm:w-auto"
          >
            Export
          </Button>
          <Button
            onClick={handleAddGrade}
            icon="Plus"
            className="sm:w-auto"
          >
            Add Grade
          </Button>
        </div>
      </div>
{/* Filter Grades Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Filter Grades</h2>
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
              setAssignmentNameFilter('')
              setMinScore('')
              setMaxScore('')
            }}
            className="text-slate-600 hover:text-slate-900"
          >
            Clear All Filters
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Student Name Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Student Name
            </label>
            <SearchBar
              placeholder="Search by student name..."
              onSearch={setSearchTerm}
              className="w-full"
            />
          </div>
          
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Assignment Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-premium"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Student Marks Range Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Score Range (%)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min %"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="input-premium flex-1"
                min="0"
                max="100"
              />
              <input
                type="number"
                placeholder="Max %"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="input-premium flex-1"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
        
        {/* Additional Assignment Name Filter */}
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Assignment Name
          </label>
          <input
            type="text"
            placeholder="Filter by assignment name..."
            value={assignmentNameFilter}
            onChange={(e) => setAssignmentNameFilter(e.target.value)}
            className="input-premium w-full md:w-1/2"
          />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold gradient-text mb-2">
            {filteredGrades.length}
          </div>
          <div className="text-slate-600 text-sm">Total Grades</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold gradient-text mb-2">
            {filteredGrades.length > 0 
              ? (filteredGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / filteredGrades.length).toFixed(1)
              : '0'
            }%
          </div>
          <div className="text-slate-600 text-sm">Average Score</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold gradient-text mb-2">
            {filteredGrades.filter(grade => (grade.score / grade.maxScore) * 100 >= 90).length}
          </div>
          <div className="text-slate-600 text-sm">Excellent (90%+)</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold gradient-text mb-2">
            {filteredGrades.filter(grade => (grade.score / grade.maxScore) * 100 < 70).length}
          </div>
          <div className="text-slate-600 text-sm">Needs Improvement</div>
        </Card>
      </div>
      
      {/* Grades Grid */}
      {filteredGrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrades
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((grade, index) => {
              const percentage = (grade.score / grade.maxScore) * 100
              
              return (
                <motion.div
                  key={grade.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">
                          {grade.assignmentName}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {getStudentName(grade.studentId)}
                        </p>
                        <Badge variant="primary" className="text-xs">
                          {grade.category}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">
                          {percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-500">
                          {grade.score}/{grade.maxScore}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getGradeColor(percentage)}>
                          {percentage >= 90 ? 'Excellent' : 
                           percentage >= 80 ? 'Good' : 
                           percentage >= 70 ? 'Satisfactory' : 'Needs Improvement'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Edit"
                          onClick={() => handleEditGrade(grade)}
                          className="text-slate-600 hover:text-secondary"
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          icon="Trash2"
                          onClick={() => handleDeleteGrade(grade.Id)}
                          className="text-slate-600 hover:text-red-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Date:</span>
                        <span>{format(new Date(grade.date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
        </div>
      ) : grades.length === 0 ? (
        <Empty
          type="grades"
          onAction={handleAddGrade}
        />
      ) : (
<div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No grades found</h3>
          <p className="text-slate-500">
            Try adjusting your search terms or{' '}
            <button
onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setAssignmentNameFilter('')
                setMinScore('')
                setMaxScore('')
              }}
              className="text-primary hover:underline"
            >
              clear filters
            </button>
          </p>
        </div>
      )}
      
      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        dataType="Grades"
        loading={exportLoading}
      />
    </div>
)
}

export default Grades