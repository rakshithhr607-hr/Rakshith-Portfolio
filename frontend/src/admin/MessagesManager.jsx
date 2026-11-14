import React, { useState, useEffect } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Inbox,
  Send,
  User,
} from 'lucide-react';
import api from '../services/api.js';

export const MessagesManager = ({ triggerToast }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.messages.getAll();
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load contact messages:', err.message);
      triggerToast('Failed to load messages: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      setActionLoadingId(id);
      const newStatus = !currentStatus;
      const res = await api.messages.toggleRead(id, newStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, isRead: newStatus } : m))
        );
        triggerToast(`Message marked as ${newStatus ? 'read' : 'unread'}.`);
      }
    } catch (err) {
      triggerToast('Failed to update status: ' + err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id, senderName) => {
    if (!window.confirm(`Are you sure you want to delete message from "${senderName}"?`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      const res = await api.messages.delete(id);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        triggerToast('Message deleted successfully.');
      }
    } catch (err) {
      triggerToast('Failed to delete message: ' + err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread' && msg.isRead) return false;
    if (filter === 'read' && !msg.isRead) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (msg.name || '').toLowerCase().includes(q);
      const matchEmail = (msg.email || '').toLowerCase().includes(q);
      const matchSubject = (msg.subject || '').toLowerCase().includes(q);
      const matchBody = (msg.message || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchSubject || matchBody;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-white">Inquiries & Messages</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-cyan-400 border border-blue-500/30 animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review incoming inquiries submitted through the portfolio contact form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'read'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, email, subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="glass-card p-16 rounded-3xl text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading messages from MongoDB...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        /* Empty State */
        <div className="glass-card p-16 rounded-3xl text-center space-y-3 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-2">
            <Inbox size={32} />
          </div>
          <h3 className="text-base font-bold text-white">No Messages Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No messages matched your search query. Try clearing the filter.'
              : 'Your inbox is clear. New submissions from your portfolio will appear here.'}
          </p>
        </div>
      ) : (
        /* Messages List */
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className={`glass-card p-6 sm:p-7 rounded-3xl border transition-all space-y-4 ${
                msg.isRead ? 'border-slate-800/80' : 'border-blue-500/50 bg-blue-500/5 shadow-lg'
              }`}
            >
              {/* Message Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      msg.isRead
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    }`}
                  >
                    {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{msg.name}</h3>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-blue-400 hover:underline font-mono"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock size={13} className="text-cyan-400" />
                  <span>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Recent'}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div className="pt-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                  Subject:
                </span>
                <p className="text-sm sm:text-base font-bold text-cyan-300">{msg.subject}</p>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {msg.message}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Convenient Reply Link */}
                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent(
                      'Re: ' + msg.subject
                    )}&body=${encodeURIComponent(
                      `Hi ${msg.name},\n\nThank you for reaching out through my portfolio.\n\nBest regards,\nRakshith H R\n\n--- Original Message ---\n${msg.message}`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Reply size={14} />
                    <span>Reply by Email</span>
                  </a>

                  {/* Toggle Read / Unread */}
                  <button
                    onClick={() => handleToggleRead(msg._id, msg.isRead)}
                    disabled={actionLoadingId === msg._id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    {msg.isRead ? (
                      <>
                        <Mail size={14} />
                        <span>Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <MailOpen size={14} />
                        <span>Mark as Read</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(msg._id, msg.name)}
                  disabled={actionLoadingId === msg._id}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors disabled:opacity-50"
                  title="Delete message"
                >
                  {actionLoadingId === msg._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
