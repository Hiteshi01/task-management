import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projectsApi, tasksApi } from '../api'
import { Plus, Folder, CheckCircle2, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import NewProjectModal from '../components/projects/NewProjectModal'
import { format, isAfter, parseISO } from 'date-fns'

const PRIORITY_COLORS = {
  LOW: 'bg-gray-700 text-gray-300',
  MEDIUM: 'bg-blue-900/50 text-blue-300',
  HIGH: 'bg-amber-900/50 text-amber-300',
  URGENT: 'bg-red-900/50 text-red-300',
}

const STATUS_COLORS = {
  TODO: 'bg-gray-700 text-gray-300',
  IN_PROGRESS: 'bg-blue-900/50 text-blue-300',
  IN_REVIEW: 'bg-purple-900/50 text-purple-300',
  DONE: 'bg-green-900/50 text-green-300',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [myTasks, setMyTasks]   = useState([])
  const [showNew, setShowNew]   = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [{ data: p }, { data: t }] = await Promise.all([projectsApi.list(), tasksApi.my()])
      setProjects(p)
      setMyTasks(t)
    } finally { setLoading(false) }
  }

  const totalTasks = projects.reduce((s, p) => s + p.totalTasks, 0)
  const doneTasks  = projects.reduce((s, p) => s + p.doneTasks, 0)
  const overdue    = myTasks.filter(t => t.dueDate && t.status !== 'DONE' && !isAfter(parseISO(t.dueDate), new Date()))

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary">
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Projects', value: projects.length, icon: Folder, color: 'text-brand-400' },
          { label: 'Total Tasks', value: totalTasks, icon: CheckCircle2, color: 'text-teal-400' },
          { label: 'Completed', value: doneTasks, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Overdue', value: overdue.length, icon: Clock, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              <s.icon size={14} className={s.color} />
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Projects</h2>
            <span className="text-xs text-gray-500">{projects.length} total</span>
          </div>

          {projects.length === 0 ? (
            <div className="py-8 text-center">
              <Folder size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No projects yet</p>
              <button onClick={() => setShowNew(true)} className="mt-3 text-brand-400 text-sm hover:text-brand-300">
                Create your first project →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.slice(0, 6).map(p => {
                const pct = p.totalTasks > 0 ? Math.round((p.doneTasks / p.totalTasks) * 100) : 0
                return (
                  <Link key={p.id} to={`/projects/${p.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group">
                    <span className="text-xl">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-gray-700 rounded-full">
                          <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: p.color }} />
                        </div>
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">My Tasks</h2>
            <Link to="/my-tasks" className="text-xs text-brand-400 hover:text-brand-300">View all</Link>
          </div>

          {myTasks.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No tasks assigned to you</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myTasks.slice(0, 6).map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.status === 'DONE' ? 'bg-green-400' : t.status === 'IN_PROGRESS' ? 'bg-blue-400' : 'bg-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${t.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-200'}`}>{t.title}</p>
                    <p className="text-xs text-gray-500">{t.projectName}</p>
                  </div>
                  <span className={`badge ${PRIORITY_COLORS[t.priority]}`}>{t.priority.toLowerCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showNew && (
        <NewProjectModal onClose={() => setShowNew(false)} onCreated={() => { load(); setShowNew(false) }} />
      )}
    </div>
  )
}
