import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle, ExternalLink, Award } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const ExperienceSection = () => {
  const { experience } = usePortfolio();

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Briefcase size={13} />
            <span>Practical Exposure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Work Experience & <span className="gradient-text">Internships</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Hands-on software engineering and web development engagements solving practical problems in fast-paced teams.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-800 before:hidden sm:before:block">
          {experience.map((item, idx) => {
            const certUrl = item.certificateUrl ? api.getFileUrl(item.certificateUrl) : null;

            return (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-slate-800/80 hover:border-purple-500/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
                      {item.company}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{item.role}</h3>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80">
                      <Calendar size={13} className="text-purple-400" />
                      <span>{item.duration}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80">
                        <MapPin size={13} className="text-cyan-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{item.description}</p>
                )}

                {/* Key Achievements */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Key Contributions:
                    </p>
                    <ul className="space-y-1.5">
                      {item.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                          <CheckCircle size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Pills & Certificate Button */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.technologies &&
                      item.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/80"
                        >
                          {t}
                        </span>
                      ))}
                  </div>

                  {certUrl && (
                    <a
                      href={certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
                    >
                      <Award size={14} />
                      <span>View Certificate</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
