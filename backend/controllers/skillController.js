import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import { getStore, saveStore, generateId } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const defaultSkillsList = [
  { name: 'C', category: 'Languages', proficiency: 85, level: 'Advanced', iconName: 'Terminal' },
  { name: 'Java', category: 'Languages', proficiency: 85, level: 'Advanced', iconName: 'Coffee' },
  { name: 'Python', category: 'Languages', proficiency: 90, level: 'Expert', iconName: 'FileCode' },
  { name: 'JavaScript', category: 'Languages', proficiency: 90, level: 'Expert', iconName: 'Braces' },
  { name: 'HTML', category: 'Frontend', proficiency: 95, level: 'Expert', iconName: 'Globe' },
  { name: 'CSS', category: 'Frontend', proficiency: 90, level: 'Expert', iconName: 'Palette' },
  { name: 'React.js', category: 'Frontend', proficiency: 90, level: 'Expert', iconName: 'Atom' },
  { name: 'Node.js', category: 'Backend & Databases', proficiency: 85, level: 'Advanced', iconName: 'Server' },
  { name: 'MongoDB', category: 'Backend & Databases', proficiency: 85, level: 'Advanced', iconName: 'Database' },
];

export const getSkills = async (req, res) => {
  try {
    if (isMongoActive()) {
      let skills = await Skill.find().sort({ order: 1, createdAt: 1 });
      if (skills.length === 0) {
        skills = await Skill.insertMany(defaultSkillsList);
      }
      return res.status(200).json({ success: true, count: skills.length, data: skills });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, count: store.skills.length, data: store.skills });
    }
  } catch (error) {
    const store = getStore();
    res.status(200).json({ success: true, count: store.skills.length, data: store.skills });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency, level, iconName, order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Skill name is required' });

    if (isMongoActive()) {
      const skill = await Skill.create({
        name,
        category: category || 'Languages',
        proficiency: Number(proficiency) || 80,
        level: level || 'Advanced',
        iconName: iconName || 'Code',
        order: Number(order) || 0,
      });
      return res.status(201).json({ success: true, message: 'Skill added successfully', data: skill });
    } else {
      const store = getStore();
      const newSkill = {
        _id: generateId(),
        name,
        category: category || 'Languages',
        proficiency: Number(proficiency) || 80,
        level: level || 'Advanced',
        iconName: iconName || 'Code',
        order: Number(order) || store.skills.length + 1,
        createdAt: new Date().toISOString(),
      };
      store.skills.push(newSkill);
      saveStore(store);
      return res.status(201).json({ success: true, message: 'Skill added successfully', data: newSkill });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    if (isMongoActive()) {
      const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Skill not found' });
      return res.status(200).json({ success: true, message: 'Skill updated successfully', data: updated });
    } else {
      const store = getStore();
      const idx = store.skills.findIndex((s) => s._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Skill not found' });

      store.skills[idx] = { ...store.skills[idx], ...req.body };
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Skill updated successfully', data: store.skills[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    if (isMongoActive()) {
      const deleted = await Skill.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Skill not found' });
      return res.status(200).json({ success: true, message: 'Skill deleted successfully', id: req.params.id });
    } else {
      const store = getStore();
      store.skills = store.skills.filter((s) => s._id !== req.params.id);
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Skill deleted successfully', id: req.params.id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
