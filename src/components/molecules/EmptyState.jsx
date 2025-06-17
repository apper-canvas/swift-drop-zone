import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const EmptyState = ({ 
  icon = 'Package', 
  title = 'No items found', 
  description = 'There are no items to display',
  actionLabel,
  onAction 
}) => {
  const emptyStateInitial = { scale: 0.9, opacity: 0 }
  const emptyStateAnimate = { scale: 1, opacity: 1 }
  const iconBounceAnimate = { y: [0, -10, 0] }
  const iconBounceTransition = { repeat: Infinity, duration: 3 }

  return (
    <motion.div
      initial={emptyStateInitial}
      animate={emptyStateAnimate}
      className="text-center py-12 px-6"
    >
      <motion.div
        animate={iconBounceAnimate}
        transition={iconBounceTransition}
        className="mb-4"
      >
        <div className="w-16 h-16 mx-auto bg-surface-800 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-surface-400" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-heading font-semibold text-surface-300 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export default EmptyState