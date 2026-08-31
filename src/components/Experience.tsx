import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useCallback } from 'react';
import experiencesData from '../data/experiences.json';
import { SectionHeader, Stagger, StaggerItem, scaleIn, STAGGER } from '../lib/motion';

export function Experience() {
  const { t } = useTranslation();
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

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 320;
      const newIndex = Math.round(scrollLeft / (cardWidth + 24));
      setActiveIndex(Math.min(newIndex, sortedExperiences.length - 1));
    }
  }, [sortedExperiences.length]);

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
  }, [handleScroll]);

  return (
    <section id="experience" className="py-24 overflow-hidden">
      <div className="section-container">
        <SectionHeader title={t('sections.experience')} spacing="mb-16" />

        <div className="relative">
          <Stagger
            ref={scrollRef}
            stagger={STAGGER.card}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {sortedExperiences.map((exp) => (
              <StaggerItem
                key={exp.id}
                variants={scaleIn()}
                className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="h-full bg-card/80 backdrop-blur-sm rounded-soft-xl border border-border/30 flex flex-col overflow-hidden relative shadow-soft hover:shadow-soft-lg transition-all"
                >
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
                      {t(exp.companyKey)}
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
                          transition={{ delay: descIndex * 0.05 }}
                          className="flex items-start gap-2 text-muted-foreground text-sm"
                        >
                          <span className="text-primary mt-1.5 min-w-[4px]">•</span>
                          <span className="leading-relaxed">{t(key)}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
            <div className="flex-shrink-0 w-4" />
          </Stagger>

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
                aria-label={t('experience.goToPage', { page: pageIndex + 1 })}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}