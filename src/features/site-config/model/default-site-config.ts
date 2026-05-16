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
    'Consulta ginecológica, control prenatal, planificación familiar y tamizajes. Te escuchamos, te explicamos con claridad y armamos un plan contigo — sí, también para esas dudas que Google no debería responder.',
  heroCaption:
    'Ambiente acogedor, confidencialidad real y tiempo de consulta para lo que de verdad te preocupa.',

  servicesTitle: '¿En qué te acompañamos?',
  servicesSubtitle:
    'Prevención, diagnóstico y seguimiento en cada etapa: adolescencia, fertilidad, embarazo y menopausia. Cero lenguaje médico innecesario.',
  serviceCards: [
    {
      title: 'Ginecología general',
      description:
        'Chequeo anual, citología, ecografía pélvica, infecciones, dolor menstrual y menopausia. Cada estudio con contexto, no solo con resultados en papel.',
    },
    {
      title: 'Control prenatal',
      description:
        'Seguimiento del embarazo, ecografías, laboratorios y plan de parto. Tu barriga avanza; nosotros llevamos el calendario y las alertas tempranas.',
    },
    {
      title: 'Planificación y fertilidad',
      description:
        'Anticoncepción, búsqueda de embarazo, FUM y orientación en pareja. Sin sermones: opciones reales según tu edad, salud y proyectos de vida.',
    },
  ],

  ctaTitle: '¿Agendamos tu próxima cita?',
  ctaDescription:
    'Accede al panel médico de la demo para explorar agenda, pacientes y consultas. En este entorno el acceso es inmediato con tu correo — ideal para probar el flujo clínico.',

  footerNotice: 'GineCare · Plataforma demo · No reemplaza atención médica presencial',
}
