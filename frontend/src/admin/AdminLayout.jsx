import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Code2,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Share2,
  Mail,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';

// Existing Phase 1 Admin Managers
import { DashboardOverview } from './DashboardOverview.jsx';
import { ProfileManager } from './ProfileManager.jsx';
import { SkillsManager } from './SkillsManager.jsx';
import { ProjectsManager } from './ProjectsManager.jsx';
import { EducationManager } from './EducationManager.jsx';
import { ExperienceManager } from './ExperienceManager.jsx';
import { CertificationsManager } from './CertificationsManager.jsx';
import { ResumeManager } from './ResumeManager.jsx';
import { SocialLinksManager } from './SocialLinksManager.jsx';
import { MessagesManager } from './MessagesManager.jsx';
import { SecurityManager } from './SecurityManager.jsx';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { profile } = usePortfolio();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Protected route check
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Profile & Bio', icon: <User size={18} /> },
    { id: 'skills', label: 'Skills & Tech', icon: <Code2 size={18} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'certifications', label: 'Certifications', icon: <Award size={18} /> },
    { id: 'resume', label: 'Resume (PDF)', icon: <FileText size={18} /> },
    { id: 'socials', label: 'Social Media', icon: <Share2 size={18} /> },
    { id: 'messages', label: 'Inquiries & Inbox', icon: <Mail size={18} /> },
    { id: 'security', label: 'Security & Access', icon: <ShieldCheck size={18} /> },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex relative selection:bg-blue-600/30">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-red-500/15 border-red-500/40 text-red-200'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 glass-panel border-r border-slate-800/80 z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Header Brand */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-mono font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                R
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {profile?.name || 'Rakshith H R'}
                </h1>
                <p className="text-[10px] text-cyan-400 font-mono tracking-wider">ADMIN PORTAL</p>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Admin Info & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {admin?.email || 'admin@rakshith.dev'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 py-3.5 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Management Section
              </span>
              <h2 className="text-base font-extrabold text-white capitalize leading-tight">
                {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Live Portfolio Link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <span>View Portfolio</span>
              <ExternalLink size={13} className="text-cyan-400" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Logout Shortcut */}
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <DashboardOverview setActiveTab={setActiveTab} triggerToast={triggerToast} />
          )}

          {activeTab === 'profile' && <ProfileManager triggerToast={triggerToast} />}

          {activeTab === 'skills' && <SkillsManager triggerToast={triggerToast} />}

          {activeTab === 'projects' && <ProjectsManager triggerToast={triggerToast} />}

          {activeTab === 'education' && <EducationManager triggerToast={triggerToast} />}

          {activeTab === 'experience' && <ExperienceManager triggerToast={triggerToast} />}

          {activeTab === 'certifications' && (
            <CertificationsManager triggerToast={triggerToast} />
          )}

          {activeTab === 'resume' && (
            <ResumeManager triggerToast={triggerToast} />
          )}

          {activeTab === 'socials' && (
            <SocialLinksManager triggerToast={triggerToast} />
          )}

          {activeTab === 'messages' && (
            <MessagesManager triggerToast={triggerToast} />
          )}

          {activeTab === 'security' && (
            <SecurityManager triggerToast={triggerToast} />
          )}
        </main>
      </div>
    </div>
  );
};
