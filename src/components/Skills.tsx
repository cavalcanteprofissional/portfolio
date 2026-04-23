import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { Code, Brain, Eye, Wrench, Megaphone, Network, FileText, List, ChevronDown } from 'lucide-react';

const skillCategories = [
  {
    id: 'languages',
    titleKey: 'skills.languages',
    icon: 'code',
    skills: [
      'Python',
      'SQL',
      'JavaScript',
      'HTML/CSS',
      'TypeScript',
      'Java',
      'C#',
      'C++',
      'PHP',
      'Scikit-learn',
      'Pandas',
      'Geopandas',
      'Django',
      'Plotly',
      'Matplotlib',
      'Seaborn',
      'NumPy',
      'OpenCV',
      'PyTorch',
      'NLTK',
    ],
  },
  {
    id: 'ml',
    titleKey: 'skills.ml',
    icon: 'brain',
    skills: [
      'Random Forest',
      'XGBoost',
      'LightGBM',
      'Gradient Boosting',
      'CatBoost',
      'AdaBoost',
      'Extra Trees',
      'Regressão Linear',
      'Ridge/Lasso',
      'Elastic Net',
      'KNN',
      'SVR',
      'MLP',
      'NLP',
      'Word2Vec',
      'TF-IDF',
      'Transformers',
    ],
  },
  {
    id: 'dl',
    titleKey: 'skills.dl',
    icon: 'eye',
    skills: ['TensorFlow/Keras', 'PyTorch', 'DNNs', 'CNNs', 'RNNs/LSTMs', 'YOLO', 'OpenCV', 'GNU Octave'],
  },
  {
    id: 'platforms',
    titleKey: 'skills.platforms',
    icon: 'tools',
    skills: [
      'Git/GitHub',
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'GCP',
      'Oracle Cloud',
      'Tableau',
      'Power BI',
      'Looker',
      'Streamlit',
      'Jupyter',
      'VS Code',
      'Vercel',
      'Supabase',
      'Back4App',
    ],
  },
  {
    id: 'marketing',
    titleKey: 'skills.marketing',
    icon: 'bullhorn',
    skills: [
      'Illustrator',
      'Photoshop',
      'InDesign',
      'Premiere',
      'After Effects',
      'Adobe XD',
      'Audition',
      'LeadLovers',
      'MLabs',
      'Mailchimp',
      'RD Station',
      'WordPress',
      'OBS',
      'Canva',
      'CapCut',
      'CorelDraw',
      'Sony Vegas',
      'Facebook Ads',
      'Google Analytics',
      'Google Ads',
      'SEO/SEM',
    ],
  },
  {
    id: 'tech',
    titleKey: 'skills.tech',
    icon: 'network-wired',
    skills: ['TeamViewer', 'AnyDesk', 'Grafana', 'Zabbix', 'TOTVS', 'COBIT', 'ITIL', 'CCNA', 'TCP/IP', 'Wi-Fi', 'Servidores'],
  },
  {
    id: 'agile',
    titleKey: 'skills.agile',
    icon: 'tasks',
    skills: ['Scrum', 'Kanban', 'Sprint', 'Trello', 'Asana', 'Jira', 'Metodologias Ágeis'],
  },
  {
    id: 'office',
    titleKey: 'skills.office',
    icon: 'file-alt',
    skills: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Power BI', 'SharePoint', 'Office 365'],
  },
];

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  brain: Brain,
  eye: Eye,
  tools: Wrench,
  bullhorn: Megaphone,
  'network-wired': Network,
  'file-alt': FileText,
  tasks: List,
};

const softSkills = [
  { key: 'skills.communication', value: 'Comunicação' },
  { key: 'skills.teamwork', value: 'Trabalho em Equipe' },
  { key: 'skills.problem-solving', value: 'Resolução de Problemas' },
  { key: 'skills.adaptability', value: 'Adaptabilidade' },
  { key: 'skills.time-management', value: 'Gestão de Tempo' },
  { key: 'skills.critical-thinking', value: 'Pensamento Crítico' },
  { key: 'skills.creativity', value: 'Criatividade' },
];

export function Skills() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  return (
    <section id="skills" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}>
            {t('sections.skills')}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-blue mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {skillCategories.map((category, index) => {
            const IconComponent = iconComponents[category.icon] || Code;
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/80 backdrop-blur-sm rounded-soft-xl border border-border/30 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-gradient-blue text-white">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-left">{t(category.titleKey)}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => (
                            <motion.span
                              key={skill}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground text-xs sm:text-sm hover:bg-gradient-blue hover:text-white transition-colors cursor-default"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/80 backdrop-blur-sm rounded-soft-xl border border-border/30 p-6 sm:p-8 lg:p-10 shadow-soft hover:shadow-soft-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-full bg-gradient-blue text-white">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold">{t('skills.soft')}</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {softSkills.map((skill, index) => (
              <motion.span
                key={skill.key}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2.5 rounded-full bg-secondary/50 text-sm font-medium hover:bg-gradient-blue hover:text-white transition-colors cursor-default"
              >
                {t(skill.key)}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}