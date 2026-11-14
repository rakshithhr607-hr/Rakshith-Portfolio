import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Code2,
  Mail,
  Award,
  GraduationCap,
  Briefcase,
  FileText,
  Clock,
  ArrowUpRight,
  CheckCircle,
  Eye,
  Trash2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api.js';

export const DashboardOverview = ({ setActiveTab, triggerToast }) => {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.stats.get();
      if (res.success) {
        setStats(res.stats);
        setRecentMessages(res.recentMessages || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: <FolderGit2 className="text-blue-400" size={24} />,
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20',
      tab: 'projects',
    },
    {
      title: 'Total Skills',
      value: stats?.totalSkills ?? 0,
      icon: <Code2 className="text-cyan-400" size={24} />,
      bg: 'from-cyan-500/10 to-cyan-600/5',
      border: 'border-cyan-500/20',
      tab: 'skills',
    },
    {
      title: 'Messages Received',
      value: stats?.totalMessages ?? 0,
      badge: stats?.unreadMessages ? `${stats.unreadMessages} Unread` : null,
      icon: <Mail className="text-purple-400" size={24} />,
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20',
      tab: 'messages',
    },
    {
      title: 'Certifications',
      value: stats?.totalCertifications ?? 0,
      icon: <Award className="text-emerald-400" size={24} />,
      bg: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-500/20',
      tab: 'certifications',
    },
    {
      title: 'Internships & Roles',
      value: stats?.totalExperiences ?? 0,
      icon: <Briefcase className="text-amber-400" size={24} />,
      bg: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
      tab: 'experience',
    },
    {
      title: 'Resume Downloads',
      value: stats?.resumeDownloads ?? 0,
      badge: stats?.hasActiveResume ? 'Active' : 'Missing',
      icon: <FileText className="text-rose-400" size={24} />,
      bg: 'from-rose-500/10 to-rose-600/5',
      border: 'border-rose-500/20',
      tab: 'resume',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Real-time Dynamic Sync Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to Portfolio Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Every change made here updates your public portfolio in MongoDB instantly.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-2 text-xs font-semibold"
          title="Refresh statistics"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => setActiveTab(card.tab)}
            className={`glass-card p-6 rounded-3xl border ${card.border} bg-gradient-to-br ${card.bg} cursor-pointer group hover:scale-[1.02] transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              {card.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {card.badge}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-slate-400">{card.title}</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">
                {card.value}
              </span>
              <span className="text-xs text-blue-400 group-hover:text-cyan-300 flex items-center gap-1 font-semibold">
                Manage <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Messages Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Quick Shortcuts</span>
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveTab('projects')}
              className="w-full p-4 rounded-2xl glass-card flex items-center justify-between text-left group hover:border-blue-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <FolderGit2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-blue-400">
                    Add New Project
                  </p>
                  <p className="text-xs text-slate-400">Showcase recent engineering builds</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white" />
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className="w-full p-4 rounded-2xl glass-card flex items-center justify-between text-left group hover:border-cyan-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Code2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-cyan-400">
                    Manage Skills & Tech
                  </p>
                  <p className="text-xs text-slate-400">Add languages, libraries or adjust levels</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full p-4 rounded-2xl glass-card flex items-center justify-between text-left group hover:border-purple-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-purple-400">
                    Edit Bio & Roles
                  </p>
                  <p className="text-xs text-slate-400">Update typing titles and contact details</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white" />
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className="w-full p-4 rounded-2xl glass-card flex items-center justify-between text-left group hover:border-emerald-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400">
                    Upload Updated Resume
                  </p>
                  <p className="text-xs text-slate-400">Keep latest PDF available for recruiters</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-cyan-400" />
              <span>Recent Inquiries</span>
            </h3>
            <button
              onClick={() => setActiveTab('messages')}
              className="text-xs text-blue-400 hover:text-cyan-300 font-mono"
            >
              View All Messages →
            </button>
          </div>

          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <div className="glass-card p-8 rounded-3xl text-center text-slate-400 text-sm">
                No messages received yet. When visitors fill the contact form, their submissions appear here.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-4 rounded-2xl glass-card border transition-all ${
                    msg.isRead ? 'border-slate-800' : 'border-blue-500/40 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{msg.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyan-400 mb-1">{msg.subject}</p>
                  <p className="text-xs text-slate-300 line-clamp-2">{msg.message}</p>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{msg.email}</span>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-blue-400 hover:text-cyan-300 font-semibold"
                    >
                      Inspect in Messages
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
