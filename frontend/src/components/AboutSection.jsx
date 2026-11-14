import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Compass,
  Code,
  MapPin,
  Mail,
  User,
  Sparkles,
  Award,
  Layers,
  FolderGit2,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const AboutSection = () => {
  const { profile, education } = usePortfolio();

  const primaryEdu = education && education.length > 0 ? education[0] : null;

  const interests = profile?.careerInterests && profile.careerInterests.length > 0
    ? profile.careerInterests
    : [
        'Full Stack Web Development',
        'Distributed Systems & Cloud',
        'Artificial Intelligence & ML',
        'Open Source Software',
      ];

  const stats = [
    {
      label: 'Projects Completed',
      value: profile?.stats?.projectsCount || '10+',
      icon: <FolderGit2 className="text-blue-400" size={20} />,
    },
    {
      label: 'Technical Skills',
      value: profile?.stats?.skillsCount || '15+',
      icon: <Code className="text-cyan-400" size={20} />,
    },
    {
      label: 'Years Coding',
      value: profile?.stats?.yearsExperience || '2+',
      icon: <Layers className="text-purple-400" size={20} />,
    },
    {
      label: 'Git Contributions',
      value: profile?.stats?.contributions || '150+',
      icon: <Award className="text-emerald-400" size={20} />,
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <User size={13} />
            <span>Discover More</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About <span className="gradient-text">Rakshith H R</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Engineering student, developer, and builder passionate about creating scalable digital products.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Bio & About Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Story Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="text-cyan-400" size={20} />
                <span>Personal Introduction</span>
              </h3>
              <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">
                {profile?.about ||
                  'Hello! I am Rakshith H R, an engineering student at AJ Institute of Engineering and Technology, Mangalore, specializing in Information Science and Engineering. I thrive on architecting clean, responsive, and performance-optimized digital experiences. My journey involves crafting modern web applications with cutting-edge technologies like React, Node.js, and MongoDB, while constantly exploring AI integrations and developer tools.'}
              </p>

              {/* Personal Details Row */}
              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Location</p>
                    <p className="text-sm font-semibold text-white">
                      {profile?.location || 'Mangalore, Karnataka, India'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Email</p>
                    <p className="text-sm font-semibold text-white break-all">
                      {profile?.email || 'rakshith@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Interests Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="text-purple-400" size={20} />
                <span>Career Interests & Focus Areas</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-700/80 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Education Highlight & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Education Highlight Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border-l-4 border-l-blue-500 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <GraduationCap size={22} />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                  {primaryEdu?.grade || '8.8 CGPA'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white leading-snug">
                {primaryEdu?.degree || 'Bachelor of Engineering (B.E.)'}
              </h4>
              <p className="text-sm font-semibold text-cyan-400 mt-1">
                {primaryEdu?.department || 'Information Science and Engineering'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {primaryEdu?.institution || 'AJ Institute of Engineering and Technology, Mangalore'}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {primaryEdu?.startYear || '2021'} – {primaryEdu?.endYear || '2025'}
                </span>
                <span>{primaryEdu?.location || 'Mangalore, India'}</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-slate-800/80 mb-1">{item.icon}</div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {item.value}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="glass-card p-5 rounded-2xl flex items-center justify-between gap-3">
              <span className="text-xs text-slate-300 font-medium">
                Want to know more details?
              </span>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/30"
              >
                Let&apos;s Connect
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
