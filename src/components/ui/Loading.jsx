import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24"></div>
                  <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                <div className="flex-1 grid grid-cols-4 gap-4">
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
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-slate-600 font-medium">Loading...</div>
      </div>
    </div>
  )
}

export default Loading