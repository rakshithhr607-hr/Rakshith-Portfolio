import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Sparkles,
  Layers,
  Code2,
  CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const ProjectsSection = () => {
  const { projects } = usePortfolio();
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(['All']);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) => p.category === filter);
  }, [projects, filter]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 size={13} />
            <span>Featured Innovations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Real-world full-stack web platforms and intelligent AI systems engineered from concept to deployment.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const imageUrl = project.imageUrl
                ? api.getFileUrl(project.imageUrl)
                : null;

              return (
                <motion.div
                  key={project._id || project.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-3xl overflow-hidden flex flex-col group border border-slate-800/80 hover:border-blue-500/40"
                >
                  {/* Project Image Banner or Illustrated Card */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-800 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      // Modern Tech Illustration Graphic
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-cyan-500/10" />
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-cyan-400 flex items-center justify-center mb-3 shadow-inner border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                          <Code2 size={32} />
                        </div>
                        <h4 className="text-xl font-extrabold text-white tracking-wide">
                          {project.title}
                        </h4>
                        <p className="text-xs text-cyan-400 font-mono mt-1">
                          {project.category || 'Full Stack Application'}
                        </p>
                      </div>
                    )}

                    {/* Featured Pill */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-400 text-xs font-semibold border border-cyan-500/30 shadow-md">
                        <Sparkles size={12} />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Category Pill */}
                    {project.category && (
                      <div className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 text-[11px] font-mono border border-slate-700">
                        {project.category}
                      </div>
                    )}
                  </div>

                  {/* Project Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>

                      {project.tagline && (
                        <p className="text-xs font-mono text-cyan-400 font-semibold mt-1">
                          {project.tagline}
                        </p>
                      )}

                      <p className="text-slate-300 text-sm leading-relaxed mt-3">
                        {project.description}
                      </p>

                      {/* Tech Stack Badges */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700/80 group-hover:border-slate-600 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all"
                        >
                          <Github size={16} />
                          <span>Source Code</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Private Repo</span>
                      )}

                      {project.liveDemoUrl ? (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 hover:scale-[1.02] transition-all"
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Demo Coming Soon</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
