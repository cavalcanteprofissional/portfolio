import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import experiencesData from '../data/experiences.json';

export function Experience() {
  const { t } = useTranslation();
  const { experiences } = experiencesData;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedExperiences = [...experiences].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year)
  );

  const isCurrentYear = (year: string) =>
    activeIndex === 0 && sortedExperiences[0]?.year === year;

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 320;
      const scrollPosition = index * (cardWidth + 24);
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 320;
      const newIndex = Math.round(scrollLeft / (cardWidth + 24));
      setActiveIndex(Math.min(newIndex, sortedExperiences.length - 1));
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section id="experience" className="py-24 bg-muted/30 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('sections.experience')}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {sortedExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 w-[85vw] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3.25)]"
              >
                <div className="h-full bg-card rounded-2xl border border-border/50 flex flex-col overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-border/30 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-muted">
                        <span className="text-lg font-bold text-muted-foreground">
                          {exp.year}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${
                          isCurrentYear(exp.year)
                            ? 'border-animation-subtle-fast text-primary'
                            : 'border-border bg-muted text-foreground'
                        }`}
                      >
                        {isCurrentYear(exp.year) && (
                          <span className="mr-2 text-xs text-muted-foreground">
                            {t('experience.current')}
                          </span>
                        )}
                        {exp.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 leading-tight text-foreground">
                      {t(exp.titleKey)}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 relative z-10">
                    <ul className="space-y-3">
                      {exp.descriptionKeys.map((key, descIndex) => (
                        <motion.li
                          key={key}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + descIndex * 0.05 }}
                          className="flex items-start gap-2 text-muted-foreground text-sm"
                        >
                          <span className="text-muted-foreground mt-1">•</span>
                          <span className="leading-relaxed">{t(key)}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="flex-shrink-0 w-4" />
          </div>

          <div className="flex justify-center gap-3 mt-6">
            {sortedExperiences.map((exp, index) => (
              <button
                key={exp.id}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to experience ${index + 1}: ${exp.company}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}