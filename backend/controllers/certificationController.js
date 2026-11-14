import mongoose from 'mongoose';
import Certification from '../models/Certification.js';
import { getStore, saveStore, generateId } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const defaultCertificationsList = [
  {
    title: 'Full Stack Web Development Professional',
    issuer: 'Meta / Coursera',
    issueDate: '2024',
    expiryDate: 'No Expiration',
    credentialId: 'META-FSWD-92837',
    credentialUrl: 'https://coursera.org/verify/example',
    certificateImage: '',
    skillsCovered: ['React.js', 'Node.js', 'REST APIs', 'Database Architecture', 'Version Control'],
    order: 1,
  },
  {
    title: 'Python for Data Science & Machine Learning',
    issuer: 'IBM',
    issueDate: '2023',
    expiryDate: 'No Expiration',
    credentialId: 'IBM-PYDS-83719',
    credentialUrl: 'https://coursera.org/verify/example2',
    certificateImage: '',
    skillsCovered: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Data Visualization'],
    order: 2,
  },
  {
    title: 'MongoDB Certified Associate Developer',
    issuer: 'MongoDB University',
    issueDate: '2024',
    expiryDate: 'No Expiration',
    credentialId: 'MDB-DEV-49201',
    credentialUrl: 'https://university.mongodb.com/certificates/example3',
    certificateImage: '',
    skillsCovered: ['MongoDB Atlas', 'Aggregation Framework', 'Indexing', 'Mongoose ODM'],
    order: 3,
  },
];

export const getCertifications = async (req, res) => {
  try {
    if (isMongoActive()) {
      let list = await Certification.find().sort({ order: 1, createdAt: -1 });
      if (list.length === 0) {
        list = await Certification.insertMany(defaultCertificationsList);
      }
      return res.status(200).json({ success: true, count: list.length, data: list });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, count: store.certifications.length, data: store.certifications });
    }
  } catch (error) {
    const store = getStore();
    res.status(200).json({ success: true, count: store.certifications.length, data: store.certifications });
  }
};

export const createCertification = async (req, res) => {
  try {
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, certificateImage, skillsCovered, order } =
      req.body;

    if (!title || !issuer) {
      return res.status(400).json({ success: false, message: 'Title and issuer are required' });
    }

    const skillsArr = Array.isArray(skillsCovered)
      ? skillsCovered
      : typeof skillsCovered === 'string'
      ? skillsCovered.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (isMongoActive()) {
      const item = await Certification.create({
        title,
        issuer,
        issueDate: issueDate || '',
        expiryDate: expiryDate || 'No Expiration',
        credentialId: credentialId || '',
        credentialUrl: credentialUrl || '',
        certificateImage: certificateImage || '',
        skillsCovered: skillsArr,
        order: Number(order) || 0,
      });
      return res.status(201).json({ success: true, message: 'Certification added successfully', data: item });
    } else {
      const store = getStore();
      const newItem = {
        _id: generateId(),
        title,
        issuer,
        issueDate: issueDate || '',
        expiryDate: expiryDate || 'No Expiration',
        credentialId: credentialId || '',
        credentialUrl: credentialUrl || '',
        certificateImage: certificateImage || '',
        skillsCovered: skillsArr,
        order: Number(order) || store.certifications.length + 1,
        createdAt: new Date().toISOString(),
      };
      store.certifications.push(newItem);
      saveStore(store);
      return res.status(201).json({ success: true, message: 'Certification added successfully', data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.skillsCovered && typeof payload.skillsCovered === 'string') {
      payload.skillsCovered = payload.skillsCovered.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (isMongoActive()) {
      const updated = await Certification.findByIdAndUpdate(req.params.id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Certification not found' });
      return res.status(200).json({ success: true, message: 'Certification updated successfully', data: updated });
    } else {
      const store = getStore();
      const idx = store.certifications.findIndex((c) => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Certification not found' });

      store.certifications[idx] = { ...store.certifications[idx], ...payload };
      saveStore(store);
      return res.status(200).json({
        success: true,
        message: 'Certification updated successfully',
        data: store.certifications[idx],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    if (isMongoActive()) {
      const deleted = await Certification.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Certification not found' });
      return res.status(200).json({ success: true, message: 'Certification deleted successfully', id: req.params.id });
    } else {
      const store = getStore();
      store.certifications = store.certifications.filter((c) => c._id !== req.params.id);
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Certification deleted successfully', id: req.params.id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadCertificateImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, message: 'Certificate image uploaded successfully', imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
