import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const CertificationsSection = () => {
  const { certifications } = usePortfolio();

  return (
    <section id="certifications" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award size={13} />
            <span>Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Licenses & <span className="gradient-text">Certifications</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Industry-recognized credentials validating expertise across modern full-stack development, cloud databases, and AI.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => {
            const certImg = cert.certificateImage ? api.getFileUrl(cert.certificateImage) : null;

            return (
              <motion.div
                key={cert._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between group border border-slate-800/80 hover:border-emerald-500/40"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={26} />
                    </div>
                    {cert.issueDate && (
                      <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        <Calendar size={11} className="text-emerald-400" />
                        <span>Issued {cert.issueDate}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm font-semibold text-cyan-400 mt-1">{cert.issuer}</p>

                  {cert.credentialId && (
                    <p className="text-[11px] font-mono text-slate-400 mt-2">
                      Credential ID: <span className="text-slate-300">{cert.credentialId}</span>
                    </p>
                  )}

                  {/* Skills Covered */}
                  {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cert.skillsCovered.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Link */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : certImg ? (
                    <a
                      href={certImg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>View Certificate</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">Verified Issuer</span>
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
