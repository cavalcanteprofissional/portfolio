import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/themeStore';
import {
  FaPython,
  FaJs,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaLinux,
} from 'react-icons/fa';
import {
  SiTensorflow,
  SiPytorch,
  SiKeras,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiFirebase,
  SiSupabase,
  SiStreamlit,
  SiJupyter,
  SiFigma,
  SiJira,
  SiTrello,
  SiCanva,
  SiGooglecloud,
} from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';

interface TechStackItem {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
}

const techStacks: TechStackItem[] = [
  { icon: FaPython, name: 'Python' },
  { icon: SiTensorflow, name: 'TensorFlow' },
  { icon: SiPytorch, name: 'PyTorch' },
  { icon: SiKeras, name: 'Keras' },
  { icon: SiScikitlearn, name: 'Scikit-learn' },
  { icon: SiPandas, name: 'Pandas' },
  { icon: SiNumpy, name: 'NumPy' },
  { icon: FaJs, name: 'JavaScript' },
  { icon: FaReact, name: 'React' },
  { icon: FaNodeJs, name: 'Node.js' },
  { icon: FaDocker, name: 'Docker' },
  { icon: FaAws, name: 'AWS' },
  { icon: VscAzure, name: 'Azure' },
  { icon: SiGooglecloud, name: 'Google Cloud' },
  { icon: SiPostgresql, name: 'PostgreSQL' },
  { icon: SiMysql, name: 'MySQL' },
  { icon: SiMongodb, name: 'MongoDB' },
  { icon: SiSupabase, name: 'Supabase' },
  { icon: SiFirebase, name: 'Firebase' },
  { icon: FaGitAlt, name: 'Git' },
  { icon: SiStreamlit, name: 'Streamlit' },
  { icon: SiJupyter, name: 'Jupyter' },
  { icon: SiFigma, name: 'Figma' },
  { icon: SiCanva, name: 'Canva' },
  { icon: SiJira, name: 'Jira' },
  { icon: SiTrello, name: 'Trello' },
  { icon: FaLinux, name: 'Linux' },
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          {techStacks.map((tech, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -4 }}
              className="relative group"
            >
              <motion.div
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
              >
                <tech.icon
                  className="w-7 h-7 sm:w-8 sm:h-8 transition-transform"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              >
                {tech.name}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}