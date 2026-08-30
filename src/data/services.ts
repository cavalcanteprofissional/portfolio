export interface Service {
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  repo?: string;
  active?: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: 'dashboard',
    name: { pt: 'Dashboard Interativo', en: 'Interactive Dashboard', es: 'Dashboard Interactivo' },
    description: {
      pt: 'Dashboard com visualizações e KPIs sob medida.',
      en: 'Custom dashboard with visualizations and KPIs.',
      es: 'Dashboard con visualizaciones y KPIs a medida.',
    },
    repo: 'labgas-manager',
  },
  {
    slug: 'chatbot-ia',
    name: { pt: 'Chatbot IA (RAG)', en: 'AI Chatbot (RAG)', es: 'Chatbot IA (RAG)' },
    description: {
      pt: 'Chatbot com RAG para responder sobre sua base de conhecimento.',
      en: 'RAG chatbot answering from your knowledge base.',
      es: 'Chatbot RAG que responde desde tu base de conocimiento.',
    },
    repo: 'chatbot-oficina',
  },
  {
    slug: 'analise-bi',
    name: { pt: 'Análise de Dados / BI', en: 'Data Analysis / BI', es: 'Análisis de Datos / BI' },
    description: {
      pt: 'Análise exploratória e relatórios de inteligência.',
      en: 'Exploratory analysis and intelligence reports.',
      es: 'Análisis exploratorio e informes de inteligencia.',
    },
  },
  {
    slug: 'automacao',
    name: { pt: 'Automação / Pipeline', en: 'Automation / Pipeline', es: 'Automatización / Pipeline' },
    description: {
      pt: 'Pipeline de dados e automação de processos.',
      en: 'Data pipeline and process automation.',
      es: 'Pipeline de datos y automatización de procesos.',
    },
  },
];
