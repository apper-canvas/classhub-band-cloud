import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'

const StatusToggle = ({ 
  status, 
  onStatusChange,
  studentName,
  disabled = false 
}) => {
  const statuses = [
    { value: 'present', label: 'Present', variant: 'present' },
    { value: 'absent', label: 'Absent', variant: 'absent' },
    { value: 'late', label: 'Late', variant: 'late' },
    { value: 'excused', label: 'Excused', variant: 'excused' }
  ]
  
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((statusOption) => (
        <motion.button
          key={statusOption.value}
          onClick={() => !disabled && onStatusChange(statusOption.value)}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            status === statusOption.value
              ? 'opacity-100 ring-2 ring-offset-2 ring-primary/30'
              : 'opacity-60 hover:opacity-100'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={disabled}
        >
          <Badge variant={statusOption.variant}>
            {statusOption.label}
          </Badge>
        </motion.button>
      ))}
    </div>
  )
}

export default StatusToggle