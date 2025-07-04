import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon,
  trend,
  trendValue,
  color = 'primary',
  index = 0 
}) => {
  const colorClasses = {
    primary: 'from-primary to-primary/80 text-white',
    secondary: 'from-secondary to-secondary/80 text-white',
    accent: 'from-accent to-accent/80 text-white',
    success: 'from-success to-success/80 text-white',
    warning: 'from-warning to-warning/80 text-white',
    danger: 'from-red-500 to-red-600 text-white'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className={`w-4 h-4 ${trend === 'up' ? 'text-success' : 'text-red-500'}`} 
              />
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-red-500'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard