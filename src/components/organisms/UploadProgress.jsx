import React from 'react'
import { motion } from 'framer-motion'
import { uploadService } from '@/services'
import ApperIcon from '@/components/ApperIcon'
import ProgressBar from '@/components/atoms/ProgressBar'

const UploadProgress = ({ session, activeUploads }) => {
  const progress = uploadService.calculateProgress(session)
  const uploadSpeed = uploadService.formatUploadSpeed(uploadService.calculateUploadSpeed(session))
  const duration = uploadService.formatDuration((Date.now() - new Date(session.startTime).getTime()) / 1000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="glass-morphism rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <ApperIcon name="Upload" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-surface-50">
              Uploading Files
            </h3>
            <p className="text-sm text-surface-400">
              {activeUploads} of {session.totalFiles} files remaining
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-bold text-surface-50">{progress}%</p>
          <p className="text-sm text-surface-400">{uploadSpeed}</p>
        </div>
      </div>

      <ProgressBar 
        progress={progress}
        className="h-3"
        showShimmer={true}
      />

      <div className="flex items-center justify-between text-sm text-surface-400">
        <span>Elapsed: {duration}</span>
        <span>
          {session.completedFiles} / {session.totalFiles} files completed
        </span>
      </div>
    </motion.div>
  )
}

export default UploadProgress