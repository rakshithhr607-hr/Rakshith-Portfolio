import mongoose from 'mongoose';
import Education from '../models/Education.js';
import { getStore, saveStore, generateId } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const defaultEducationList = [
  {
    institution: 'AJ Institute of Engineering and Technology, Mangalore',
    degree: 'Bachelor of Engineering (B.E.)',
    department: 'Information Science and Engineering',
    startYear: '2021',
    endYear: '2025',
    grade: '8.8 CGPA',
    location: 'Mangalore, Karnataka',
    description:
      'Rigorous academic coursework covering Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Web Technologies, and Software Engineering.',
    highlights: [
      'Active contributor to Technical Coding Club',
      'Completed multiple academic full-stack & AI capstone projects',
      'Consistent academic excellence in ISE curriculum',
    ],
    order: 1,
  },
];

export const getEducation = async (req, res) => {
  try {
    if (isMongoActive()) {
      let list = await Education.find().sort({ order: 1, createdAt: -1 });
      if (list.length === 0) {
        list = await Education.insertMany(defaultEducationList);
      }
      return res.status(200).json({ success: true, count: list.length, data: list });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, count: store.education.length, data: store.education });
    }
  } catch (error) {
    const store = getStore();
    res.status(200).json({ success: true, count: store.education.length, data: store.education });
  }
};

export const createEducation = async (req, res) => {
  try {
    const { institution, degree, department, startYear, endYear, grade, location, description, highlights, order } =
      req.body;

    if (!institution || !degree || !department) {
      return res.status(400).json({ success: false, message: 'Institution, degree, and department are required' });
    }

    const highlightsArr = Array.isArray(highlights)
      ? highlights
      : typeof highlights === 'string'
      ? highlights.split('\n').map((h) => h.trim()).filter(Boolean)
      : [];

    if (isMongoActive()) {
      const item = await Education.create({
        institution,
        degree,
        department,
        startYear: startYear || '',
        endYear: endYear || '',
        grade: grade || '',
        location: location || '',
        description: description || '',
        highlights: highlightsArr,
        order: Number(order) || 0,
      });
      return res.status(201).json({ success: true, message: 'Education record added successfully', data: item });
    } else {
      const store = getStore();
      const newItem = {
        _id: generateId(),
        institution,
        degree,
        department,
        startYear: startYear || '',
        endYear: endYear || '',
        grade: grade || '',
        location: location || '',
        description: description || '',
        highlights: highlightsArr,
        order: Number(order) || store.education.length + 1,
        createdAt: new Date().toISOString(),
      };
      store.education.push(newItem);
      saveStore(store);
      return res.status(201).json({ success: true, message: 'Education record added successfully', data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.highlights && typeof payload.highlights === 'string') {
      payload.highlights = payload.highlights.split('\n').map((h) => h.trim()).filter(Boolean);
    }

    if (isMongoActive()) {
      const updated = await Education.findByIdAndUpdate(req.params.id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Education record not found' });
      return res.status(200).json({ success: true, message: 'Education record updated successfully', data: updated });
    } else {
      const store = getStore();
      const idx = store.education.findIndex((e) => e._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Education record not found' });

      store.education[idx] = { ...store.education[idx], ...payload };
      saveStore(store);
      return res.status(200).json({
        success: true,
        message: 'Education record updated successfully',
        data: store.education[idx],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    if (isMongoActive()) {
      const deleted = await Education.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Education record not found' });
      return res.status(200).json({ success: true, message: 'Education record deleted successfully', id: req.params.id });
    } else {
      const store = getStore();
      store.education = store.education.filter((e) => e._id !== req.params.id);
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Education record deleted successfully', id: req.params.id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
