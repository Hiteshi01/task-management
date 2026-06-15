import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { projectsApi } from '../../api'
import {
  LayoutDashboard, CheckSquare, FolderKanban, Plus,
  LogOut, ChevronRight, Loader2
} from 'lucide-react'
import NewProjectModal from '../projects/NewProjectModal'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects]     = useState([])
  const [showNew, setShowNew]       = useState(false)
  const [loading, setLoading]       = useState(true)
  const [collapsed, setCollapsed]   = useState(false)

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    try {
      const { data } = await projectsApi.list()
      setProjects(data)
    } finally { setLoading(false) }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U'

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckSquare size={16} className="text-white" />
          </div>
          {!collapsed && <span className="font-semibold text-white tracking-tight">TaskFlow</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <NavLink to="/dashboard" className={({isActive}) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              isActive ? 'bg-brand-500/10 text-brand-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`
          }>
            <LayoutDashboard size={16} className="flex-shrink-0" />
            {!collapsed && 'Dashboard'}
          </NavLink>

          <NavLink to="/my-tasks" className={({isActive}) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              isActive ? 'bg-brand-500/10 text-brand-400 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`
          }>
            <CheckSquare size={16} className="flex-shrink-0" />
            {!collapsed && 'My Tasks'}
          </NavLink>

          {!collapsed && (
            <div className="pt-4">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</span>
                <button onClick={() => setShowNew(true)}
                  className="text-gray-500 hover:text-brand-400 transition-colors">
                  <Plus size={14} />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-4"><Loader2 size={16} className="animate-spin text-gray-600" /></div>
              ) : projects.length === 0 ? (
                <p className="px-3 text-xs text-gray-600 py-2">No projects yet</p>
              ) : (
                projects.map(p => (
                  <NavLink key={p.id} to={`/projects/${p.id}`} className={({isActive}) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive ? 'bg-gray-800 text-gray-100' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`
                  }>
                    <span className="text-base leading-none">{p.emoji}</span>
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto text-xs text-gray-600">{p.totalTasks}</span>
                  </NavLink>
                ))
              )}
            </div>
          )}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
              style={{ background: user?.avatarColor || '#6366f1' }}>
              {initials}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.username}</p>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors">
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet context={{ refreshProjects: fetchProjects }} />
      </main>

      {showNew && (
        <NewProjectModal
          onClose={() => setShowNew(false)}
          onCreated={() => { fetchProjects(); setShowNew(false) }}
        />
      )}
    </div>
  )
}
