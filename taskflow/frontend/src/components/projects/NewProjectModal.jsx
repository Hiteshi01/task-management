import { useState } from 'react'
import { projectsApi } from '../../api'
import { X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const EMOJIS  = ['📋','🚀','🎨','💡','🔧','📱','🌐','📊','🎯','⚡','🔌','🏗️']
const COLORS  = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#ef4444','#10b981','#3b82f6']

export default function NewProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', emoji: '📋', color: '#6366f1' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await projectsApi.create(form)
      toast.success('Project created!')
      onCreated()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card w-full max-w-md animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">New Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Emoji & Color */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => setForm({...form, emoji: e})}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    form.emoji === e ? 'bg-gray-700 ring-2 ring-brand-500' : 'bg-gray-800 hover:bg-gray-700'
                  }`}>{e}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({...form, color: c})}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white scale-110' : 'hover:scale-105'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
            <input className="input" placeholder="e.g. Website Redesign" autoFocus
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="What is this project about?"
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
