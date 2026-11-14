import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Github, Linkedin, ArrowUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

export const Footer = () => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-mono">
                R
              </span>
              <span>{profile?.name || 'Rakshith H R'}</span>
            </a>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Full Stack Developer & Information Science Engineering Student @ AJIET Mangalore.
            </p>
          </div>

          {/* Social Links & Navigation */}
          <div className="flex items-center gap-4">
            {profile?.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {profile?.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-blue-400 border border-slate-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}

            {/* Admin Portal link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors"
              title="Admin Dashboard Portal"
            >
              <Shield size={14} />
              <span>Admin Login</span>
            </Link>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              aria-label="Scroll to Top"
              title="Back to Top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Rakshith H R. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px] font-mono">
            <span>Crafted with React, Node.js & MongoDB Atlas</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
