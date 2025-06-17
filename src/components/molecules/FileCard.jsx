import React from 'react'
import { motion } from 'framer-motion'
import { fileService } from '@/services'
import ApperIcon from '@/components/ApperIcon'
import ProgressBar from '@/components/atoms/ProgressBar'
import Button from '@/components/atoms/Button'

const FileCard = ({ file, onRemove, showProgress = false }) => {
  const fileIcon = fileService.getFileIcon(file.type)
  const fileSize = fileService.formatFileSize(file.size)
  const uploadSpeed = file.uploadSpeed ? fileService.formatUploadSpeed(file.uploadSpeed) : null

  const getStatusColor = () => {
    switch (file.status) {
      case 'success': return 'text-success'
      case 'error': return 'text-error'
      case 'uploading': return 'text-info'
      default: return 'text-surface-400'
    }
  }

  const getStatusIcon = () => {
    switch (file.status) {
      case 'success': return 'CheckCircle'
      case 'error': return 'XCircle'
      case 'uploading': return 'Upload'
      default: return 'Clock'
    }
  }

  return (
    <motion.div
      className="glass-morphism rounded-xl p-4 hover:scale-[1.02] transition-all duration-200"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center space-x-4">
        {/* File thumbnail or icon */}
        <div className="flex-shrink-0">
          {file.thumbnailUrl ? (
            <img
              src={file.thumbnailUrl}
              alt={file.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-surface-700 rounded-lg flex items-center justify-center">
              <ApperIcon name={fileIcon} className="w-6 h-6 text-surface-300" />
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-surface-50 truncate pr-2">
              {file.name}
            </h4>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <ApperIcon 
                name={getStatusIcon()} 
                className={`w-4 h-4 ${getStatusColor()}`} 
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-surface-400 hover:text-error p-1"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-surface-400">
            <span>{fileSize}</span>
            {uploadSpeed && (
              <span className="text-info">{uploadSpeed}</span>
            )}
          </div>

          {/* Progress bar */}
          {showProgress && file.status === 'uploading' && (
            <div className="mt-2">
              <ProgressBar 
                progress={file.progress} 
                className="h-2"
                showShimmer={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Success animation */}
      {file.status === 'success' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default FileCard