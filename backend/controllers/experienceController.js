import mongoose from 'mongoose';
import Experience from '../models/Experience.js';
import { getStore, saveStore, generateId } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const defaultExperienceList = [
  {
    role: 'Full Stack Web Development Intern',
    company: 'TechSolutions Innovations',
    location: 'Bangalore, India (Remote)',
    duration: '3 Months (June 2024 - August 2024)',
    startDate: 'June 2024',
    endDate: 'August 2024',
    isCurrent: false,
    description:
      'Engineered responsive user interfaces and scalable RESTful microservices for client-facing web portals.',
    achievements: [
      'Developed responsive React.js components reducing page load time by 25%',
      'Implemented secure JWT-based authentication and role-based access control',
      'Integrated MongoDB aggregation pipelines for real-time analytics dashboards',
    ],
    technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
    certificateUrl: '',
    order: 1,
  },
  {
    role: 'Software Engineering Trainee',
    company: 'Apex Code Labs',
    location: 'Mangalore, India',
    duration: '2 Months (Jan 2024 - Feb 2024)',
    startDate: 'January 2024',
    endDate: 'February 2024',
    isCurrent: false,
    description:
      'Collaborated on core software development, unit testing, and API integration for enterprise management tools.',
    achievements: [
      'Built reusable frontend UI component library with modular CSS',
      'Assisted in designing relational and NoSQL schemas',
      'Participated in Agile sprint planning and code review sessions',
    ],
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Node.js', 'GitHub'],
    certificateUrl: '',
    order: 2,
  },
];

export const getExperience = async (req, res) => {
  try {
    if (isMongoActive()) {
      let list = await Experience.find().sort({ order: 1, createdAt: -1 });
      if (list.length === 0) {
        list = await Experience.insertMany(defaultExperienceList);
      }
      return res.status(200).json({ success: true, count: list.length, data: list });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, count: store.experience.length, data: store.experience });
    }
  } catch (error) {
    const store = getStore();
    res.status(200).json({ success: true, count: store.experience.length, data: store.experience });
  }
};

export const createExperience = async (req, res) => {
  try {
    const {
      role,
      company,
      location,
      duration,
      startDate,
      endDate,
      isCurrent,
      description,
      achievements,
      technologies,
      certificateUrl,
      order,
    } = req.body;

    if (!role || !company || !duration) {
      return res.status(400).json({ success: false, message: 'Role, company, and duration are required' });
    }

    const achievementsArr = Array.isArray(achievements)
      ? achievements
      : typeof achievements === 'string'
      ? achievements.split('\n').map((a) => a.trim()).filter(Boolean)
      : [];

    const techArr = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    if (isMongoActive()) {
      const item = await Experience.create({
        role,
        company,
        location: location || '',
        duration,
        startDate: startDate || '',
        endDate: endDate || '',
        isCurrent: Boolean(isCurrent),
        description: description || '',
        achievements: achievementsArr,
        technologies: techArr,
        certificateUrl: certificateUrl || '',
        order: Number(order) || 0,
      });
      return res.status(201).json({ success: true, message: 'Experience entry added successfully', data: item });
    } else {
      const store = getStore();
      const newItem = {
        _id: generateId(),
        role,
        company,
        location: location || '',
        duration,
        startDate: startDate || '',
        endDate: endDate || '',
        isCurrent: Boolean(isCurrent),
        description: description || '',
        achievements: achievementsArr,
        technologies: techArr,
        certificateUrl: certificateUrl || '',
        order: Number(order) || store.experience.length + 1,
        createdAt: new Date().toISOString(),
      };
      store.experience.push(newItem);
      saveStore(store);
      return res.status(201).json({ success: true, message: 'Experience entry added successfully', data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.achievements && typeof payload.achievements === 'string') {
      payload.achievements = payload.achievements.split('\n').map((a) => a.trim()).filter(Boolean);
    }
    if (payload.technologies && typeof payload.technologies === 'string') {
      payload.technologies = payload.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (isMongoActive()) {
      const updated = await Experience.findByIdAndUpdate(req.params.id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Experience record not found' });
      return res.status(200).json({ success: true, message: 'Experience entry updated successfully', data: updated });
    } else {
      const store = getStore();
      const idx = store.experience.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Experience record not found' });

      store.experience[idx] = { ...store.experience[idx], ...payload };
      saveStore(store);
      return res.status(200).json({
        success: true,
        message: 'Experience entry updated successfully',
        data: store.experience[idx],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    if (isMongoActive()) {
      const deleted = await Experience.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Experience record not found' });
      return res.status(200).json({ success: true, message: 'Experience entry deleted successfully', id: req.params.id });
    } else {
      const store = getStore();
      store.experience = store.experience.filter((x) => x._id !== req.params.id);
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Experience entry deleted successfully', id: req.params.id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
