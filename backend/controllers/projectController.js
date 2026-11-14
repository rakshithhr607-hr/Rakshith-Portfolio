import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { getStore, saveStore, generateId } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const defaultProjectsList = [
  {
    title: 'StudentHub',
    tagline: 'Comprehensive Academic & Campus Collaboration Platform',
    description:
      'A full-stack collaborative platform designed for engineering students to centralize lecture notes, track assignments, form study groups, and exchange academic resources in real-time.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    imageUrl: '',
    githubUrl: 'https://github.com/Rakshith-HR/StudentHub',
    liveDemoUrl: 'https://studenthub-demo.vercel.app',
    featured: true,
    category: 'Full Stack',
    order: 1,
  },
  {
    title: 'HumanTwin AI',
    tagline: 'Intelligent Digital Twin & Predictive Health Assistant',
    description:
      'An innovative AI-powered application that creates digital twin models based on health metrics, leveraging machine learning algorithms to forecast lifestyle trends and provide actionable wellness guidance.',
    technologies: ['Python', 'FastAPI', 'React.js', 'TensorFlow', 'MongoDB', 'Chart.js'],
    imageUrl: '',
    githubUrl: 'https://github.com/Rakshith-HR/HumanTwin-AI',
    liveDemoUrl: 'https://humantwin-ai-demo.vercel.app',
    featured: true,
    category: 'AI / ML',
    order: 2,
  },
];

export const getProjects = async (req, res) => {
  try {
    if (isMongoActive()) {
      let projects = await Project.find().sort({ featured: -1, order: 1, createdAt: -1 });
      if (projects.length === 0) {
        projects = await Project.insertMany(defaultProjectsList);
      }
      return res.status(200).json({ success: true, count: projects.length, data: projects });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, count: store.projects.length, data: store.projects });
    }
  } catch (error) {
    const store = getStore();
    res.status(200).json({ success: true, count: store.projects.length, data: store.projects });
  }
};

export const getProjectById = async (req, res) => {
  try {
    if (isMongoActive()) {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.status(200).json({ success: true, data: project });
    } else {
      const store = getStore();
      const project = store.projects.find((p) => p._id === req.params.id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.status(200).json({ success: true, data: project });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      technologies,
      imageUrl,
      githubUrl,
      liveDemoUrl,
      featured,
      category,
      order,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    if (isMongoActive()) {
      const project = await Project.create({
        title,
        tagline: tagline || '',
        description,
        technologies: techArray,
        imageUrl: imageUrl || '',
        githubUrl: githubUrl || '',
        liveDemoUrl: liveDemoUrl || '',
        featured: featured !== undefined ? Boolean(featured) : true,
        category: category || 'Full Stack',
        order: Number(order) || 0,
      });
      return res.status(201).json({ success: true, message: 'Project created successfully', data: project });
    } else {
      const store = getStore();
      const newProject = {
        _id: generateId(),
        title,
        tagline: tagline || '',
        description,
        technologies: techArray,
        imageUrl: imageUrl || '',
        githubUrl: githubUrl || '',
        liveDemoUrl: liveDemoUrl || '',
        featured: featured !== undefined ? Boolean(featured) : true,
        category: category || 'Full Stack',
        order: Number(order) || store.projects.length + 1,
        createdAt: new Date().toISOString(),
      };
      store.projects.push(newProject);
      saveStore(store);
      return res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.technologies && typeof payload.technologies === 'string') {
      payload.technologies = payload.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (isMongoActive()) {
      const updated = await Project.findByIdAndUpdate(req.params.id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.status(200).json({ success: true, message: 'Project updated successfully', data: updated });
    } else {
      const store = getStore();
      const idx = store.projects.findIndex((p) => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Project not found' });

      store.projects[idx] = { ...store.projects[idx], ...payload };
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Project updated successfully', data: store.projects[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (isMongoActive()) {
      const deleted = await Project.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.status(200).json({ success: true, message: 'Project deleted successfully', id: req.params.id });
    } else {
      const store = getStore();
      store.projects = store.projects.filter((p) => p._id !== req.params.id);
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Project deleted successfully', id: req.params.id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
