import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useThemeStore } from '../stores/themeStore';
import {
  FaPython,
  FaJs,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiPostgresql,
  SiSupabase,
  SiStreamlit,
  SiJupyter,
  SiFlask,
  SiFastapi,
  SiLangchain,
  SiHuggingface,
  SiOpencv,
  SiPlotly,
  SiGithubactions,
  SiVite,
  SiVercel,
} from 'react-icons/si';

interface TechStackItem {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
}

interface TechStackGroup {
  id: string;
  titleKey: string;
  items: TechStackItem[];
}

const techStacks: TechStackGroup[] = [
  {
    id: 'languages',
    titleKey: 'techstack.groups.languages',
    items: [
      { icon: FaPython, name: 'Python' },
      { icon: SiTypescript, name: 'TypeScript' },
      { icon: FaJs, name: 'JavaScript' },
    ],
  },
  {
    id: 'ai',
    titleKey: 'techstack.groups.ai',
    items: [
      { icon: SiPytorch, name: 'PyTorch' },
      { icon: SiTensorflow, name: 'TensorFlow' },
      { icon: SiScikitlearn, name: 'Scikit-learn' },
      { icon: SiHuggingface, name: 'Hugging Face' },
      { icon: SiLangchain, name: 'LangChain' },
      { icon: SiOpencv, name: 'OpenCV' },
    ],
  },
  {
    id: 'data',
    titleKey: 'techstack.groups.data',
    items: [
      { icon: SiPandas, name: 'Pandas' },
      { icon: SiNumpy, name: 'NumPy' },
      { icon: SiJupyter, name: 'Jupyter' },
      { icon: SiPlotly, name: 'Plotly' },
      { icon: SiStreamlit, name: 'Streamlit' },
    ],
  },
  {
    id: 'frontend',
    titleKey: 'techstack.groups.frontend',
    items: [
      { icon: FaReact, name: 'React' },
      { icon: SiNextdotjs, name: 'Next.js' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
      { icon: SiVite, name: 'Vite' },
    ],
  },
  {
    id: 'backend',
    titleKey: 'techstack.groups.backend',
    items: [
      { icon: FaNodeJs, name: 'Node.js' },
      { icon: SiFlask, name: 'Flask' },
      { icon: SiFastapi, name: 'FastAPI' },
      { icon: SiPostgresql, name: 'PostgreSQL' },
      { icon: SiSupabase, name: 'Supabase' },
    ],
  },
  {
    id: 'devops',
    titleKey: 'techstack.groups.devops',
    items: [
      { icon: FaDocker, name: 'Docker' },
      { icon: SiVercel, name: 'Vercel' },
      { icon: SiGithubactions, name: 'GitHub Actions' },
      { icon: FaGitAlt, name: 'Git' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function TechStack() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [activeTech, setActiveTech] = useState<string | null>(null);

  return (
    <section id="techstack" className="py-24 bg-muted/20 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}>
            {t('techstack.title')}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            {t('techstack.subtitle')}
          </p>
          <div className="w-24 h-1.5 bg-gradient-blue mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 items-start">
          {techStacks.map((group) => (
            <div key={group.id}>
              <h3
                className={`flex items-center justify-center min-h-12 text-center text-sm font-semibold uppercase tracking-widest leading-snug text-balance mb-6 ${
                  theme === 'dark' ? 'text-primary' : 'text-gradient-blue'
                }`}
              >
                {t(group.titleKey)}
              </h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-[repeat(2,auto)] md:grid-cols-[repeat(3,auto)] md:grid-rows-[repeat(2,4rem)] justify-center gap-3 sm:gap-4 md:gap-2 lg:gap-4"
              >
                {group.items.map((tech) => (
                  <motion.div
                    key={tech.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, y: -4 }}
                    className="relative group"
                  >
                    <motion.div
                      onClick={() => setActiveTech(activeTech === tech.name ? null : tech.name)}
                      className="flex items-center justify-center w-16 h-16 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                    >
                      <tech.icon
                        className="w-8 h-8 transition-transform"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap transition-opacity pointer-events-none z-10 ${
                        activeTech === tech.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {tech.name}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}