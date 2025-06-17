import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const DropZone = ({ onFilesAdded, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      onFilesAdded(files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onFilesAdded(files)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
        isDragging
          ? 'border-primary bg-primary/10 scale-105 animate-glow'
          : 'border-surface-600 hover:border-surface-500'
      } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      
      <div className="relative z-10 space-y-6">
        {/* Icon with animation */}
        <motion.div
          className="flex justify-center"
          animate={isDragging ? { scale: 1.2 } : { scale: 1 }}
        >
          <div className={`p-6 rounded-full transition-all duration-200 ${
            isDragging 
              ? 'bg-gradient-to-br from-primary to-secondary' 
              : 'bg-surface-800 group-hover:bg-surface-700'
          }`}>
            <ApperIcon 
              name={isDragging ? "Download" : "Upload"} 
              className={`w-12 h-12 transition-colors duration-200 ${
                isDragging ? 'text-white' : 'text-surface-300'
              }`}
            />
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-heading font-bold text-surface-50">
            {isDragging ? 'Drop files here' : 'Drag & drop files'}
          </h3>
          <p className="text-surface-400 text-lg">
            {isDragging 
              ? 'Release to upload your files'
              : 'or click to browse from your device'
            }
          </p>
          
          {!isDragging && (
            <div className="pt-4">
              <Button
                onClick={handleBrowseClick}
                disabled={isUploading}
                className="gradient-primary text-white font-semibold px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                <ApperIcon name="FolderOpen" className="w-5 h-5 mr-2" />
                Browse Files
              </Button>
            </div>
          )}
        </div>

        {/* File type indicators */}
        <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-surface-700">
          <div className="flex items-center space-x-2 text-surface-400 text-sm">
            <ApperIcon name="Image" className="w-4 h-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center space-x-2 text-surface-400 text-sm">
            <ApperIcon name="FileText" className="w-4 h-4" />
            <span>Documents</span>
          </div>
          <div className="flex items-center space-x-2 text-surface-400 text-sm">
            <ApperIcon name="FileSpreadsheet" className="w-4 h-4" />
            <span>Spreadsheets</span>
          </div>
          <div className="flex items-center space-x-2 text-surface-400 text-sm">
            <ApperIcon name="Presentation" className="w-4 h-4" />
            <span>Presentations</span>
          </div>
        </div>

        {/* File size limit */}
        <p className="text-surface-500 text-sm">
          Maximum file size: 100MB per file
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.txt,.csv,.docx,.xlsx,.pptx"
      />

      {/* Uploading overlay */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-surface-300 font-medium">Processing files...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DropZone