import { useState } from 'react'
import { tasksApi } from '../../api'
import { X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const STATUSES   = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' }

export default function NewTaskModal({ projectId, defaultStatus = 'TODO', onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '', status: defaultStatus,
    priority: 'MEDIUM', dueDate: '', projectId
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      const payload = { ...form, dueDate: form.dueDate || null }
      const { data } = await tasksApi.create(payload)
      toast.success('Task created')
      onCreated(data)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create task')
    } finally { setLoading(false) }
  }

  const set = k => e => setForm({...form, [k]: e.target.value})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card w-full max-w-md animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">New Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
            <input className="input" placeholder="What needs to be done?" autoFocus
              value={form.title} onChange={set('title')} required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Add more details..."
              value={form.description} onChange={set('description')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
              <select className="input" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Priority</label>
              <select className="input" value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Due Date</label>
            <input className="input" type="date" value={form.dueDate} onChange={set('dueDate')} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
