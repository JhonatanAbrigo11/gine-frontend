import { createServiceCard } from './service-card-defaults'
import type { SiteConfig } from './types'

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'GineCare',
  brandTagline: 'Ginecología y obstetricia con enfoque humano',

  logoUrl: '',

  heroImageUrl:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80',
  heroImageAlt: 'Médica ginecóloga conversando con paciente en consultorio luminoso',
  heroBadge: 'Sin prisas, sin tabúes, con evidencia',
  heroTitle: 'Salud femenina con calma y ciencia',
  heroDescription:
    'Consulta ginecológica, control prenatal, planificación familiar y tamizajes. Te escuchamos, te explicamos con claridad y armamos un plan contigo.',
  heroCaption:
    'Ambiente acogedor, confidencialidad real y tiempo de consulta para lo que de verdad te preocupa.',

  servicesTitle: 'Nuestros servicios',
  servicesSubtitle:
    'Atención integral en cada etapa de la vida: prevención, diagnóstico, embarazo y bienestar femenino.',
  serviceCards: [
    createServiceCard(0, {
      title: 'Servicio 1',
      description:
        'Chequeo anual, citología, ecografía pélvica, infecciones, dolor menstrual y menopausia.',
      icon: 'stethoscope',
    }),
    createServiceCard(1, {
      title: 'Servicio 2',
      description:
        'Seguimiento del embarazo, ecografías, laboratorios y plan de parto con acompañamiento continuo.',
      icon: 'baby',
    }),
    createServiceCard(2, {
      title: 'Servicio 3',
      description:
        'Anticoncepción, búsqueda de embarazo y orientación según su edad, salud y proyectos de vida.',
      icon: 'heart',
    }),
  ],

  ctaTitle: '¿Agendamos tu próxima cita?',
  ctaDescription:
    'Accede al panel médico para explorar agenda, pacientes y consultas.',

  footerNotice: 'GineCare · Plataforma demo · No reemplaza atención médica presencial',
}
