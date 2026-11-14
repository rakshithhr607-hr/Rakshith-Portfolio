import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import Profile from '../models/Profile.js';
import { getStore, saveStore, generateId } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

export const getActiveResume = async (req, res) => {
  try {
    if (isMongoActive()) {
      let resume = await Resume.findOne({ isActive: true }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: resume });
    } else {
      const store = getStore();
      const active = store.resumes.find((r) => r.isActive) || store.resumes[0] || null;
      return res.status(200).json({ success: true, data: active });
    }
  } catch (error) {
    const store = getStore();
    const active = store.resumes.find((r) => r.isActive) || store.resumes[0] || null;
    res.status(200).json({ success: true, data: active });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ success: false, message: 'Only PDF format resumes are allowed' });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;

    if (isMongoActive()) {
      await Resume.updateMany({}, { isActive: false });
      const newResume = await Resume.create({
        title: req.body.title || req.file.originalname || 'Rakshith_HR_Resume.pdf',
        filename: req.file.filename,
        filePath: relativeUrl,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        isActive: true,
        downloadsCount: 0,
      });
      await Profile.findOneAndUpdate({}, { resumeUrl: relativeUrl });
      return res.status(201).json({
        success: true,
        message: 'Resume uploaded and activated successfully',
        data: newResume,
      });
    } else {
      const store = getStore();
      store.resumes.forEach((r) => {
        r.isActive = false;
      });
      const newResume = {
        _id: generateId(),
        title: req.body.title || req.file.originalname || 'Rakshith_HR_Resume.pdf',
        filename: req.file.filename,
        filePath: relativeUrl,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        isActive: true,
        downloadsCount: 0,
        createdAt: new Date().toISOString(),
      };
      store.resumes.unshift(newResume);
      store.profile.resumeUrl = relativeUrl;
      saveStore(store);
      return res.status(201).json({
        success: true,
        message: 'Resume uploaded and activated successfully',
        data: newResume,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadResume = async (req, res) => {
  try {
    let resume = null;

    if (isMongoActive()) {
      resume = await Resume.findOne({ isActive: true }).sort({ createdAt: -1 });
    } else {
      const store = getStore();
      resume = store.resumes.find((r) => r.isActive) || store.resumes[0] || null;
    }

    if (!resume || !resume.filename) {
      return res.status(404).json({ success: false, message: 'Resume has not been uploaded yet.' });
    }

    const fullPath = path.join(uploadsDir, resume.filename);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, message: 'Resume file not found on server.' });
    }

    if (isMongoActive()) {
      resume.downloadsCount += 1;
      await resume.save();
    } else {
      const store = getStore();
      const r = store.resumes.find((x) => x._id === resume._id);
      if (r) r.downloadsCount = (r.downloadsCount || 0) + 1;
      saveStore(store);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title || 'Rakshith_HR_Resume.pdf'}"`);
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    let filenameToDelete = '';

    if (isMongoActive()) {
      const resume = await Resume.findById(req.params.id);
      if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

      filenameToDelete = resume.filename;
      await Resume.findByIdAndDelete(req.params.id);

      if (resume.isActive) {
        const nextActive = await Resume.findOne().sort({ createdAt: -1 });
        if (nextActive) {
          nextActive.isActive = true;
          await nextActive.save();
          await Profile.findOneAndUpdate({}, { resumeUrl: nextActive.filePath });
        } else {
          await Profile.findOneAndUpdate({}, { resumeUrl: '' });
        }
      }
    } else {
      const store = getStore();
      const resume = store.resumes.find((r) => r._id === req.params.id);
      if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

      filenameToDelete = resume.filename;
      store.resumes = store.resumes.filter((r) => r._id !== req.params.id);
      if (resume.isActive && store.resumes.length > 0) {
        store.resumes[0].isActive = true;
        store.profile.resumeUrl = store.resumes[0].filePath;
      } else if (store.resumes.length === 0) {
        store.profile.resumeUrl = '';
      }
      saveStore(store);
    }

    if (filenameToDelete) {
      const fullPath = path.join(uploadsDir, filenameToDelete);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.warn('File removal skipped:', e.message);
        }
      }
    }

    res.status(200).json({ success: true, message: 'Resume deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
