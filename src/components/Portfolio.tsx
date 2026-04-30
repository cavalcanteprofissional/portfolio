import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/themeStore';
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
  Map,
  Wrench,
  Video,
  LineChart,
  FlaskConical,
  TestTube,
  Newspaper,
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
  flask: FlaskConical,
  testtube: TestTube,
  map: Map,
  wrench: Wrench,
  video: Video,
  linechart: LineChart,
  newspaper: Newspaper,
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
        className="bg-card/80 backdrop-blur-sm rounded-soft-xl overflow-hidden border border-border/30 h-full flex flex-col shadow-soft hover:shadow-soft-lg transition-all"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-44 bg-gradient-blue-light dark:bg-gradient-blue-dark flex items-center justify-center overflow-hidden">
          <motion.div
            className="w-18 h-18 rounded-soft-xl bg-white/90 dark:bg-white/10 shadow-lg flex items-center justify-center backdrop-blur-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-9 h-9 text-primary" />
          </motion.div>
          {project.featured && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-blue text-white text-xs font-semibold">
              {t('portfolio.featured')}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col">
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
                className="px-3 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-3 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium">
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-blue text-white text-sm font-medium hover:opacity-90 transition-opacity touch-manipulation"
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border-2 border-border/50 bg-card/50 text-sm font-medium hover:border-primary/30 hover:shadow-soft transition-all touch-manipulation"
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
  const { theme } = useThemeStore();
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
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}>
            {t('sections.portfolio')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('portfolio.subtitle')}
          </p>
          <div className="w-24 h-1.5 bg-gradient-blue mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}