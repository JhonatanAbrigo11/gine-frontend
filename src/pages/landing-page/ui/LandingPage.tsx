import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/features/login/model/auth-context'
import { motion } from 'framer-motion'
import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { ROUTES } from '@/shared/config/routes'
import { composeButtonClassName } from '@/widgets/button'
import { Card } from '@/widgets/card'
import { PageHeader } from '@/widgets/header'
import { 
  Stethoscope, 
  ShieldCheck, 
  CalendarDays, 
  ArrowRight,
  Sparkles,
  Heart
} from 'lucide-react'

const serviceIcons = [
  <Stethoscope key="a" className="h-6 w-6" />, 
  <ShieldCheck key="b" className="h-6 w-6" />, 
  <CalendarDays key="c" className="h-6 w-6" />
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export function LandingPage() {
  const { config } = useSiteConfig()
  const { user } = useAuth()

  if (user) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-clinical-50 selection:bg-primary-100 selection:text-primary-900">
      <PageHeader />

      <main id="contenido-principal" className="flex-grow">
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
          {/* Decorative background elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent-200/20 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center"
          >
            <div className="space-y-8 relative z-10">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-1.5 text-xs font-bold text-primary-700 ring-1 ring-primary-100 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-accent-400" aria-hidden />
                <span className="uppercase tracking-widest">{config.heroBadge}</span>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="font-display text-5xl font-bold leading-[1.1] text-clinical-900 sm:text-7xl tracking-tight">
                {config.heroTitle.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-primary-700 block" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </motion.h1>
              
              <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-clinical-800/70 font-medium">
                {config.heroDescription}
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link
                  to={ROUTES.login}
                  className={composeButtonClassName('primary', 'px-8 h-14 text-base shadow-xl shadow-primary-200 group no-underline')}
                >
                  Iniciar sesión
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#servicios"
                  className={composeButtonClassName('secondary', 'px-8 h-14 text-base no-underline')}
                >
                  Nuestros servicios
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6 pt-4 border-t border-primary-100/50 w-fit">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-primary-50 overflow-hidden shadow-sm">
                       <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold text-clinical-800/50 uppercase tracking-wider">
                  <span className="text-primary-700">+500</span> mujeres atendidas al año
                </div>
              </motion.div>
            </div>

            <motion.div 
              variants={fadeUp}
              className="relative lg:ml-auto"
            >
              <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl shadow-primary-900/10 ring-1 ring-white/50">
                <img
                  src={config.heroImageUrl}
                  alt={config.heroImageAlt}
                  className="aspect-[4/5] w-full object-cover lg:aspect-square"
                  width={1200}
                  height={900}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-primary-900/40 opacity-40" />
                <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-2xl border-white/20">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
                         <Heart className="h-4 w-4 fill-current" />
                      </div>
                      <p className="text-sm font-bold text-clinical-900">Consulta con tiempo real</p>
                   </div>
                   <p className="text-xs text-clinical-800/70 font-medium">
                     {config.heroCaption}
                   </p>
                </div>
              </div>
              
              {/* Floating element */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 -top-8 z-20 glass-card p-5 rounded-2xl border-white/40 hidden xl:block"
              >
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg">
                       <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-tighter text-primary-400">Cupo disponible</p>
                       <p className="text-sm font-bold text-clinical-900">Control prenatal · mañana</p>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="servicios" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 relative">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="font-display text-4xl font-bold tracking-tight text-clinical-900 sm:text-5xl mb-6">
              {config.servicesTitle}
            </h2>
            <div className="h-1.5 w-24 bg-accent-300 mx-auto rounded-full mb-6" />
            <p className="text-lg font-medium text-clinical-800/60 leading-relaxed">
              {config.servicesSubtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  title={config.serviceCards[i].title}
                  description={config.serviceCards[i].description}
                  icon={serviceIcons[i]}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-[3rem] bg-clinical-900 p-12 lg:p-20 shadow-2xl">
            <div className="absolute top-0 right-0 w-[40%] h-full bg-primary-600/10 pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                {config.ctaTitle}
              </h2>
              <p className="text-lg font-medium text-primary-100/70 mb-10 leading-relaxed">
                {config.ctaDescription}
              </p>
              <Link
                to={ROUTES.login}
                className={composeButtonClassName('primary', 'px-10 h-14 text-base bg-white text-primary-900 hover:bg-primary-50 no-underline')}
              >
                Entrar al panel médico
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary-100/30 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                 G
              </div>
              <span className="font-display text-lg font-bold text-clinical-900">{config.brandName}</span>
           </div>
           <p className="text-sm font-medium text-clinical-800/40">
             © {new Date().getFullYear()} {config.footerNotice} — Todos los derechos reservados.
           </p>
           <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-primary-700/60">
              <a href="#" className="hover:text-primary-700 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-primary-700 transition-colors">Términos</a>
           </div>
        </div>
      </footer>
    </div>
  )
}
