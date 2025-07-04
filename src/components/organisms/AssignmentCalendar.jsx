import { useState } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const AssignmentCalendar = ({ assignments = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }
  
  const goToToday = () => {
    setCurrentMonth(new Date())
  }
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            onClick={prevMonth}
            icon="ChevronLeft"
          />
          <h3 className="text-lg font-semibold text-slate-800 min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button
            variant="ghost"
            size="small"
            onClick={nextMonth}
            icon="ChevronRight"
          />
        </div>
        <Button
          variant="outline"
          size="small"
          onClick={goToToday}
          className="text-sm"
        >
          Today
        </Button>
      </div>
    )
  }
  
  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
            {day}
          </div>
        ))}
      </div>
    )
  }
  
  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    )
  }
  
  const getCategoryColor = (category) => {
    const colors = {
      'test': 'bg-red-100 text-red-700',
      'quiz': 'bg-blue-100 text-blue-700',
      'homework': 'bg-green-100 text-green-700',
      'project': 'bg-purple-100 text-purple-700',
      'participation': 'bg-yellow-100 text-yellow-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }
  
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    
    const rows = []
    let days = []
    let day = startDate
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const dayAssignments = getAssignmentsForDate(day)
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isDayToday = isToday(day)
        
        days.push(
          <motion.div
            key={day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`
              relative p-2 min-h-[80px] border border-slate-200 rounded-lg
              ${isCurrentMonth ? 'bg-white' : 'bg-slate-50'}
              ${isDayToday ? 'ring-2 ring-primary bg-primary/5' : ''}
              hover:bg-slate-50 transition-colors duration-150
            `}
          >
            <div className={`
              text-sm font-medium mb-1
              ${isCurrentMonth ? 'text-slate-900' : 'text-slate-400'}
              ${isDayToday ? 'text-primary font-bold' : ''}
            `}>
              {format(cloneDay, 'd')}
            </div>
            
            <div className="space-y-1">
              {dayAssignments.slice(0, 2).map(assignment => (
                <div
                  key={assignment.Id}
                  className={`
                    text-xs px-2 py-1 rounded-full truncate
                    ${getCategoryColor(assignment.category)}
                  `}
                  title={`${assignment.name} - ${assignment.category}`}
                >
                  {assignment.name}
                </div>
              ))}
              
              {dayAssignments.length > 2 && (
                <div className="text-xs text-slate-500 px-2">
                  +{dayAssignments.length - 2} more
                </div>
              )}
            </div>
          </motion.div>
        )
        
        day = addDays(day, 1)
      }
      
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>
      )
      days = []
    }
    
    return <div>{rows}</div>
  }
  
  const renderLegend = () => {
    const categories = [...new Set(assignments.map(a => a.category))]
    
    if (categories.length === 0) return null
    
    return (
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(category).split(' ')[0]}`} />
              <span className="text-sm text-slate-600 capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="w-full">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCalendar()}
      {renderLegend()}
      
      {assignments.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p>No assignments scheduled</p>
        </div>
      )}
    </div>
  )
}

export default AssignmentCalendar