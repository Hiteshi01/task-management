import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { projectsApi, tasksApi } from '../api'
import { Plus, Loader2, MoreHorizontal, Trash2, Settings } from 'lucide-react'
import NewTaskModal from '../components/tasks/NewTaskModal'
import TaskCard from '../components/tasks/TaskCard'
import toast from 'react-hot-toast'

const COLUMNS = [
  { key: 'TODO',        label: 'To Do',       color: 'bg-gray-500' },
  { key: 'IN_PROGRESS', label: 'In Progress',  color: 'bg-blue-500' },
  { key: 'IN_REVIEW',   label: 'In Review',    color: 'bg-purple-500' },
  { key: 'DONE',        label: 'Done',         color: 'bg-green-500' },
]

export default function ProjectPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newStatus, setNewStatus] = useState('TODO')
  const [dragging, setDragging] = useState(null)

  useEffect(() => { load() }, [id])

  async function load() {
    setLoading(true)
    try {
      const [{ data: p }, { data: t }] = await Promise.all([
        projectsApi.get(id), tasksApi.byProject(id)
      ])
      setProject(p)
      setTasks(t)
    } finally { setLoading(false) }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      await tasksApi.update(taskId, { status: newStatus })
      setTasks(prev => prev.map(t => t.id === taskId ? {...t, status: newStatus} : t))
    } catch { toast.error('Failed to update task') }
  }

  async function handleDelete(taskId) {
    try {
      await tasksApi.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast.success('Task deleted')
    } catch { toast.error('Failed to delete task') }
  }

  function onDragStart(e, taskId) {
    setDragging(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDrop(e, status) {
    e.preventDefault()
    if (dragging) handleStatusChange(dragging, status)
    setDragging(null)
  }

  function openNewTask(status) {
    setNewStatus(status)
    setShowNew(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-brand-400" />
    </div>
  )

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{project?.emoji}</span>
          <div>
            <h1 className="text-lg font-semibold text-white">{project?.name}</h1>
            {project?.description && <p className="text-sm text-gray-400">{project.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-sm text-gray-400 mr-2">
            <span>{tasks.length} tasks</span>
            <span className="text-green-400">{tasks.filter(t => t.status === 'DONE').length} done</span>
          </div>
          <button onClick={() => openNewTask('TODO')} className="btn-primary">
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.key)
            return (
              <div key={col.key}
                className="w-72 flex flex-col"
                onDragOver={e => e.preventDefault()}
                onDrop={e => onDrop(e, col.key)}>

                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`w-2 h-2 rounded-full ${col.color}`} />
                  <span className="text-sm font-medium text-gray-300">{col.label}</span>
                  <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-1.5 py-0.5 ml-auto">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task list */}
                <div className="flex-1 space-y-2 min-h-20">
                  {colTasks.map(task => (
                    <div key={task.id} draggable
                      onDragStart={e => onDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing">
                      <TaskCard task={task} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                    </div>
                  ))}
                </div>

                {/* Add task button */}
                <button onClick={() => openNewTask(col.key)}
                  className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors text-sm w-full">
                  <Plus size={14} /> Add task
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {showNew && (
        <NewTaskModal
          projectId={parseInt(id)}
          defaultStatus={newStatus}
          onClose={() => setShowNew(false)}
          onCreated={task => { setTasks(prev => [task, ...prev]); setShowNew(false) }}
        />
      )}
    </div>
  )
}
