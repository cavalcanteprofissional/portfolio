import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function InteractiveShowcase() {
  const { t } = useTranslation();
  const showcase = t('showcase.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    image: string;
    link: string;
  }>;

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((currentIndex + 1) % showcase.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + showcase.length) % showcase.length);

  return (
    <section id="showcase" className="py-16">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('showcase.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('showcase.subtitle')}
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="aspect-video bg-muted relative">
              <img
                src={showcase[currentIndex].image}
                alt={showcase[currentIndex].title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                {showcase[currentIndex].title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {showcase[currentIndex].description}
              </p>
              <a
                href={showcase[currentIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                {t('buttons.viewProject')}
              </a>
            </div>
          </motion.div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prev}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {showcase.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}