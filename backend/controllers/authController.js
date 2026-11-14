import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { getStore, saveStore } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'rakshith_portfolio_jwt_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoActive()) {
      const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      admin.lastLogin = new Date();
      await admin.save();

      const token = generateToken(admin._id, admin.email, admin.role);
      return res.status(200).json({
        success: true,
        message: 'Admin authentication successful',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
      });
    } else {
      // Fallback local store
      const store = getStore();
      const admin = store.admin;

      if (admin.email.toLowerCase() !== normalizedEmail) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = bcrypt.compareSync(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      admin.lastLogin = new Date().toISOString();
      saveStore(store);

      const token = generateToken(admin._id, admin.email, admin.role);
      return res.status(200).json({
        success: true,
        message: 'Admin authentication successful (Local store active)',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (isMongoActive()) {
      const admin = await Admin.findById(req.admin._id || req.admin.id).select('-password');
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin user not found' });
      }
      return res.status(200).json({ success: true, admin });
    } else {
      const store = getStore();
      const { password, ...adminData } = store.admin;
      return res.status(200).json({ success: true, admin: adminData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password' });
    }

    if (isMongoActive()) {
      const admin = await Admin.findById(req.admin._id || req.admin.id).select('+password');
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

      admin.password = newPassword;
      await admin.save();
      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } else {
      const store = getStore();
      const isMatch = bcrypt.compareSync(currentPassword, store.admin.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

      const salt = bcrypt.genSaltSync(10);
      store.admin.password = bcrypt.hashSync(newPassword, salt);
      saveStore(store);
      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
