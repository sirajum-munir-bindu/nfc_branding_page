import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { faqService } from '../services/api';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const res = await faqService.getFAQs();
        const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setFaqs(items);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[#05070c]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Everything you need to know about compatibility, technology, and using your TapCard.
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="space-y-3.5">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id || idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white/[0.04] border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                      : 'bg-white/[0.02] border-white/[0.07] hover:border-white/15'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
