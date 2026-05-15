import type { SiteConfig } from './types'

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'GineCare',
  brandTagline: 'Ginecología humana',
  logoUrl: '',

  heroImageUrl:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80',
  heroImageAlt: 'Profesional de la salud en un entorno clínico luminoso y acogedor',
  heroBadge: 'Ginecología basada en evidencia',
  heroTitle: 'Cuidado ginecológico cercano, respetuoso y moderno',
  heroDescription:
    'Acompañamiento en salud femenina: prevención, diagnóstico oportuno y planes personalizados, con un enfoque humano en cada etapa de la vida.',
  heroCaption: 'Ambientes pensados para tu tranquilidad y privacidad.',

  servicesTitle: 'Nuestros servicios',
  servicesSubtitle:
    'Un equipo que escucha, explica con claridad y diseña contigo el siguiente paso.',
  serviceCards: [
    {
      title: 'Consulta ginecológica',
      description:
        'Valoración integral, historia clínica detallada y recomendaciones personalizadas.',
    },
    {
      title: 'Prevención y tamizaje',
      description:
        'Pautas de cribado, vacunación y hábitos saludables adaptados a tu edad y contexto.',
    },
    {
      title: 'Seguimiento longitudinal',
      description:
        'Continuidad asistencial con espacio para preguntas, resultados y plan de cuidados.',
    },
  ],

  ctaTitle: '¿Lista para agendar o continuar tu proceso?',
  ctaDescription:
    'Accede al panel para gestionar próximos pasos. En esta demo el acceso es inmediato con tu correo.',

  footerNotice: 'GineCare · Demo frontend · Sin datos clínicos reales',
}
