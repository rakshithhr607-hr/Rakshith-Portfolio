import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  HardDrive,
  BarChart3,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const ResumeManager = ({ triggerToast }) => {
  const { resume, refreshData } = usePortfolio();

  const [selectedFile, setSelectedFile] = useState(null);
  const [customTitle, setCustomTitle] = useState('Rakshith_HR_Resume.pdf');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        triggerToast('Only PDF files are supported for resume uploads', 'error');
        return;
      }
      setSelectedFile(file);
      setCustomTitle(file.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      triggerToast('Please select a PDF file to upload', 'error');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('title', customTitle.trim() || selectedFile.name);

      const res = await api.resume.upload(formData);
      if (res.success) {
        setSelectedFile(null);
        await refreshData();
        triggerToast('New resume uploaded and activated successfully!');
      }
    } catch (err) {
      triggerToast('Failed to upload resume: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume?._id) return;
    if (
      !window.confirm(
        'Are you sure you want to delete the active resume? Visitors will not be able to download it.'
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.resume.delete(resume._id);
      await refreshData();
      triggerToast('Resume removed successfully.');
    } catch (err) {
      triggerToast('Failed to delete resume: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const downloadUrl = api.resume.getDownloadUrl();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Resume Management</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload, replace, and monitor downloads of your professional PDF curriculum vitae.
        </p>
      </div>

      {/* Active Resume Status Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <FileText size={26} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                Active Resume File
              </span>
              <h3 className="text-lg font-bold text-white">
                {resume?.title || 'No active resume uploaded'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resume ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={13} />
                <span>Live on Portfolio</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle size={13} />
                <span>No File Attached</span>
              </span>
            )}
          </div>
        </div>

        {/* Analytics & Metrics */}
        {resume && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono">Total Downloads</p>
                <p className="text-lg font-extrabold text-white font-mono">
                  {resume.downloadsCount || 0}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <HardDrive size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono">File Size</p>
                <p className="text-lg font-extrabold text-white font-mono">
                  {formatFileSize(resume.fileSize)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono">Last Updated</p>
                <p className="text-xs font-bold text-white font-mono">
                  {resume.createdAt
                    ? new Date(resume.createdAt).toLocaleDateString()
                    : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        {resume && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <Download size={15} />
              <span>Test Download Resume</span>
            </a>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              <span>Delete Resume</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload & Replace Form Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Upload size={18} className="text-cyan-400" />
            <span>Upload or Replace Resume</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Uploading a new file will automatically replace the existing resume and make it downloadable instantly across the portfolio.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          {/* Drag & Drop / File Picker Container */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center space-y-3 bg-slate-900/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <FileText size={28} />
            </div>

            <div>
              <input
                type="file"
                accept=".pdf,application/pdf"
                id="resume-file-picker"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume-file-picker"
                className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer shadow-md transition-all hover:scale-105"
              >
                Browse PDF File
              </label>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                {selectedFile ? (
                  <span className="text-cyan-400 font-bold">Selected: {selectedFile.name}</span>
                ) : (
                  'Select a PDF file (Max 10MB)'
                )}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Resume Display Name (Optional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Rakshith_HR_Resume.pdf"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading PDF...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload & Replace Active Resume</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
