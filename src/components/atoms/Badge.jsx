import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  variant = 'default', 
  children, 
  icon,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    present: 'status-present',
    absent: 'status-absent',
    late: 'status-late',
    excused: 'status-excused',
    excellent: 'grade-excellent',
    good: 'grade-good',
    satisfactory: 'grade-satisfactory',
    'needs-improvement': 'grade-needs-improvement',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200'
  }
  
  const classes = `status-badge ${variants[variant]} ${className}`
  
  return (
    <span className={classes} {...props}>
      {icon && <ApperIcon name={icon} className="w-3 h-3 mr-1" />}
      {children}
    </span>
  )
}

export default Badge