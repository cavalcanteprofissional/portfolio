import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import experiencesData from '../data/experiences.json';

export function Experience() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const { experiences } = experiencesData;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);

  const sortedExperiences = [...experiences].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year)
  );

  const totalPages = Math.ceil(sortedExperiences.length / cardsPerPage);

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
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardsPerPage(3);
      } else if (width >= 640) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section id="experience" className="py-24 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}>
            {t('sections.experience')}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-blue mx-auto rounded-full" />
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
                <div className="h-full bg-card/80 backdrop-blur-sm rounded-soft-xl border border-border/30 flex flex-col overflow-hidden relative shadow-soft hover:shadow-soft-lg transition-all">
                  <div className="p-6 border-b border-border/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        {exp.year}
                        {isCurrentYear(exp.year) && ` • ${t('experience.current')}`}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-foreground mb-1">
                      {t(exp.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.company}
                    </p>
                  </div>

                  <div className="p-6 flex-1">
                    <ul className="space-y-2.5">
                      {exp.descriptionKeys.slice(0, 6).map((key, descIndex) => (
                        <motion.li
                          key={key}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + descIndex * 0.05 }}
                          className="flex items-start gap-2 text-muted-foreground text-sm"
                        >
                          <span className="text-primary mt-1.5 min-w-[4px]">•</span>
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
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => scrollToIndex(pageIndex * cardsPerPage)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(activeIndex / cardsPerPage) === pageIndex
                    ? 'w-10 bg-gradient-blue'
                    : 'w-3 bg-muted-foreground/20 hover:bg-primary/40'
                }`}
                aria-label={`Go to page ${pageIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}