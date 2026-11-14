import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Upload,
  ExternalLink,
  Github,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

const categoryOptions = ['Full Stack', 'AI / ML', 'Mobile / Web', 'Cloud / DevOps', 'Other'];

export const ProjectsManager = ({ triggerToast }) => {
  const { projects, refreshData } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveDemoUrl: '',
    category: 'Full Stack',
    featured: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      tagline: '',
      description: '',
      technologies: '',
      imageUrl: '',
      githubUrl: '',
      liveDemoUrl: '',
      category: 'Full Stack',
      featured: true,
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      tagline: proj.tagline || '',
      description: proj.description,
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.join(', ')
        : proj.technologies || '',
      imageUrl: proj.imageUrl || '',
      githubUrl: proj.githubUrl || '',
      liveDemoUrl: proj.liveDemoUrl || '',
      category: proj.category || 'Full Stack',
      featured: proj.featured !== undefined ? proj.featured : true,
    });
    setImageFile(null);
    setImagePreview(proj.imageUrl ? api.getFileUrl(proj.imageUrl) : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadProjectImage = async () => {
    if (!imageFile) return;
    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('image', imageFile);
      const res = await api.projects.uploadImage(data);
      if (res.success) {
        setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }));
        setImageFile(null);
        triggerToast('Project image uploaded successfully!');
      }
    } catch (err) {
      triggerToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      triggerToast('Title and description are required', 'error');
      return;
    }

    try {
      setLoading(true);

      // If user selected an image file but hasn't clicked upload, upload it automatically
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        const uploadRes = await api.projects.uploadImage(imgData);
        if (uploadRes.success) {
          finalImageUrl = uploadRes.imageUrl;
        }
      }

      const payload = {
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl: finalImageUrl,
        githubUrl: formData.githubUrl,
        liveDemoUrl: formData.liveDemoUrl,
        category: formData.category,
        featured: Boolean(formData.featured),
      };

      if (editingProject) {
        await api.projects.update(editingProject._id, payload);
        triggerToast(`Project "${formData.title}" updated successfully!`);
      } else {
        await api.projects.create(payload);
        triggerToast(`Project "${formData.title}" created successfully!`);
      }

      closeModal();
      await refreshData();
    } catch (err) {
      triggerToast('Operation failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the project "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.projects.delete(id);
      triggerToast(`Project "${title}" deleted.`);
      await refreshData();
    } catch (err) {
      triggerToast('Failed to delete project: ' + err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Projects Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add, update, or remove portfolio showcase projects, tech tags, and links.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const imgUrl = proj.imageUrl ? api.getFileUrl(proj.imageUrl) : null;

          return (
            <div
              key={proj._id || proj.title}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FolderGit2 size={36} className="text-cyan-400 mx-auto mb-2 opacity-80" />
                      <span className="text-xs font-mono text-slate-400">
                        {proj.category || 'Full Stack'}
                      </span>
                    </div>
                  )}

                  {proj.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/80 backdrop-blur-md text-white flex items-center gap-1 shadow-sm">
                      <Star size={11} className="fill-current text-yellow-300" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                    {proj.tagline && (
                      <p className="text-xs text-cyan-400 font-mono mt-0.5">{proj.tagline}</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech stack */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t, idx) => (
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
              </div>

              {/* Footer Links & Actions */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <Github size={13} />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.liveDemoUrl && (
                    <a
                      href={proj.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                    >
                      <ExternalLink size={13} />
                      <span>Demo</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit project"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id, proj.title)}
                    disabled={deletingId === proj._id}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete project"
                  >
                    {deletingId === proj._id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? `Edit: ${editingProject.title}` : 'Add New Project'}
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
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. StudentHub"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
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
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Tagline / Short Summary
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Campus Academic & Resource Collaboration Portal"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed explanation of the project, problem solved, and architecture..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
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
                  placeholder="React.js, Node.js, Express, MongoDB, Tailwind CSS"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              {/* Image Upload or URL */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <label className="block text-xs font-mono text-slate-300">
                  Project Image / Screenshot
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-20 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={28} className="text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      id="project-img-input"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="project-img-input"
                      className="inline-block px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                    >
                      Select Image File
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="Or paste external image URL"
                      className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/Rakshith-HR/..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://my-app.vercel.app"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded accent-blue-600 w-4 h-4"
                />
                <label
                  htmlFor="featured-checkbox"
                  className="text-xs text-slate-300 font-mono cursor-pointer"
                >
                  Feature this project on home portfolio spotlight
                </label>
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
                  disabled={loading || uploadingImage}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
