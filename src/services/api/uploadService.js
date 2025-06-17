import uploadData from '../mockData/uploads.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UploadService {
  constructor() {
    this.sessions = [...uploadData]
  }

  async getAll() {
    await delay(200)
    return [...this.sessions]
  }

  async getById(id) {
    await delay(200)
    const session = this.sessions.find(s => s.Id === parseInt(id, 10))
    if (!session) {
      throw new Error('Upload session not found')
    }
    return { ...session }
  }

  async create(sessionData) {
    await delay(300)
    const newSession = {
      Id: Math.max(...this.sessions.map(s => s.Id), 0) + 1,
      ...sessionData,
      startTime: new Date().toISOString()
    }
    this.sessions.unshift(newSession)
    return { ...newSession }
  }

  async update(id, data) {
    await delay(200)
    const index = this.sessions.findIndex(s => s.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Upload session not found')
    }
    
    const { Id, ...updateData } = data
    this.sessions[index] = { ...this.sessions[index], ...updateData }
    return { ...this.sessions[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.sessions.findIndex(s => s.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Upload session not found')
    }
    
    this.sessions.splice(index, 1)
    return { success: true }
  }

  async getCurrentSession() {
    await delay(100)
    // Return the most recent session or create a new one
    if (this.sessions.length === 0) {
      return await this.create({
        totalFiles: 0,
        completedFiles: 0,
        totalSize: 0,
        uploadedSize: 0
      })
    }
    return { ...this.sessions[0] }
  }

  calculateProgress(session) {
    if (session.totalFiles === 0) return 0
    return Math.round((session.completedFiles / session.totalFiles) * 100)
  }

  calculateUploadSpeed(session) {
    if (!session.startTime) return 0
    const elapsedTime = (Date.now() - new Date(session.startTime).getTime()) / 1000
    if (elapsedTime === 0) return 0
    return session.uploadedSize / elapsedTime
  }

  formatDuration(seconds) {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }
}

export default new UploadService()