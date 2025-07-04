import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = 'No data found',
  description = 'Get started by adding your first item',
  icon = 'FileText',
  actionText = 'Add Item',
  onAction,
  type = 'default'
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'students':
        return {
          title: 'No students yet',
          description: 'Start building your class roster by adding your first student',
          icon: 'Users',
          actionText: 'Add Student'
        }
      case 'grades':
        return {
          title: 'No grades recorded',
          description: 'Begin tracking student performance by adding assignments and grades',
          icon: 'BookOpen',
          actionText: 'Add Assignment'
        }
      case 'attendance':
        return {
          title: 'No attendance data',
          description: 'Start tracking student attendance for better classroom management',
          icon: 'Calendar',
          actionText: 'Take Attendance'
        }
      default:
        return { title, description, icon, actionText }
    }
  }
  
  const config = getEmptyConfig()
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
          <ApperIcon name={config.icon} className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-slate-800">{config.title}</h3>
          <p className="text-slate-600 leading-relaxed">{config.description}</p>
        </div>
        
        {onAction && (
          <motion.button
            onClick={onAction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>{config.actionText}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty