import { useState, useEffect } from 'react'
import { tasksApi } from '../api'
import TaskCard from '../components/tasks/TaskCard'
import { CheckSquare, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const FILTERS = ['All', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
const LABELS  = { All: 'All', TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' }

export default function MyTasksPage() {
  const [tasks, setTasks]     = useState([])
  const [filter, setFilter]   = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data } = await tasksApi.my()
      setTasks(data)
    } finally { setLoading(false) }
  }

  async function handleDelete(id) {
    await tasksApi.delete(id)
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success('Task deleted')
  }

  async function handleStatusChange(id, status) {
    await tasksApi.update(id, { status })
    setTasks(prev => prev.map(t => t.id === id ? {...t, status} : t))
  }

  const shown = filter === 'All' ? tasks : tasks.filter(t => t.status === filter)

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-brand-400" />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <CheckSquare size={20} className="text-brand-400" />
        <h1 className="text-xl font-semibold text-white">My Tasks</h1>
        <span className="text-sm text-gray-500">{tasks.length} total</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-brand-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}>
            {LABELS[f]}
            {f !== 'All' && <span className="ml-1.5 text-xs opacity-70">{tasks.filter(t => t.status === f).length}</span>}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="py-20 text-center">
          <CheckSquare size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No tasks here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {shown.map(task => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} onStatusChange={handleStatusChange} showProject />
          ))}
        </div>
      )}
    </div>
  )
}
