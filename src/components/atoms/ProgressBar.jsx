import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  className = '', 
  showShimmer = false,
  variant = 'primary'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'from-success to-success'
      case 'warning':
        return 'from-warning to-warning'
      case 'error':
        return 'from-error to-error'
      default:
        return 'from-primary to-accent'
    }
  }

  return (
    <div className={`bg-surface-700 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full bg-gradient-to-r ${getVariantClasses()} relative`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {showShimmer && progress > 0 && progress < 100 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        )}
      </motion.div>
    </div>
  )
}

export default ProgressBar