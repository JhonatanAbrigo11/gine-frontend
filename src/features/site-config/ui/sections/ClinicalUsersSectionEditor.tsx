import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { 
  UserPlus, 
  Edit2, 
  Key, 
  ShieldCheck, 
  XCircle, 
  Ban,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { ConfigBlock, ConfigCanvas } from '@/features/site-config/ui/molecules/config-editor-primitives'
import { Button } from '@/widgets/button'

type UserData = {
  id: string
  username: string
  email: string
  nombres?: string
  apellidos?: string
  status: string
  createdAt: string
}

export function ClinicalUsersSectionEditor() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  // Modals visibility
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Form states
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  
  // Create / Edit User Form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Activo')
  const [formLoading, setFormLoading] = useState(false)

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://127.0.0.1:3001/api/users')
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
      toast.error('Error al cargar la lista de usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle open create modal
  const handleOpenCreate = () => {
    setUsername('')
    setEmail('')
    setNombres('')
    setApellidos('')
    setPassword('')
    setStatus('Activo')
    setShowCreateModal(true)
  }

  // Handle open edit modal
  const handleOpenEdit = (user: UserData) => {
    setSelectedUser(user)
    setUsername(user.username)
    setEmail(user.email)
    setNombres(user.nombres || '')
    setApellidos(user.apellidos || '')
    setStatus(user.status)
    setShowEditModal(true)
  }

  // Handle open change password modal
  const handleOpenPassword = (user: UserData) => {
    setSelectedUser(user)
    setPassword('')
    setShowPasswordModal(true)
  }

  // Handle Toggle status directly (Suspend / Activate)
  const handleToggleStatus = async (user: UserData) => {
    const nextStatus = user.status === 'Activo' ? 'Suspendido' : 'Activo'
    try {
      await axios.put(`http://127.0.0.1:3001/api/users/${user.id}`, {
        username: user.username,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        status: nextStatus
      })
      toast.success(nextStatus === 'Suspendido' ? 'Usuario suspendido' : 'Usuario activado')
      fetchUsers()
    } catch (err: any) {
      console.error('Error toggling user status:', err)
      const msg = err.response?.data?.error || 'Error al cambiar estado'
      toast.error(msg)
    }
  }

  // Handle Submit Create
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('Nombre de usuario, correo y contraseña son obligatorios')
      return
    }

    try {
      setFormLoading(true)
      await axios.post('http://127.0.0.1:3001/api/users', {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        nombres: nombres.trim() || undefined,
        apellidos: apellidos.trim() || undefined
      })
      toast.success('Usuario registrado correctamente')
      setShowCreateModal(false)
      fetchUsers()
    } catch (err: any) {
      console.error('Error creating user:', err)
      const msg = err.response?.data?.error || 'Error al registrar usuario'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  // Handle Submit Edit
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    if (!username.trim() || !email.trim()) {
      toast.error('Nombre de usuario y correo son obligatorios')
      return
    }

    try {
      setFormLoading(true)
      await axios.put(`http://127.0.0.1:3001/api/users/${selectedUser.id}`, {
        username: username.trim(),
        email: email.trim(),
        nombres: nombres.trim() || undefined,
        apellidos: apellidos.trim() || undefined,
        status
      })
      toast.success('Usuario actualizado correctamente')
      setShowEditModal(false)
      fetchUsers()
    } catch (err: any) {
      console.error('Error updating user:', err)
      const msg = err.response?.data?.error || 'Error al actualizar usuario'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  // Handle Submit Password
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    if (!password.trim() || password.trim().length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres')
      return
    }

    try {
      setFormLoading(true)
      await axios.patch(`http://127.0.0.1:3001/api/users/${selectedUser.id}/password`, {
        password: password.trim()
      })
      toast.success('Contraseña actualizada correctamente')
      setShowPasswordModal(false)
      fetchUsers()
    } catch (err: any) {
      console.error('Error updating password:', err)
      const msg = err.response?.data?.error || 'Error al cambiar contraseña'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <ConfigCanvas>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs font-black text-clinical-900 uppercase tracking-wide">Usuarios Activos</h4>
          <p className="text-[11px] text-clinical-450 font-medium">Gestione los accesos y roles del personal clínico.</p>
        </div>
        <Button 
          type="button" 
          variant="primary" 
          onClick={handleOpenCreate}
          className="h-10 rounded-xl px-4 text-xs font-bold shadow-md shadow-primary-200/50 flex items-center gap-1.5"
        >
          <UserPlus className="h-4 w-4" />
          Registrar Usuario
        </Button>
      </div>

      <ConfigBlock padding="none" className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm font-medium text-clinical-400 flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
            <span>Cargando lista de usuarios...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm font-medium text-clinical-400">
            No se encontraron usuarios en el sistema.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-clinical-100 bg-clinical-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-clinical-450 uppercase tracking-widest">Usuario</th>
                  <th className="px-6 py-4 text-[10px] font-black text-clinical-450 uppercase tracking-widest">Contacto</th>
                  <th className="px-6 py-4 text-[10px] font-black text-clinical-450 uppercase tracking-widest text-center">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-clinical-450 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clinical-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-primary-50/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-accent-100 text-accent-700 font-bold flex items-center justify-center text-sm shadow-sm border border-white shrink-0">
                          {(user.nombres?.[0] || user.username[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-clinical-900 text-sm leading-none mb-1">
                            {user.nombres ? `${user.nombres} ${user.apellidos || ''}`.trim() : 'Sin Nombre'}
                          </p>
                          <p className="text-xs font-semibold text-clinical-450">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-clinical-900">{user.email}</p>
                      <p className="text-[10px] font-semibold text-clinical-400">
                        Creado: {new Date(user.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                        user.status === 'Activo' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                          : 'bg-rose-50 text-rose-700 border-rose-150'
                      }`}>
                        <span className={`h-1 w-1 rounded-full ${user.status === 'Activo' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="h-8 w-8 rounded-lg text-clinical-450 hover:text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all"
                          title="Editar detalles del usuario"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenPassword(user)}
                          className="h-8 w-8 rounded-lg text-clinical-450 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-all"
                          title="Cambiar contraseña"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                            user.status === 'Activo' 
                              ? 'text-clinical-400 hover:text-rose-600 hover:bg-rose-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={user.status === 'Activo' ? 'Suspender usuario' : 'Activar usuario'}
                        >
                          {user.status === 'Activo' ? <Ban className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ConfigBlock>

      {/* CREATE USER MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-white">
              <div className="p-5 border-b border-primary-50 flex items-center justify-between bg-primary-50/30">
                <div>
                  <h3 className="text-md font-bold text-clinical-900 tracking-tight">Registrar Nuevo <span className="text-primary-600">Usuario</span></h3>
                  <p className="text-[9px] font-bold text-clinical-800/40 uppercase tracking-widest">Rellene los datos de acceso seguro</p>
                </div>
                <button type="button" onClick={() => setShowCreateModal(false)} className="h-8 w-8 rounded-xl hover:bg-rose-50 flex items-center justify-center text-clinical-400 hover:text-rose-500 transition-all"><XCircle className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmitCreate} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Nombres</label>
                    <input 
                      type="text" 
                      value={nombres} 
                      onChange={e => setNombres(e.target.value)} 
                      placeholder="Ej: Wilson"
                      className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Apellidos</label>
                    <input 
                      type="text" 
                      value={apellidos} 
                      onChange={e => setApellidos(e.target.value)} 
                      placeholder="Ej: Mora"
                      className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Nombre de Usuario *</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="Ej: dr-mora"
                    className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="doctor@gineclinic.com"
                    className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Contraseña *</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required
                  />
                </div>

                <div className="px-0 pt-4 border-t border-primary-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 text-[9px] font-black text-clinical-400 uppercase tracking-widest hover:text-rose-500 transition-all">Cancelar</button>
                  <Button type="submit" variant="primary" disabled={formLoading} className="rounded-xl h-10 px-8 shadow-lg shadow-primary-200 text-xs">
                    {formLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Registrar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT USER DETAILS MODAL */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-white">
              <div className="p-5 border-b border-primary-50 flex items-center justify-between bg-primary-50/30">
                <div>
                  <h3 className="text-md font-bold text-clinical-900 tracking-tight">Editar <span className="text-primary-600">Usuario</span></h3>
                  <p className="text-[9px] font-bold text-clinical-800/40 uppercase tracking-widest">Actualice los datos personales y estado</p>
                </div>
                <button type="button" onClick={() => setShowEditModal(false)} className="h-8 w-8 rounded-xl hover:bg-rose-50 flex items-center justify-center text-clinical-400 hover:text-rose-500 transition-all"><XCircle className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Nombres</label>
                    <input 
                      type="text" 
                      value={nombres} 
                      onChange={e => setNombres(e.target.value)} 
                      className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Apellidos</label>
                    <input 
                      type="text" 
                      value={apellidos} 
                      onChange={e => setApellidos(e.target.value)} 
                      className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Nombre de Usuario *</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Estado de Acceso</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)} 
                    className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                  >
                    <option value="Activo">Activo — Habilitado para ingresar</option>
                    <option value="Suspendido">Suspendido — Denegar acceso</option>
                  </select>
                </div>

                <div className="px-0 pt-4 border-t border-primary-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-6 text-[9px] font-black text-clinical-400 uppercase tracking-widest hover:text-rose-500 transition-all">Cancelar</button>
                  <Button type="submit" variant="primary" disabled={formLoading} className="rounded-xl h-10 px-8 shadow-lg shadow-primary-200 text-xs">
                    {formLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && selectedUser && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPasswordModal(false)} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-white">
              <div className="p-5 border-b border-primary-50 flex items-center justify-between bg-primary-50/30">
                <div>
                  <h3 className="text-md font-bold text-clinical-900 tracking-tight">Cambiar <span className="text-primary-600">Contraseña</span></h3>
                  <p className="text-[9px] font-bold text-clinical-800/40 uppercase tracking-widest">Usuario: @{selectedUser.username}</p>
                </div>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="h-8 w-8 rounded-xl hover:bg-rose-50 flex items-center justify-center text-clinical-400 hover:text-rose-500 transition-all"><XCircle className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmitPassword} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Mínimo 4 caracteres..."
                    className="w-full h-11 px-4 bg-clinical-50/80 border border-primary-100/30 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required
                  />
                </div>

                <div className="px-0 pt-4 border-t border-primary-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="px-6 text-[9px] font-black text-clinical-400 uppercase tracking-widest hover:text-rose-500 transition-all">Cancelar</button>
                  <Button type="submit" variant="primary" disabled={formLoading} className="rounded-xl h-10 px-8 shadow-lg shadow-primary-200 text-xs">
                    {formLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Actualizar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfigCanvas>
  )
}
