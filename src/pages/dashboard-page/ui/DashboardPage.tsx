import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/features/login/model/auth-context'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/widgets/button'
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
  FlaskConical
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { cn } from '@/shared/lib/cn'

/* ==================================================
   MOCK DATA FOR CHARTS
   ================================================== */

const WEEKLY_DATA = [
  { day: 'Lun', consultas: 12, examenes: 8 },
  { day: 'Mar', consultas: 15, examenes: 10 },
  { day: 'Mie', consultas: 8, examenes: 12 },
  { day: 'Jue', consultas: 18, examenes: 15 },
  { day: 'Vie', consultas: 20, examenes: 18 },
  { day: 'Sab', consultas: 10, examenes: 5 },
]

const RISK_DATA = [
  { name: 'Riesgo Bajo', value: 65, color: '#10b981' }, // emerald-500
  { name: 'Riesgo Medio', value: 25, color: '#f59e0b' }, // amber-500
  { name: 'Riesgo Alto', value: 10, color: '#f43f5e' }, // rose-500
]

const REVENUE_DATA = [
  { month: 'Ene', value: 4500 },
  { month: 'Feb', value: 5200 },
  { month: 'Mar', value: 4800 },
  { month: 'Abr', value: 6100 },
  { month: 'May', value: 7500 },
]

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

export function DashboardPage() {
  const { user, logout } = useAuth()

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
             <Button variant="secondary" className="bg-white border-clinical-200">
                <Clock className="h-4 w-4 mr-2" /> Programar Cita
             </Button>
             <Button variant="primary" className="shadow-lg shadow-primary-200">
                <Plus className="h-4 w-4 mr-2" /> Nueva Consulta
             </Button>
          </div>
        </motion.header>

        {/* KPIs Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10">
           <KPICard 
             icon={<Users className="h-6 w-6" />}
             label="Pacientes Totales"
             value="1,248"
             trend="+12%"
             trendType="up"
             description="vs. mes anterior"
             color="primary"
           />
           <KPICard 
             icon={<Calendar className="h-6 w-6" />}
             label="Citas para Hoy"
             value="18"
             trend="+2"
             trendType="up"
             description="8 completadas"
             color="accent"
           />
           <KPICard 
             icon={<FlaskConical className="h-6 w-6" />}
             label="Órdenes Pendientes"
             value="34"
             trend="-5%"
             trendType="down"
             description="Optimización de flujo"
             color="indigo"
           />
           <KPICard 
             icon={<DollarSign className="h-6 w-6" />}
             label="Ingresos Mensuales"
             value="$7.5k"
             trend="+24%"
             trendType="up"
             description="Proyección superada"
             color="emerald"
           />
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 mb-10">
           
           {/* Chart 1: Actividad Semanal */}
           <motion.div variants={itemVariants} className="lg:col-span-8 glass-card rounded-[2.5rem] border-white overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-clinical-100/50 flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-bold text-clinical-900">Actividad Semanal</h3>
                    <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Consultas vs Exámenes</p>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-bold uppercase">
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-500" /> Consultas</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-400" /> Exámenes</div>
                 </div>
              </div>
              <div className="p-8 h-[360px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={WEEKLY_DATA}>
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

           {/* Chart 2: Riesgo de Pacientes */}
           <motion.div variants={itemVariants} className="lg:col-span-4 glass-card rounded-[2.5rem] border-white overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-clinical-100/50">
                 <h3 className="text-lg font-bold text-clinical-900">Perfil de Riesgo</h3>
                 <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Distribución de Población</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                 <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={RISK_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                             {RISK_DATA.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="w-full space-y-3 mt-4">
                    {RISK_DATA.map((item) => (
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
                    <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-wider">Citas Pendientes</h3>
                 </div>
                 <Link to={ROUTES.agenda} className="text-xs font-bold text-primary-700 hover:underline">Gestionar Agenda</Link>
              </div>
              <div className="p-6 space-y-4">
                 {[
                   { name: 'Ana García López', time: '14:30 PM', type: 'Control Prenatal', hc: '2026-001' },
                   { name: 'María Rodríguez', time: '15:15 PM', type: 'Ecografía 4D', hc: '2026-042' },
                   { name: 'Carla Jiménez', time: '16:00 PM', type: 'Papanicolaou', hc: '2026-055' },
                 ].map((cita, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white border border-clinical-100 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-50 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-clinical-50 flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                             {cita.time.split(':')[0]}
                          </div>
                          <div>
                             <p className="text-xs font-black text-clinical-900">{cita.name}</p>
                             <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{cita.type}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-black text-primary-700">{cita.time}</p>
                          <p className="text-[9px] font-bold text-clinical-300">HC: {cita.hc}</p>
                       </div>
                    </div>
                 ))}
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
                 <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-clinical-100">
                    {[
                      { icon: <Plus />, label: 'Nueva Orden', detail: 'Ana García - Lab. Hemograma', time: 'Hace 10 min', color: 'bg-primary-50 text-primary-600' },
                      { icon: <Heart />, label: 'Resultado Subido', detail: 'María Rodríguez - Eco Morfológica', time: 'Hace 45 min', color: 'bg-rose-50 text-rose-600' },
                      { icon: <Users />, label: 'Paciente Registrada', detail: 'Elena Vázquez - HC: 2026-088', time: 'Hace 2 horas', color: 'bg-indigo-50 text-indigo-600' },
                    ].map((act, i) => (
                       <div key={i} className="relative flex items-start gap-4 pl-10">
                          <div className={cn("absolute left-0 h-10 w-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm scale-75", act.color)}>
                             {act.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between mb-0.5">
                                <p className="text-xs font-black text-clinical-900">{act.label}</p>
                                <span className="text-[10px] font-bold text-clinical-300">{act.time}</span>
                             </div>
                             <p className="text-xs font-medium text-clinical-500 truncate">{act.detail}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 <Button variant="secondary" className="w-full mt-8 rounded-2xl border-clinical-100 h-12 text-xs">
                    Ver historial completo
                 </Button>
              </div>
           </motion.section>

        </div>
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
            "flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-black tracking-tight",
            trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
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
