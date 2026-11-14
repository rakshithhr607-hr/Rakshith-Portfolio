import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
  MapPin,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const ExperienceManager = ({ triggerToast }) => {
  const { experience, refreshData } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    duration: '',
    location: '',
    description: '',
    achievements: '',
    technologies: '',
    certificateUrl: '',
    isCurrent: false,
  });

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      role: '',
      company: '',
      duration: '',
      location: '',
      description: '',
      achievements: '',
      technologies: '',
      certificateUrl: '',
      isCurrent: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      role: item.role,
      company: item.company,
      duration: item.duration,
      location: item.location || '',
      description: item.description || '',
      achievements: Array.isArray(item.achievements)
        ? item.achievements.join('\n')
        : item.achievements || '',
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(', ')
        : item.technologies || '',
      certificateUrl: item.certificateUrl || '',
      isCurrent: Boolean(item.isCurrent),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role.trim() || !formData.company.trim() || !formData.duration.trim()) {
      triggerToast('Role, company, and duration are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        role: formData.role,
        company: formData.company,
        duration: formData.duration,
        location: formData.location,
        description: formData.description,
        achievements: formData.achievements
          .split('\n')
          .map((a) => a.trim())
          .filter(Boolean),
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        certificateUrl: formData.certificateUrl,
        isCurrent: formData.isCurrent,
      };

      if (editingItem) {
        await api.experience.update(editingItem._id, payload);
        triggerToast('Internship/Role updated successfully!');
      } else {
        await api.experience.create(payload);
        triggerToast('Internship/Role added successfully!');
      }

      closeModal();
      await refreshData();
    } catch (err) {
      triggerToast('Operation failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, role, company) => {
    if (!window.confirm(`Are you sure you want to remove "${role}" at ${company}?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.experience.delete(id);
      triggerToast('Experience entry deleted.');
      await refreshData();
    } catch (err) {
      triggerToast('Failed to delete: ' + err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Experience & Internships</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your professional internships, software engineering roles, and achievements.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>Add Internship / Role</span>
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experience.map((item) => (
          <div
            key={item._id || item.role}
            className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-6 border border-slate-800"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.company}
                </span>
                <span className="text-xs font-mono text-slate-400">{item.duration}</span>
                {item.location && (
                  <span className="text-xs text-slate-500 font-mono">• {item.location}</span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white">{item.role}</h3>

              {item.description && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              )}

              {/* Achievements */}
              {item.achievements && item.achievements.length > 0 && (
                <div className="pt-2">
                  <ul className="text-xs text-slate-400 space-y-1">
                    {item.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-cyan-400 shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Edit role"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(item._id, item.role, item.company)}
                disabled={deletingId === item._id}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete role"
              >
                {deletingId === item._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit Internship/Role' : 'Add Internship/Role'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Full Stack Web Development Intern"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. TechSolutions Innovations"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Duration *</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 3 Months (June 2024 - August 2024)"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote / Bangalore"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of responsibilities and core focus..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Key Achievements (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Developed responsive React components&#10;Implemented secure JWT authentication"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Technologies Used (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React.js, Node.js, Express, MongoDB, Git"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Certificate Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.certificateUrl}
                  onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                  placeholder="Link or path to certificate"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
