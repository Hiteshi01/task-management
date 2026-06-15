import { useState } from 'react'
import { format, parseISO, isPast } from 'date-fns'
import { Trash2, Calendar, ChevronDown } from 'lucide-react'

const PRIORITY_STYLE = {
  LOW:    'bg-gray-700/50 text-gray-400',
  MEDIUM: 'bg-blue-900/40 text-blue-300',
  HIGH:   'bg-amber-900/40 text-amber-300',
  URGENT: 'bg-red-900/40 text-red-300',
}

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
const STATUS_LABELS  = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' }
const STATUS_COLORS  = {
  TODO: 'text-gray-400', IN_PROGRESS: 'text-blue-400',
  IN_REVIEW: 'text-purple-400', DONE: 'text-green-400'
}

export default function TaskCard({ task, onDelete, onStatusChange, showProject }) {
  const [showMenu, setShowMenu]   = useState(false)
  const [statusDrop, setStatusDrop] = useState(false)
  const overdue = task.dueDate && task.status !== 'DONE' && isPast(parseISO(task.dueDate))

  return (
    <div className="card p-3 hover:border-gray-700 transition-all group relative">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-100'}`}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`badge ${PRIORITY_STYLE[task.priority]}`}>
              {task.priority.toLowerCase()}
            </span>

            {/* Status selector */}
            <div className="relative">
              <button onClick={() => setStatusDrop(!statusDrop)}
                className={`badge bg-gray-800 hover:bg-gray-700 transition-colors flex items-center gap-1 ${STATUS_COLORS[task.status]}`}>
                {STATUS_LABELS[task.status]}
                <ChevronDown size={10} />
              </button>
              {statusDrop && (
                <div className="absolute top-6 left-0 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-32">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => { onStatusChange(task.id, s); setStatusDrop(false) }}
                      className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors ${STATUS_COLORS[s]}`}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-gray-500'}`}>
                <Calendar size={10} />
                {format(parseISO(task.dueDate), 'MMM d')}
                {overdue && ' · Overdue'}
              </span>
            )}

            {showProject && (
              <span className="text-xs text-gray-600">{task.projectName}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {task.assigneeName && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{ background: task.assigneeColor || '#6366f1' }}
              title={task.assigneeName}>
              {task.assigneeName.charAt(0).toUpperCase()}
            </div>
          )}
          <button onClick={() => onDelete(task.id)}
            className="p-1 text-gray-600 hover:text-red-400 transition-colors rounded">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Click outside to close status dropdown */}
      {statusDrop && <div className="fixed inset-0 z-10" onClick={() => setStatusDrop(false)} />}
    </div>
  )
}
