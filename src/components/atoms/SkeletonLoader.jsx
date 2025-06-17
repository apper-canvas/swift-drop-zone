import React from 'react'
import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3 }) => {
  const staggerItemInitial = { opacity: 0, y: 20 }
  const staggerItemAnimate = { opacity: 1, y: 0 }
  const getStaggerTransition = (index) => ({ delay: index * 0.1 })

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={staggerItemInitial}
          animate={staggerItemAnimate}
          transition={getStaggerTransition(i)}
          className="glass-morphism rounded-xl p-6"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-700 rounded w-3/4"></div>
                <div className="h-3 bg-surface-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-2 bg-surface-700 rounded"></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader