import React, { useState, useEffect } from 'react';
import {
  User,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const ProfileManager = ({ triggerToast }) => {
  const { profile, refreshData } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    typingRoles: '',
    intro: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    careerInterests: '',
    profileImage: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        typingRoles: Array.isArray(profile.typingRoles)
          ? profile.typingRoles.join(', ')
          : '',
        intro: profile.intro || '',
        about: profile.about || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        careerInterests: Array.isArray(profile.careerInterests)
          ? profile.careerInterests.join(', ')
          : '',
        profileImage: profile.profileImage || '',
      });
      setImagePreview(profile.profileImage ? api.getFileUrl(profile.profileImage) : '');
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('image', imageFile);
      const res = await api.profile.uploadImage(data);
      if (res.success) {
        setFormData((prev) => ({ ...prev, profileImage: res.imageUrl }));
        setImageFile(null);
        await refreshData();
        triggerToast('Profile photo uploaded and updated successfully!');
      }
    } catch (err) {
      triggerToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = {
        name: formData.name,
        title: formData.title,
        typingRoles: formData.typingRoles
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
        intro: formData.intro,
        about: formData.about,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        careerInterests: formData.careerInterests
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean),
        profileImage: formData.profileImage,
      };

      const res = await api.profile.update(payload);
      if (res.success) {
        await refreshData();
        triggerToast('Profile details updated successfully! Live on portfolio.');
      }
    } catch (err) {
      triggerToast('Failed to update profile: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Profile Management</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your public developer persona, roles, introductory statements, and avatar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-cyan-400" />
            <span>Profile Picture</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-slate-500" />
              )}
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
                >
                  Choose New Photo
                </label>
                {imageFile && (
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={uploadingImage}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5"
                  >
                    {uploadingImage ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    <span>Upload & Save Avatar</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Recommended: Square image (JPEG, PNG, WEBP), max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Personal Information */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
          <h3 className="text-base font-bold text-white">Basic Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rakshith H R"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Full Stack Developer & Engineering Student"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Animated Typing Roles (Comma separated)
            </label>
            <input
              type="text"
              name="typingRoles"
              value={formData.typingRoles}
              onChange={handleChange}
              placeholder="Full Stack Developer, Software Developer, Engineering Student, Problem Solver"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              These will cycle through the animated typing effect in the hero header.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Short Professional Intro
            </label>
            <textarea
              rows={2}
              name="intro"
              value={formData.intro}
              onChange={handleChange}
              placeholder="Short paragraph shown in hero section..."
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              About Me (Comprehensive Story)
            </label>
            <textarea
              rows={6}
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Full personal background, academic focus, and career vision..."
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
          <h3 className="text-base font-bold text-white">Contact & Location</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mangalore, Karnataka, India"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Career Interests (Comma separated)
            </label>
            <input
              type="text"
              name="careerInterests"
              value={formData.careerInterests}
              onChange={handleChange}
              placeholder="Full Stack Web Development, Distributed Systems, AI, Open Source"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
