import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { SectionHeader, Stagger, StaggerItem, STAGGER } from '../lib/motion';

const faqItems = [
  { id: '0', questionKey: 'faq.0.question', answerKey: 'faq.0.answer' },
  { id: '1', questionKey: 'faq.1.question', answerKey: 'faq.1.answer' },
  { id: '2', questionKey: 'faq.2.question', answerKey: 'faq.2.answer' },
  { id: '3', questionKey: 'faq.3.question', answerKey: 'faq.3.answer' },
];

export function FAQ() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>('0');

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: t(item.questionKey),
      acceptedAnswer: { '@type': 'Answer', text: t(item.answerKey) },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section id="faq" className="py-20 bg-muted/30">
        <div className="section-container">
          <SectionHeader title={t('faq.title')} size="sm" spacing="mb-12" />

          <Stagger stagger={STAGGER.row} className="max-w-2xl mx-auto space-y-4">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;

              return (
                <StaggerItem key={item.id}>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-secondary/30 transition-colors text-left"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-3 pr-4">
                        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="font-medium text-sm sm:text-base">
                          {t(item.questionKey)}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pl-12 sm:pl-14">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {t(item.answerKey)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}