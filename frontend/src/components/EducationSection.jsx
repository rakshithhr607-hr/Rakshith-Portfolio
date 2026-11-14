import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle, BookOpen } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

export const EducationSection = () => {
  const { education } = usePortfolio();

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap size={13} />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            My <span className="gradient-text">Education</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Formal engineering foundations and computer science coursework driving my problem-solving approach.
          </p>
        </div>

        {/* Timeline / Cards */}
        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border-l-4 border-l-blue-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-2">
                    {item.grade || '8.8 CGPA'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {item.degree}
                  </h3>
                  <h4 className="text-base font-semibold text-blue-400 mt-1">
                    {item.department}
                  </h4>
                  <p className="text-sm font-medium text-slate-300 mt-0.5">
                    {item.institution}
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80">
                    <Calendar size={13} className="text-cyan-400" />
                    <span>
                      {item.startYear} – {item.endYear || 'Present'}
                    </span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80">
                      <MapPin size={13} className="text-purple-400" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
              )}

              {/* Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-cyan-400" />
                    <span>Academic Highlights & Achievements:</span>
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
