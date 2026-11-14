import React, { useState } from 'react';
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Upload,
  ExternalLink,
  Calendar,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const CertificationsManager = ({ triggerToast }) => {
  const { certifications, refreshData } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: 'No Expiration',
    credentialId: '',
    credentialUrl: '',
    certificateImage: '',
    skillsCovered: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: 'No Expiration',
      credentialId: '',
      credentialUrl: '',
      certificateImage: '',
      skillsCovered: '',
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate || '',
      expiryDate: cert.expiryDate || 'No Expiration',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      certificateImage: cert.certificateImage || '',
      skillsCovered: Array.isArray(cert.skillsCovered)
        ? cert.skillsCovered.join(', ')
        : cert.skillsCovered || '',
    });
    setImageFile(null);
    setImagePreview(cert.certificateImage ? api.getFileUrl(cert.certificateImage) : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCert(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim()) {
      triggerToast('Title and issuer are required', 'error');
      return;
    }

    try {
      setLoading(true);

      let finalImageUrl = formData.certificateImage;
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        const uploadRes = await api.certifications.uploadImage(imgData);
        if (uploadRes.success) {
          finalImageUrl = uploadRes.imageUrl;
        }
      }

      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        credentialId: formData.credentialId,
        credentialUrl: formData.credentialUrl,
        certificateImage: finalImageUrl,
        skillsCovered: formData.skillsCovered
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingCert) {
        await api.certifications.update(editingCert._id, payload);
        triggerToast(`Certification "${formData.title}" updated successfully!`);
      } else {
        await api.certifications.create(payload);
        triggerToast(`Certification "${formData.title}" added successfully!`);
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
    if (!window.confirm(`Are you sure you want to delete the certification "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.certifications.delete(id);
      triggerToast(`Certification "${title}" removed.`);
      await refreshData();
    } catch (err) {
      triggerToast('Failed to delete certification: ' + err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Certifications Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage industry certifications, verification URLs, and credential badges.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>Add New Certification</span>
        </button>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => {
          const imgUrl = cert.certificateImage ? api.getFileUrl(cert.certificateImage) : null;

          return (
            <div
              key={cert._id || cert.title}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-800 space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck size={22} />
                  </div>
                  {cert.issueDate && (
                    <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      <Calendar size={11} className="text-emerald-400" />
                      <span>{cert.issueDate}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">{cert.title}</h3>
                <p className="text-xs font-semibold text-cyan-400 mt-0.5">{cert.issuer}</p>

                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-slate-400 mt-2 truncate">
                    ID: <span className="text-slate-300">{cert.credentialId}</span>
                  </p>
                )}

                {/* Covered Skills */}
                {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cert.skillsCovered.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div>
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Verify Link</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : imgUrl ? (
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Certificate File</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">No link set</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit certification"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(cert._id, cert.title)}
                    disabled={deletingId === cert._id}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete certification"
                  >
                    {deletingId === cert._id ? (
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-white">
                {editingCert ? `Edit: ${editingCert.title}` : 'Add New Certification'}
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
                    Certification Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Meta Full Stack Developer"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Meta / Coursera, MongoDB University"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="e.g. META-FSWD-92837"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Verification / Credential URL
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Skills Covered (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsCovered}
                  onChange={(e) => setFormData({ ...formData, skillsCovered: e.target.value })}
                  placeholder="React.js, Node.js, REST APIs, Databases"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              {/* Certificate Image Upload */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <label className="block text-xs font-mono text-slate-300">
                  Certificate Image (Optional)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-16 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={24} className="text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      id="cert-img-input"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="cert-img-input"
                      className="inline-block px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                    >
                      Select Image File
                    </label>
                    <input
                      type="text"
                      value={formData.certificateImage}
                      onChange={(e) => {
                        setFormData({ ...formData, certificateImage: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="Or enter certificate image URL"
                      className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                </div>
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
                  <span>Save Certification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
