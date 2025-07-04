import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const StudentTable = ({ 
  students = [], 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  
  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success'
      case 'inactive': return 'danger'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="h-10 w-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                <div className="flex-1 grid grid-cols-5 gap-4">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              {[
                { key: 'name', label: 'Name' },
                { key: 'gradeLevel', label: 'Grade Level' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Actions' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                >
                  {key !== 'actions' ? (
                    <button
                      onClick={() => handleSort(key)}
                      className="flex items-center space-x-1 hover:text-primary transition-colors"
                    >
                      <span>{label}</span>
                      <ApperIcon 
                        name={sortConfig.key === key && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                        className="w-4 h-4" 
                      />
                    </button>
                  ) : (
                    <span>{label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedStudents.map((student, index) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium">
                      {student.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{student.name}</div>
                      <div className="text-sm text-slate-500">ID: {student.Id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">{student.gradeLevel}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{student.email}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{student.phone}</td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(student.status)}>
                    {student.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Link to={`/students/${student.Id}`}>
                      <Button
                        variant="ghost"
                        size="small"
                        icon="Eye"
                        className="text-slate-600 hover:text-primary"
                      />
                    </Link>
                    <Button
                      variant="ghost"
                      size="small"
                      icon="Edit"
                      onClick={() => onEdit(student)}
                      className="text-slate-600 hover:text-secondary"
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      icon="Trash2"
                      onClick={() => onDelete(student.Id)}
                      className="text-slate-600 hover:text-red-500"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentTable