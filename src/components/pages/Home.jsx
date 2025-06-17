import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { fileService, uploadService } from '@/services'
import DropZone from '@/components/organisms/DropZone'
import FileList from '@/components/organisms/FileList'
import UploadProgress from '@/components/organisms/UploadProgress'
import StorageIndicator from '@/components/molecules/StorageIndicator'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'

const Home = () => {
  const [files, setFiles] = useState([])
  const [uploadSession, setUploadSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeUploads, setActiveUploads] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [filesResult, sessionResult] = await Promise.all([
          fileService.getAll(),
          uploadService.getCurrentSession()
        ])
        setFiles(filesResult)
        setUploadSession(sessionResult)
      } catch (err) {
        setError(err.message || 'Failed to load data')
        toast.error('Failed to load files')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleFilesAdded = async (newFiles) => {
    try {
      const validatedFiles = []
      
      for (const file of newFiles) {
        try {
          await fileService.validateFile(file)
          const createdFile = await fileService.create({
            name: file.name,
            size: file.size,
            type: file.type,
            thumbnailUrl: fileService.generateThumbnail(file)
          })
          validatedFiles.push(createdFile)
        } catch (err) {
          toast.error(`${file.name}: ${err.message}`)
        }
      }

      if (validatedFiles.length > 0) {
        setFiles(prev => [...validatedFiles, ...prev])
        
        // Update upload session
        const totalSize = validatedFiles.reduce((sum, file) => sum + file.size, 0)
        const updatedSession = await uploadService.update(uploadSession.Id, {
          totalFiles: uploadSession.totalFiles + validatedFiles.length,
          totalSize: uploadSession.totalSize + totalSize
        })
        setUploadSession(updatedSession)

        // Start uploading files
        startUploading(validatedFiles)
      }
    } catch (err) {
      toast.error('Failed to add files')
    }
  }

  const startUploading = async (filesToUpload) => {
    setActiveUploads(filesToUpload.length)
    
    const uploadPromises = filesToUpload.map(async (file) => {
      try {
        await fileService.simulateUpload(file.Id, (progress) => {
          setFiles(prev => prev.map(f => 
            f.Id === file.Id ? { ...f, progress } : f
          ))
        })
        
        // Update session progress
        const updatedSession = await uploadService.update(uploadSession.Id, {
          completedFiles: uploadSession.completedFiles + 1,
          uploadedSize: uploadSession.uploadedSize + file.size
        })
        setUploadSession(updatedSession)
        
        toast.success(`${file.name} uploaded successfully`)
      } catch (err) {
        await fileService.update(file.Id, { 
          status: 'error', 
          progress: 0 
        })
        toast.error(`Failed to upload ${file.name}`)
      }
    })

    await Promise.all(uploadPromises)
    setActiveUploads(0)
  }

  const handleFileRemove = async (fileId) => {
    try {
      await fileService.delete(fileId)
      setFiles(prev => prev.filter(f => f.Id !== fileId))
      toast.success('File removed')
    } catch (err) {
      toast.error('Failed to remove file')
    }
  }

  const handleClearCompleted = async () => {
    try {
      const completedFiles = files.filter(f => f.status === 'success')
      await Promise.all(completedFiles.map(f => fileService.delete(f.Id)))
      setFiles(prev => prev.filter(f => f.status !== 'success'))
      toast.success('Completed uploads cleared')
    } catch (err) {
      toast.error('Failed to clear completed uploads')
    }
  }

  if (loading) {
    return <SkeletonLoader count={3} />
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'uploading')
  const completedFiles = files.filter(f => f.status === 'success')
  const hasFiles = files.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-full overflow-hidden"
    >
      {/* Storage Indicator */}
      <StorageIndicator 
        used={uploadSession?.uploadedSize || 0}
        total={100 * 1024 * 1024 * 1024} // 100GB
      />

      {/* Drop Zone */}
      <DropZone 
        onFilesAdded={handleFilesAdded}
        isUploading={activeUploads > 0}
      />

      {/* Upload Progress */}
      <AnimatePresence>
        {activeUploads > 0 && uploadSession && (
          <UploadProgress 
            session={uploadSession}
            activeUploads={activeUploads}
          />
        )}
      </AnimatePresence>

      {/* File Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending/Uploading Files */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-semibold text-surface-50">
            Current Uploads
          </h2>
          {pendingFiles.length > 0 ? (
            <FileList 
              files={pendingFiles}
              onFileRemove={handleFileRemove}
              showProgress={true}
            />
          ) : (
            <EmptyState
              icon="Upload"
              title="No active uploads"
              description="Upload files to see them here"
            />
          )}
        </div>

        {/* Completed Files */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold text-surface-50">
              Completed Uploads
            </h2>
            {completedFiles.length > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-sm text-surface-400 hover:text-surface-200 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          {completedFiles.length > 0 ? (
            <FileList 
              files={completedFiles}
              onFileRemove={handleFileRemove}
              showProgress={false}
            />
          ) : (
            <EmptyState
              icon="CheckCircle"
              title="No completed uploads"
              description="Successfully uploaded files will appear here"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Home