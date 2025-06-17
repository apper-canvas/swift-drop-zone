import fileData from '../mockData/files.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class FileService {
  constructor() {
    this.files = [...fileData]
  }

  async getAll() {
    await delay(300)
    return [...this.files]
  }

  async getById(id) {
    await delay(200)
    const file = this.files.find(f => f.Id === parseInt(id, 10))
    if (!file) {
      throw new Error('File not found')
    }
    return { ...file }
  }

  async create(fileData) {
    await delay(400)
    const newFile = {
      Id: Math.max(...this.files.map(f => f.Id), 0) + 1,
      ...fileData,
      status: 'pending',
      progress: 0,
      uploadSpeed: 0,
      uploadedAt: new Date().toISOString()
    }
    this.files.unshift(newFile)
    return { ...newFile }
  }

  async update(id, data) {
    await delay(200)
    const index = this.files.findIndex(f => f.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('File not found')
    }
    
    const { Id, ...updateData } = data
    this.files[index] = { ...this.files[index], ...updateData }
    return { ...this.files[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.files.findIndex(f => f.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('File not found')
    }
    
    this.files.splice(index, 1)
    return { success: true }
  }

  async simulateUpload(fileId, onProgress) {
    const file = this.files.find(f => f.Id === parseInt(fileId, 10))
    if (!file) {
      throw new Error('File not found')
    }

    // Update to uploading status
    await this.update(fileId, { status: 'uploading', progress: 0 })

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += Math.random() * 10 + 5) {
      const currentProgress = Math.min(progress, 100)
      const uploadSpeed = Math.random() * 5 + 1 // 1-6 MB/s
      
      await this.update(fileId, { 
        progress: currentProgress, 
        uploadSpeed: uploadSpeed 
      })
      
      if (onProgress) {
        onProgress(currentProgress)
      }
      
      await delay(100 + Math.random() * 200) // Variable delay for realism
    }

    // Mark as complete
    await this.update(fileId, { 
      status: 'success', 
      progress: 100, 
      uploadSpeed: 0,
      uploadedAt: new Date().toISOString()
    })

    return { success: true }
  }

  async validateFile(file) {
    await delay(100)
    
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]

    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit')
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported')
    }

    return { valid: true }
  }

  generateThumbnail(file) {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return null
  }

  getFileIcon(type) {
    if (type.startsWith('image/')) return 'Image'
    if (type === 'application/pdf') return 'FileText'
    if (type.includes('spreadsheet') || type.includes('csv')) return 'FileSpreadsheet'
    if (type.includes('presentation')) return 'Presentation'
    if (type.includes('word')) return 'FileText'
    if (type.startsWith('text/')) return 'FileText'
    return 'File'
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  formatUploadSpeed(bytesPerSecond) {
    if (bytesPerSecond === 0) return '0 KB/s'
    const k = 1024
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    const i = Math.floor(Math.log(bytesPerSecond * 1024 * 1024) / Math.log(k))
    const speed = (bytesPerSecond * 1024 * 1024) / Math.pow(k, i)
    return parseFloat(speed.toFixed(1)) + ' ' + sizes[i]
  }
}

export default new FileService()