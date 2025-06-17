import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FileCard from '@/components/molecules/FileCard'

const FileList = ({ files, onFileRemove, showProgress = false }) => {
  const staggerItemInitial = { opacity: 0, y: 20 }
  const staggerItemAnimate = { opacity: 1, y: 0 }
  const getStaggerTransition = (index) => ({ delay: index * 0.1 })

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <AnimatePresence>
        {files.map((file, index) => (
          <motion.div
            key={file.Id}
            initial={staggerItemInitial}
            animate={staggerItemAnimate}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={getStaggerTransition(index)}
            layout
          >
            <FileCard
              file={file}
              onRemove={() => onFileRemove(file.Id)}
              showProgress={showProgress}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default FileList