import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const ExportDialog = ({ 
  isOpen, 
  onClose, 
  onExport, 
  dataType, 
  loading = false 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  
  const handleExport = () => {
    onExport(selectedFormat)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Download" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Export {dataType}
                </h2>
                <p className="text-sm text-slate-600">
                  Choose your preferred format
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="small"
              icon="X"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            />
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-3 block">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedFormat === 'pdf'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <ApperIcon name="FileText" size={24} />
                    <span className="font-medium">PDF</span>
                    <span className="text-xs opacity-75">
                      Formatted document
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedFormat('csv')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedFormat === 'csv'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <ApperIcon name="Table" size={24} />
                    <span className="font-medium">CSV</span>
                    <span className="text-xs opacity-75">
                      Spreadsheet data
                    </span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" size={16} className="text-slate-400 mt-0.5" />
                <div className="text-sm text-slate-600">
                  <p className="font-medium mb-1">Export includes:</p>
                  <ul className="text-xs space-y-1">
                    {dataType === 'Grades' ? (
                      <>
                        <li>• Student names and assignments</li>
                        <li>• Scores and percentages</li>
                        <li>• Categories and dates</li>
                        <li>• Performance summaries</li>
                      </>
                    ) : (
                      <>
                        <li>• Student names and dates</li>
                        <li>• Attendance status</li>
                        <li>• Absence reasons</li>
                        <li>• Attendance statistics</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              loading={loading}
              icon="Download"
              className="flex-1"
            >
              Export {selectedFormat.toUpperCase()}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ExportDialog