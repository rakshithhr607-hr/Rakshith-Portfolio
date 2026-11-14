import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const EducationManager = ({ triggerToast }) => {
  const { education, refreshData } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    department: '',
    startYear: '2021',
    endYear: '2025',
    grade: '8.8 CGPA',
    location: 'Mangalore, Karnataka',
    description: '',
    highlights: '',
  });

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      institution: '',
      degree: '',
      department: '',
      startYear: '',
      endYear: '',
      grade: '',
      location: '',
      description: '',
      highlights: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      institution: item.institution,
      degree: item.degree,
      department: item.department,
      startYear: item.startYear || '',
      endYear: item.endYear || '',
      grade: item.grade || '',
      location: item.location || '',
      description: item.description || '',
      highlights: Array.isArray(item.highlights)
        ? item.highlights.join('\n')
        : item.highlights || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.institution.trim() || !formData.degree.trim() || !formData.department.trim()) {
      triggerToast('Institution, degree, and department are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        highlights: formData.highlights
          .split('\n')
          .map((h) => h.trim())
          .filter(Boolean),
      };

      if (editingItem) {
        await api.education.update(editingItem._id, payload);
        triggerToast('Education record updated successfully!');
      } else {
        await api.education.create(payload);
        triggerToast('Education record added successfully!');
      }

      closeModal();
      await refreshData();
    } catch (err) {
      triggerToast('Operation failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, degree) => {
    if (!window.confirm(`Are you sure you want to remove education record for "${degree}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.education.delete(id);
      triggerToast('Education record deleted.');
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
          <h2 className="text-2xl font-extrabold text-white">Education Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update college credentials, department, degree, and key academic highlights.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>Add Education Record</span>
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((item) => (
          <div
            key={item._id || item.degree}
            className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-6 border border-slate-800"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {item.grade || 'Grade N/A'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {item.startYear} – {item.endYear || 'Present'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{item.degree}</h3>
              <p className="text-sm font-semibold text-blue-400">{item.department}</p>
              <p className="text-xs text-slate-300">{item.institution}</p>

              {item.description && (
                <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              )}

              {item.highlights && item.highlights.length > 0 && (
                <div className="pt-2">
                  <ul className="text-xs text-slate-400 space-y-1">
                    {item.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-emerald-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Edit record"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(item._id, item.degree)}
                disabled={deletingId === item._id}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete record"
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
                {editingItem ? 'Edit Education Record' : 'Add Education Record'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="AJ Institute of Engineering and Technology, Mangalore"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Degree *</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="Bachelor of Engineering (B.E.)"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Information Science and Engineering"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    placeholder="2021"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    End Year (or Present)
                  </label>
                  <input
                    type="text"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    placeholder="2025"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">CGPA / Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="8.8 CGPA"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Mangalore, Karnataka"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Core coursework and foundational topics..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Highlights & Achievements (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Consistent academic excellence in ISE&#10;Active member of Coding Club"
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
                  <span>Save Education</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
