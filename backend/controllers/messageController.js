import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { getStore, saveStore, generateId } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields (name, email, subject, message)',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    const senderIp = req.ip || req.headers['x-forwarded-for'] || '';

    if (isMongoActive()) {
      const newMessage = await Message.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        senderIp,
      });
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
        data: newMessage,
      });
    } else {
      const store = getStore();
      const newMessage = {
        _id: generateId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        isRead: false,
        replied: false,
        senderIp,
        createdAt: new Date().toISOString(),
      };
      store.messages.unshift(newMessage);
      saveStore(store);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
        data: newMessage,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit message' });
  }
};

export const getMessages = async (req, res) => {
  try {
    if (isMongoActive()) {
      const messages = await Message.find().sort({ createdAt: -1 });
      const unreadCount = await Message.countDocuments({ isRead: false });
      return res.status(200).json({ success: true, count: messages.length, unreadCount, data: messages });
    } else {
      const store = getStore();
      const unreadCount = store.messages.filter((m) => !m.isRead).length;
      return res.status(200).json({
        success: true,
        count: store.messages.length,
        unreadCount,
        data: store.messages,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessageById = async (req, res) => {
  try {
    if (isMongoActive()) {
      const message = await Message.findById(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
      if (!message.isRead) {
        message.isRead = true;
        await message.save();
      }
      return res.status(200).json({ success: true, data: message });
    } else {
      const store = getStore();
      const msg = store.messages.find((m) => m._id === req.params.id);
      if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
      msg.isRead = true;
      saveStore(store);
      return res.status(200).json({ success: true, data: msg });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleReadStatus = async (req, res) => {
  try {
    if (isMongoActive()) {
      const message = await Message.findById(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

      message.isRead = req.body.isRead !== undefined ? req.body.isRead : !message.isRead;
      await message.save();

      return res.status(200).json({
        success: true,
        message: `Message marked as ${message.isRead ? 'read' : 'unread'}`,
        data: message,
      });
    } else {
      const store = getStore();
      const msg = store.messages.find((m) => m._id === req.params.id);
      if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

      msg.isRead = req.body.isRead !== undefined ? req.body.isRead : !msg.isRead;
      saveStore(store);

      return res.status(200).json({
        success: true,
        message: `Message marked as ${msg.isRead ? 'read' : 'unread'}`,
        data: msg,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    if (isMongoActive()) {
      const message = await Message.findById(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
      await Message.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Message deleted successfully', id: req.params.id });
    } else {
      const store = getStore();
      store.messages = store.messages.filter((m) => m._id !== req.params.id);
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Message deleted successfully', id: req.params.id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
