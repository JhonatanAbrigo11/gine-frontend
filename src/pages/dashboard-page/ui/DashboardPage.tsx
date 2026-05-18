import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/features/login/model/auth-context'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/widgets/button'
import axios from 'axios'
import { API_URL } from '@/shared/api/base'
import { 
  Users, 
  Calendar, 
  Activity, 
  ArrowRight,
  ClipboardList,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Heart,
  Stethoscope,
  FlaskConical,
  FileText,
  Loader2
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { cn } from '@/shared/lib/cn'

/* ==================================================
   DEFAULT FALLBACK DATA FOR CHARTS (IF BACKEND HAS 0 DATA)
   ================================================== */
const weekdays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
const getInitialWeeklyData = () => {
  const data = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    data.push({
      day: weekdays[d.getDay()],
      consultas: 0,
      examenes: 0
    })
  }
  return data
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const formatTimeAgo = (date: Date) => {
  const diffMs = new Date().getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHr = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'Hace un momento'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHr < 24) return `Hace ${diffHr} hora${diffHr > 1 ? 's' : ''}`
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  
  // Dashboard Metrics & Stats
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    completedTodayAppointments: 0,
    pendingOrders: 0,
    totalPrescriptions: 0,
    activePregnancies: 0
  })

  // Dynamic Lists
  const [appointmentsList, setAppointmentsList] = useState<any[]>([])
  const [recentActivitiesList, setRecentActivitiesList] = useState<any[]>([])
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>(getInitialWeeklyData())
  const [riskChartData, setRiskChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all independent collections concurrently in parallel
        const [
          patientsRes,
          appointmentsRes,
          ordersRes,
          prescriptionsRes,
          pregnanciesRes,
          consultationsRes
        ] = await Promise.all([
          axios.get(`${API_URL}/patients`),
          axios.get(`${API_URL}/appointments`),
          axios.get(`${API_URL}/medical-orders`),
          axios.get(`${API_URL}/prescriptions`),
          axios.get(`${API_URL}/pregnancies/active-list`),
          axios.get(`${API_URL}/consultations`)
        ])
        
        const patientsData = Array.isArray(patientsRes.data) ? patientsRes.data : (patientsRes.data.value || [])
        const totalPatients = patientsData.length

        const appointments = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : (appointmentsRes.data.value || [])
        const todayStr = new Date().toLocaleDateString('en-CA') // 'YYYY-MM-DD' in local timezone
        
        const todayAppointmentsList = appointments.filter((app: any) => app.date === todayStr)
        const todayAppointmentsCount = todayAppointmentsList.length
        const completedToday = todayAppointmentsList.filter((app: any) => 
          app.status?.toLowerCase() === 'completada' || app.status?.toLowerCase() === 'atendida'
        ).length

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.value || [])
        const pendingOrdersCount = orders.filter((o: any) => o.status?.toLowerCase() === 'pendiente').length

        const totalPrescriptions = prescriptionsRes.data.total ?? prescriptionsRes.data.data?.length ?? 0

        const activePregnanciesList = Array.isArray(pregnanciesRes.data) ? pregnanciesRes.data : (pregnanciesRes.data.value || [])
        const activePregnanciesCount = activePregnanciesList.length

        const consultations = Array.isArray(consultationsRes.data) ? consultationsRes.data : (consultationsRes.data.value || [])

        // Group weekly activity (consultations vs exams/orders by day of week)
        const weekdays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
        const last6Days = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          last6Days.push({
            dateStr: d.toISOString().split('T')[0],
            dayName: weekdays[d.getDay()],
            consultas: 0,
            examenes: 0
          })
        }

        last6Days.forEach(day => {
          day.consultas = consultations.filter((c: any) => {
            const rawDate = c.createdAt || c.date
            if (!rawDate) return false
            const cStr = typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString()
            const cDate = cStr.split('T')[0]
            return cDate === day.dateStr
          }).length
          day.examenes = orders.filter((o: any) => {
            const rawDate = o.createdAt || o.date
            if (!rawDate) return false
            const oStr = typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString()
            const oDate = oStr.split('T')[0]
            return oDate === day.dateStr
          }).length
        })

        // Always set the real weekly activity data from the database
        setWeeklyChartData(last6Days.map(d => ({
          day: d.dayName,
          consultas: d.consultas,
          examenes: d.examenes
        })))

        // Calculate Obstetric Risk Distribution Chart from actual active pregnancies
        if (activePregnanciesList.length > 0) {
          let lowRisk = 0 // sin_riesgo, bajo
          let medRisk = 0 // alto
          let highRisk = 0 // muy_alto

          activePregnanciesList.forEach((preg: any) => {
            const rl = preg.riskLevel?.toLowerCase() || ''
            if (rl === 'sin_riesgo' || rl === 'bajo') {
              lowRisk++
            } else if (rl === 'alto') {
              medRisk++
            } else if (rl === 'muy_alto') {
              highRisk++
            } else {
              lowRisk++
            }
          })

          const totalPregs = activePregnanciesList.length
          const riskDataCalculated = [
            { name: 'Sin Riesgo / Bajo', value: Math.round((lowRisk / totalPregs) * 100), color: '#10b981' },
            { name: 'Riesgo Medio / Alto', value: Math.round((medRisk / totalPregs) * 100), color: '#f59e0b' },
            { name: 'Riesgo Alto / Crítico', value: Math.round((highRisk / totalPregs) * 100), color: '#f43f5e' }
          ]
          setRiskChartData(riskDataCalculated.filter(r => r.value > 0))
        }

        setStats({
          totalPatients,
          todayAppointments: todayAppointmentsCount,
          completedTodayAppointments: completedToday,
          pendingOrders: pendingOrdersCount,
          totalPrescriptions,
          activePregnancies: activePregnanciesCount
        })

        // Sort today's appointments by hour chronologically
        const sortedTodayApps = todayAppointmentsList.sort((a: any, b: any) => a.time.localeCompare(b.time))
        setAppointmentsList(sortedTodayApps)

        // Compile Recent Activities
        const activities: any[] = []

        // Add prescriptions
        const prescriptionsList = prescriptionsRes.data.data || []
        prescriptionsList.forEach((pres: any) => {
          activities.push({
            id: pres.id,
            type: 'prescription',
            label: 'Receta Emitida',
            detail: `${pres.patientName} — Secuencial: ${pres.secuencial}`,
            date: new Date(pres.createdAt || pres.updatedAt),
            timeAgo: formatTimeAgo(new Date(pres.createdAt || pres.updatedAt)),
            iconType: 'prescription',
            color: 'bg-indigo-50 text-indigo-600'
          })
        })

        // Add patients
        const rawPatients = Array.isArray(patientsRes.data) ? patientsRes.data : (patientsRes.data.value || [])
        rawPatients.forEach((pat: any) => {
          activities.push({
            id: pat.id,
            type: 'patient',
            label: 'Paciente Registrada',
            detail: `${pat.nombres} ${pat.apellidos} — DNI/HC: ${pat.numeroDocumento}`,
            date: new Date(pat.createdAt || pat.fechaRegistro),
            timeAgo: formatTimeAgo(new Date(pat.createdAt || pat.fechaRegistro)),
            iconType: 'patient',
            color: 'bg-emerald-50 text-emerald-600'
          })
        })

        // Add consultations
        consultations.forEach((con: any) => {
          activities.push({
            id: con.id,
            type: 'consultation',
            label: 'Consulta Completada',
            detail: `${con.paciente || 'Paciente'} — Motivo: ${con.motivo || 'General'}`,
            date: new Date(con.createdAt),
            timeAgo: formatTimeAgo(new Date(con.createdAt)),
            iconType: 'consultation',
            color: 'bg-primary-50 text-primary-600'
          })
        })

        // Sort activities chronologically (newest first)
        const sortedActivities = activities
          .sort((a: any, b: any) => b.date.getTime() - a.date.getTime())
          .slice(0, 5)

        setRecentActivitiesList(sortedActivities)
        
      } catch (err) {
        console.error("Error loading dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-10"
      >
        {/* Header Superior */}
        <motion.header variants={itemVariants} className="flex flex-col gap-6 mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-12 bg-primary-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600/70">Centro de Inteligencia Clínica</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-clinical-900 mb-2">
              Panel de <span className="text-primary-700">Control</span>
            </h1>
            <p className="text-sm font-medium text-clinical-800/60">
              Resumen ejecutivo de hoy, <span className="text-primary-700 font-bold">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="secondary" onClick={() => navigate(ROUTES.agenda)} className="bg-white border-clinical-200 cursor-pointer">
                <Clock className="h-4 w-4 mr-2" /> Programar Cita
             </Button>
             <Button variant="primary" onClick={() => navigate(ROUTES.consultas)} className="shadow-lg shadow-primary-200 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" /> Nueva Consulta
             </Button>
          </div>
        </motion.header>

        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            <p className="text-sm font-bold text-clinical-500 uppercase tracking-widest">Sincronizando información en tiempo real...</p>
          </div>
        ) : (
          <>
            {/* KPIs Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10">
               <KPICard 
                 icon={<Users className="h-6 w-6" />}
                 label="Pacientes Totales"
                 value={stats.totalPatients.toLocaleString()}
                 trend="Activos"
                 trendType="up"
                 description="Registros en base de datos"
                 color="primary"
               />
               <KPICard 
                 icon={<Calendar className="h-6 w-6" />}
                 label="Citas para Hoy"
                 value={stats.todayAppointments.toString()}
                 trend={stats.completedTodayAppointments > 0 ? `+${stats.completedTodayAppointments}` : 'Hoy'}
                 trendType="up"
                 description={`${stats.completedTodayAppointments} atendidas`}
                 color="accent"
               />
               <KPICard 
                 icon={<FlaskConical className="h-6 w-6" />}
                 label="Órdenes Pendientes"
                 value={stats.pendingOrders.toString()}
                 trend="Pendientes"
                 trendType="down"
                 description="Exámenes médicos activos"
                 color="indigo"
               />
               <KPICard 
                 icon={<Heart className="h-6 w-6" />}
                 label="Gestantes Activas"
                 value={stats.activePregnancies.toString()}
                 trend="Monitoreos"
                 trendType="up"
                 description="Controles prenatales en curso"
                 color="emerald"
               />
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 mb-10">
               
               {/* Chart 1: Actividad Semanal */}
               <motion.div variants={itemVariants} className="lg:col-span-8 glass-card rounded-[2.5rem] border-white overflow-hidden flex flex-col">
                  <div className="px-8 py-6 border-b border-clinical-100/50 flex items-center justify-between">
                     <div>
                        <h3 className="text-lg font-bold text-clinical-900">Actividad del Historial</h3>
                        <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Consultas vs Órdenes Generadas</p>
                     </div>
                     <div className="flex items-center gap-4 text-[10px] font-bold uppercase">
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-500" /> Consultas</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-400" /> Órdenes</div>
                     </div>
                  </div>
                  <div className="p-8 h-[360px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyChartData}>
                           <defs>
                              <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#026fc7" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#026fc7" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis 
                             dataKey="day" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                             dy={10}
                           />
                           <YAxis 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                           />
                           <Tooltip 
                             contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                           />
                           <Area 
                             type="monotone" 
                             dataKey="consultas" 
                             stroke="#026fc7" 
                             strokeWidth={3}
                             fillOpacity={1} 
                             fill="url(#colorConsultas)" 
                           />
                           <Area 
                             type="monotone" 
                             dataKey="examenes" 
                             stroke="#f59e0b" 
                             strokeWidth={3}
                             fillOpacity={0}
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </motion.div>

               {/* Chart 2: Perfil de Riesgo Obstétrico */}
               <motion.div variants={itemVariants} className="lg:col-span-4 glass-card rounded-[2.5rem] border-white overflow-hidden flex flex-col">
                  <div className="px-8 py-6 border-b border-clinical-100/50">
                     <h3 className="text-lg font-bold text-clinical-900">Perfil de Riesgo Gestacional</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Distribución de Riesgos Activos</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-6">
                     <div className="h-[200px] w-full flex items-center justify-center">
                        {riskChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie
                                  data={riskChartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                   {riskChartData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                             </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-[10px] font-bold text-clinical-400 uppercase tracking-wider text-center">Sin monitoreos de embarazo registrados</div>
                        )}
                     </div>
                     <div className="w-full space-y-2.5 mt-4">
                        {riskChartData.map((item) => (
                          <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-clinical-50/50 border border-clinical-100/50">
                             <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[11px] font-bold text-clinical-900">{item.name}</span>
                             </div>
                             <span className="text-xs font-black text-clinical-900">{item.value}%</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* Bottom Section: Appointments & Activity */}
            <div className="grid gap-8 lg:grid-cols-2">
               
               {/* Próximas Citas */}
               <motion.section variants={itemVariants} className="glass-card rounded-[2.5rem] border-white overflow-hidden">
                  <div className="px-8 py-6 border-b border-clinical-100/50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-wider">Citas para Hoy</h3>
                     </div>
                     <Link to={ROUTES.agenda} className="text-xs font-bold text-primary-700 hover:underline">Gestionar Agenda</Link>
                  </div>
                  <div className="p-6 space-y-4">
                     {appointmentsList.length > 0 ? (
                        appointmentsList.map((cita, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white border border-clinical-100 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-50 transition-all group">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-clinical-50 flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                                    {cita.time}
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-clinical-900">{cita.patientName}</p>
                                    <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{cita.reason || 'Consulta de rutina'}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <span className={cn(
                                    "text-[9px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-1 border uppercase tracking-wider",
                                    cita.status?.toLowerCase() === 'completada' || cita.status?.toLowerCase() === 'atendida'
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-150"
                                      : "bg-amber-50 text-amber-600 border-amber-150"
                                 )}>
                                    {cita.status}
                                 </span>
                                 <p className="text-[9px] font-bold text-clinical-300">Edad: {cita.patientAge} Años</p>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-clinical-50 rounded-[2.5rem] bg-clinical-50/10 text-clinical-200">
                           <Calendar className="h-10 w-10 mb-4 opacity-20 text-clinical-400" />
                           <p className="text-sm font-bold uppercase tracking-wider text-center max-w-xs leading-relaxed px-4">No hay consultas agendadas para la fecha de hoy.</p>
                        </div>
                     )}
                  </div>
               </motion.section>

               {/* Actividad Reciente */}
               <motion.section variants={itemVariants} className="glass-card rounded-[2.5rem] border-white overflow-hidden">
                  <div className="px-8 py-6 border-b border-clinical-100/50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-wider">Actividad Reciente</h3>
                     </div>
                  </div>
                  <div className="p-6">
                     {recentActivitiesList.length > 0 ? (
                        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-clinical-100">
                           {recentActivitiesList.map((act, i) => (
                              <div key={i} className="relative flex items-start gap-4 pl-10">
                                 <div className={cn("absolute left-0 h-10 w-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm scale-75", act.color)}>
                                    {act.iconType === 'prescription' && <FileText className="h-4 w-4" />}
                                    {act.iconType === 'patient' && <Users className="h-4 w-4" />}
                                    {act.iconType === 'consultation' && <Stethoscope className="h-4 w-4" />}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                       <p className="text-xs font-black text-clinical-900">{act.label}</p>
                                       <span className="text-[10px] font-bold text-clinical-300">{act.timeAgo}</span>
                                    </div>
                                    <p className="text-xs font-medium text-clinical-500 truncate">{act.detail}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-clinical-50 rounded-[2.5rem] bg-clinical-50/10 text-clinical-200">
                           <Activity className="h-10 w-10 mb-4 opacity-20 text-clinical-400" />
                           <p className="text-sm font-bold uppercase tracking-wider text-center max-w-xs leading-relaxed px-4">No se ha registrado ninguna actividad médica reciente en el centro.</p>
                        </div>
                     )}
                     <Button variant="secondary" onClick={() => navigate(ROUTES.pacientes)} className="w-full mt-8 rounded-2xl border-clinical-100 h-12 text-xs cursor-pointer">
                        Ver Historial de Pacientes
                     </Button>
                  </div>
               </motion.section>

            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

/* ==================================================
   SUB-COMPONENTS
   ================================================== */

function KPICard({ icon, label, value, trend, trendType, description, color }: any) {
  const colors = {
    primary: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <motion.div variants={itemVariants} className="glass-card p-6 rounded-[2rem] border-white group hover:shadow-premium transition-all">
       <div className="flex items-start justify-between mb-4">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner", colors[color as keyof typeof colors])}>
             {icon}
          </div>
          <div className={cn(
            "flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight border uppercase",
            trendType === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-150" : "bg-rose-50 text-rose-600 border-rose-150"
          )}>
             {trendType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
             {trend}
          </div>
       </div>
       <p className="text-[11px] font-bold uppercase tracking-widest text-clinical-800/40 mb-1">{label}</p>
       <p className="text-4xl font-bold text-clinical-900 tracking-tight">{value}</p>
       <p className="text-[11px] text-clinical-800/60 font-medium mt-4 flex items-center gap-2">
          {description}
       </p>
    </motion.div>
  )
}
