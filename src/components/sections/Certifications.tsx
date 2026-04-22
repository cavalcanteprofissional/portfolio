import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

export function Certifications() {
  const { t } = useTranslation();
  const certifications = t('certifications.items', { returnObjects: true }) as Array<{
    title: string;
    issuer: string;
    date: string;
    url?: string;
  }>;

  return (
    <section id="certifications" className="py-16">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('certifications.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('certifications.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 bg-card rounded-lg border border-border flex items-start gap-4"
            >
              <div className="p-3 bg-primary/10 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
              </div>
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}