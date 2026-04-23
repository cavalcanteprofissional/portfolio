import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github } from 'lucide-react';
import projectsData from '../data/projects.json';
import {
  TrendingUp,
  Bot,
  Eye,
  Database,
  Brain,
  PieChart,
  HelpCircle,
  Building2,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'chart-line': TrendingUp,
  robot: Bot,
  eye: Eye,
  database: Database,
  brain: Brain,
  'pie-chart': PieChart,
  'help-circle': HelpCircle,
  building: Building2,
};

interface ProjectCardProps {
  project: (typeof projectsData.projects)[0];
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const { t } = useTranslation();
  const Icon = iconMap[project.icon] || Database;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <motion.div
        className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm h-full flex flex-col"
        whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-10 h-10 text-primary" />
          </motion.div>
          {project.featured && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
              {t('portfolio.featured')}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {t(project.titleKey)}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 flex-1">
            {t(project.descriptionKey)}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors touch-manipulation"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-4 h-4" />
              {t('buttons.demo')}
            </motion.a>
            <motion.a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors touch-manipulation"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-4 h-4" />
              {t('buttons.code')}
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Portfolio() {
  const { t } = useTranslation();
  const { projects } = projectsData;

  return (
    <section id="portfolio" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('sections.portfolio')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('portfolio.subtitle')}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}