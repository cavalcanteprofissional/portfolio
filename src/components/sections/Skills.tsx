import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function Skills() {
  const { t } = useTranslation();
  const skills = t('skills.items', { returnObjects: true }) as Record<string, string[]>;

  const categories = [
    { key: 'languages', icon: '💻' },
    { key: 'frameworks', icon: '🛠️' },
    { key: 'databases', icon: '🗄️' },
    { key: 'cloud', icon: '☁️' },
    { key: 'tools', icon: '🔧' },
  ];

  return (
    <section id="skills" className="py-16 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('skills.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 bg-card rounded-lg border border-border"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>{category.icon}</span>
                {t(`skills.${category.key}`)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(skills[category.key] || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-secondary rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}