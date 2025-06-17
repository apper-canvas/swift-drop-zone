import React from 'react'
import { motion } from 'framer-motion'
import { fileService } from '@/services'
import ApperIcon from '@/components/ApperIcon'
import ProgressBar from '@/components/atoms/ProgressBar'

const StorageIndicator = ({ used, total }) => {
  const usedFormatted = fileService.formatFileSize(used)
  const totalFormatted = fileService.formatFileSize(total)
  const percentage = Math.round((used / total) * 100)

  const getStorageColor = () => {
    if (percentage >= 90) return 'text-error'
    if (percentage >= 75) return 'text-warning'
    return 'text-success'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-surface-700 rounded-lg">
            <ApperIcon name="HardDrive" className="w-5 h-5 text-surface-300" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-surface-50">
              Storage Usage
            </h3>
            <p className="text-sm text-surface-400">
              {usedFormatted} of {totalFormatted} used
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-lg font-bold ${getStorageColor()}`}>
            {percentage}%
          </p>
        </div>
      </div>

      <ProgressBar 
        progress={percentage}
        className="h-2"
        variant={percentage >= 90 ? 'error' : percentage >= 75 ? 'warning' : 'success'}
      />
    </motion.div>
  )
}

export default StorageIndicator