import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useThemeStore } from '../stores/themeStore';
import { Database, ArrowRight, BarChart3, Sparkles } from 'lucide-react';

const steps = [
  { labelKey: 'showcase.labels.extract', icon: Database },
  { labelKey: 'showcase.labels.transform', icon: BarChart3 },
  { labelKey: 'showcase.labels.load', icon: Sparkles },
];

export function Showcase() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  return (
    <section id="showcase" className="py-24 bg-muted/20 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}>
            {t('showcase.title')}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            {t('showcase.subtitle')}
          </p>
          <div className="w-24 h-1.5 bg-gradient-blue mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/80 backdrop-blur-sm rounded-soft-xl border border-border/30 p-8 md:p-12 shadow-soft hover:shadow-soft-lg transition-all"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-soft-xl bg-gradient-blue flex items-center justify-center">
                  <Database className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <p className="text-muted-foreground text-base leading-relaxed">
                  {t('showcase.description')}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.labelKey}>
                      {index > 0 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <step.icon className="w-4 h-4" />
                        <span>{t(step.labelKey)}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-border/30">
              {[
                { labelKey: 'showcase.labels.extract', valueKey: 'showcase.metrics.sources' },
                { labelKey: 'showcase.labels.transform', valueKey: 'showcase.metrics.steps' },
                { labelKey: 'showcase.labels.load', valueKey: 'showcase.metrics.speed' },
              ].map((item, index) => (
                <motion.div
                  key={item.labelKey}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-primary mb-1">{t(item.valueKey)}</div>
                  <div className="text-xs text-muted-foreground">{t(item.labelKey)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
