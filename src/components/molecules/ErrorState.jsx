import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-6"
    >
      <div className="w-16 h-16 mx-auto bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-heading font-semibold text-surface-300 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-secondary text-white hover:scale-105"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState