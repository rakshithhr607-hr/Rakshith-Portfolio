import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Terminal,
  Code2,
  CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const HeroSection = () => {
  const { profile } = usePortfolio();

  const roles = profile?.typingRoles && profile.typingRoles.length > 0
    ? profile.typingRoles
    : ['Full Stack Developer', 'Software Developer', 'Engineering Student', 'AI Enthusiast'];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex % roles.length];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayedText === currentRole) {
      // Pause at full word
      const timeout = setTimeout(() => setIsDeleting(true), 1600);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => prev + 1);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText((prev) =>
        isDeleting
          ? currentRole.substring(0, prev.length - 1)
          : currentRole.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, roleIndex, roles]);

  const profileImageUrl = profile?.profileImage
    ? api.getFileUrl(profile.profileImage)
    : null;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background Neon Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/15 via-purple-600/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 shadow-sm backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">
                Available for internships & full-time roles
              </span>
              <Sparkles size={13} className="text-cyan-400" />
            </div>

            {/* Main Greeting & Name */}
            <div>
              <p className="text-base sm:text-lg font-mono text-cyan-400 font-semibold mb-2">
                Hi there, I am
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
                <span className="gradient-text">{profile?.name || 'Rakshith H R'}</span>
              </h1>
            </div>

            {/* Dynamic Typing Title */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-200 min-h-[44px]">
              <span className="text-slate-400">I build as a</span>
              <span className="text-blue-400 font-mono font-bold border-r-2 border-cyan-400 pr-1 animate-pulse">
                {displayedText}
              </span>
            </div>

            {/* Professional Intro */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {profile?.intro ||
                'Passionate Information Science and Engineering student with strong hands-on experience in full-stack web development, modern cloud architectures, and scalable software solutions.'}
            </p>

            {/* Call to Actions & Social Links */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {/* Download Resume Button */}
              <a
                href={api.resume.getDownloadUrl()}
                download
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Download size={18} />
                <span>Download Resume</span>
              </a>

              {/* View Projects Button */}
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-600 shadow-md transition-all duration-200 hover:scale-[1.02]"
              >
                <span>View Projects</span>
                <ArrowRight size={17} className="text-cyan-400" />
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5 pl-2">
                {profile?.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 hover:border-blue-500/50 shadow-sm transition-all hover:scale-105"
                    aria-label="GitHub Profile"
                    title="GitHub"
                  >
                    <Github size={19} />
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-blue-400 border border-slate-700/80 hover:border-blue-500/50 shadow-sm transition-all hover:scale-105"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn"
                  >
                    <Linkedin size={19} />
                  </a>
                )}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 shadow-sm transition-all hover:scale-105"
                  aria-label="Contact Me"
                  title="Contact"
                >
                  <Mail size={19} />
                </a>
              </div>
            </div>

            {/* Quick Education Highlight */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Code2 size={15} className="text-blue-400" />
                Information Science & Engineering
              </span>
              <span>•</span>
              <span className="text-cyan-400">AJIET Mangalore</span>
            </div>
          </motion.div>

          {/* Right Column: Profile Picture & Floating Tech Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 flex items-center justify-center">
              {/* Outer Glowing Orbital Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 opacity-20 blur-xl animate-pulse-slow" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 p-[2px] shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-950/90 backdrop-blur-2xl" />
              </div>

              {/* Profile Image container */}
              <div className="relative w-[92%] h-[92%] rounded-full overflow-hidden border-4 border-slate-800/80 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={profile?.name || 'Rakshith H R'}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  // Sleek Modern Avatar Fallback
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl shadow-blue-500/30 mb-3">
                      R
                    </div>
                    <span className="text-lg font-bold text-white tracking-wide">
                      {profile?.name || 'Rakshith H R'}
                    </span>
                    <span className="text-xs text-cyan-400 font-mono mt-1">
                      B.E. ISE @ AJIET
                    </span>
                    <span className="mt-2 text-[11px] px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Full Stack Developer
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Badge 1: Top Right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-2 -right-2 glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-slate-700/80"
              >
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <Terminal size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-mono">Major</p>
                  <p className="text-xs font-bold text-white">Info Science & Eng</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-2 -left-2 glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-slate-700/80"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-mono">Specialization</p>
                  <p className="text-xs font-bold text-white">Full Stack & AI</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
