export interface Service {
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  repo?: string;
  base_price: number;
  complexity: number;
  estimated_days?: number;
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
    base_price: 1500,
    complexity: 1.3,
    estimated_days: 14,
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
    base_price: 2500,
    complexity: 1.6,
    estimated_days: 21,
  },
  {
    slug: 'analise-bi',
    name: { pt: 'Análise de Dados / BI', en: 'Data Analysis / BI', es: 'Análisis de Datos / BI' },
    description: {
      pt: 'Análise exploratória e relatórios de inteligência.',
      en: 'Exploratory analysis and intelligence reports.',
      es: 'Análisis exploratorio e informes de inteligencia.',
    },
    base_price: 1200,
    complexity: 1.3,
    estimated_days: 10,
  },
  {
    slug: 'automacao',
    name: { pt: 'Automação / Pipeline', en: 'Automation / Pipeline', es: 'Automatización / Pipeline' },
    description: {
      pt: 'Pipeline de dados e automação de processos.',
      en: 'Data pipeline and process automation.',
      es: 'Pipeline de datos y automatización de procesos.',
    },
    base_price: 1800,
    complexity: 1.3,
    estimated_days: 12,
  },
];
