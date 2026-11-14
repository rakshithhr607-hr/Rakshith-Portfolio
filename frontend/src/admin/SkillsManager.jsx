import React, { useState } from 'react';
import {
  Code2,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

const categoryOptions = [
  'Languages',
  'Frontend',
  'Backend & Databases',
  'Tools & Platforms',
  'Other',
];

const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const SkillsManager = ({ triggerToast }) => {
  const { skills, refreshData } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Languages',
    proficiency: 85,
    level: 'Advanced',
    iconName: 'Code',
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Languages',
      proficiency: 85,
      level: 'Advanced',
      iconName: 'Code',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category || 'Languages',
      proficiency: skill.proficiency || 80,
      level: skill.level || 'Advanced',
      iconName: skill.iconName || 'Code',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      triggerToast('Skill name is required', 'error');
      return;
    }

    try {
      setLoading(true);
      if (editingSkill) {
        await api.skills.update(editingSkill._id, formData);
        triggerToast(`Skill "${formData.name}" updated successfully!`);
      } else {
        await api.skills.create(formData);
        triggerToast(`Skill "${formData.name}" added successfully!`);
      }
      closeModal();
      await refreshData();
    } catch (err) {
      triggerToast('Operation failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the skill "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.skills.delete(id);
      triggerToast(`Skill "${name}" deleted.`);
      await refreshData();
    } catch (err) {
      triggerToast('Failed to delete skill: ' + err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Skills Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add new programming languages, frameworks, or database proficiencies.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Skills Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill._id || skill.name}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80 inline-block mt-1">
                    {skill.category}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {skill.proficiency}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>

              <div className="mt-2 text-[11px] text-slate-400 font-mono">
                Level: <span className="text-slate-200">{skill.level || 'Advanced'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(skill)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Edit skill"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(skill._id, skill.name)}
                disabled={deletingId === skill._id}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete skill"
              >
                {deletingId === skill._id ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingSkill ? `Edit Skill: ${editingSkill.name}` : 'Add New Skill'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React.js, Python, MongoDB"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300">Proficiency (%)</label>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {formData.proficiency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={formData.proficiency}
                  onChange={(e) =>
                    setFormData({ ...formData, proficiency: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
                >
                  {levelOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
