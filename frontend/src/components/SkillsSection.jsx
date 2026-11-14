import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Terminal,
  Coffee,
  FileCode,
  Braces,
  Globe,
  Palette,
  Atom,
  Server,
  Database,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

// Icon resolver helper
const getSkillIcon = (name, iconName) => {
  const normalized = (name || '').toLowerCase();
  if (normalized.includes('react')) return <Atom size={24} className="text-cyan-400" />;
  if (normalized.includes('node')) return <Server size={24} className="text-emerald-400" />;
  if (normalized.includes('mongo')) return <Database size={24} className="text-green-400" />;
  if (normalized.includes('python')) return <FileCode size={24} className="text-yellow-400" />;
  if (normalized.includes('javascript') || normalized === 'js')
    return <Braces size={24} className="text-amber-300" />;
  if (normalized === 'java') return <Coffee size={24} className="text-orange-400" />;
  if (normalized === 'c') return <Terminal size={24} className="text-blue-400" />;
  if (normalized.includes('html')) return <Globe size={24} className="text-orange-500" />;
  if (normalized.includes('css')) return <Palette size={24} className="text-blue-400" />;

  switch (iconName) {
    case 'Terminal':
      return <Terminal size={24} className="text-blue-400" />;
    case 'Coffee':
      return <Coffee size={24} className="text-orange-400" />;
    case 'FileCode':
      return <FileCode size={24} className="text-yellow-400" />;
    case 'Braces':
      return <Braces size={24} className="text-amber-300" />;
    case 'Globe':
      return <Globe size={24} className="text-orange-500" />;
    case 'Palette':
      return <Palette size={24} className="text-blue-400" />;
    case 'Atom':
      return <Atom size={24} className="text-cyan-400" />;
    case 'Server':
      return <Server size={24} className="text-emerald-400" />;
    case 'Database':
      return <Database size={24} className="text-green-400" />;
    default:
      return <Code size={24} className="text-cyan-400" />;
  }
};

export const SkillsSection = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(['All']);
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu size={13} />
            <span>Core Competencies</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            A comprehensive spectrum of languages, frameworks, and databases mastered throughout my engineering curriculum and practical projects.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill._id || skill.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 rounded-2xl group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/60 shadow-md group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
                    {getSkillIcon(skill.name, skill.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {skill.level || 'Advanced'}
                    </span>
                    <span className="text-sm font-mono font-bold text-cyan-400">
                      {skill.proficiency || 85}%
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{skill.category}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800/90 overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency || 80}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 shadow-sm shadow-cyan-500/50"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
