import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { getFileUrl } from '../middleware/upload.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    let user = await User.findOne({ email });
    // If user exists, allow adding a new role if password matches
    if (user) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials for existing email' });
      const currentRoles = Array.isArray(user.roles) && user.roles.length
        ? user.roles
        : (user.role ? [user.role] : ['student']);
      const newRole = (role || 'student').toLowerCase();
      if (!currentRoles.includes(newRole)) {
        user.roles = [...currentRoles, newRole];
        await user.save();
      } else {
        // Ensure roles field is normalized even if already had role
        if (!Array.isArray(user.roles) || !user.roles.length) {
          user.roles = currentRoles;
          await user.save();
        }
      }
      const selectedRole = newRole;
      const access_token = signAccessToken({ sub: user._id.toString(), role: selectedRole });
      const refresh_token = signRefreshToken({ sub: user._id.toString(), role: selectedRole });
      return res.status(200).json({
        user: sanitizeUser(user, selectedRole),
        access_token,
        refresh_token,
      });
    }

    // Create new user with initial role
    const hash = await bcrypt.hash(password, 10);
    const initialRole = (role || 'student').toLowerCase();
    user = await User.create({ name, email, password: hash, roles: [initialRole] });

    const access_token = signAccessToken({ sub: user._id.toString(), role: initialRole });
    const refresh_token = signRefreshToken({ sub: user._id.toString(), role: initialRole });

    res.status(201).json({
      user: sanitizeUser(user, initialRole),
      access_token,
      refresh_token,
    });
  } catch (err) {
    if (err && (err.code === 11000 || String(err?.message || '').toLowerCase().includes('duplicate key'))) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const roles = Array.isArray(user.roles) && user.roles.length
      ? user.roles
      : (user.role ? [user.role] : ['student']);
    // If client requests a role, prefer it if the user has it
    const requestedRole = (role || '').toLowerCase();
    const selectedRole = roles.includes(requestedRole) ? requestedRole : roles[0];

    const access_token = signAccessToken({ sub: user._id.toString(), role: selectedRole });
    const refresh_token = signRefreshToken({ sub: user._id.toString(), role: selectedRole });

    res.json({
      user: sanitizeUser(user, selectedRole),
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body || {};
    if (!refresh_token) return res.status(400).json({ message: 'Missing refresh_token' });

    const payload = verifyRefreshToken(refresh_token);
    const access_token = signAccessToken({ sub: payload.sub, role: payload.role });
    res.json({ access_token });
  } catch (_err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('name email roles role avatarUrl');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const selectedRole = req.user?.role || (Array.isArray(user.roles) && user.roles[0]) || 'student';
    res.json({ user: sanitizeUser(user, selectedRole) });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.avatarUrl = getFileUrl(file.filename);
    await user.save();

    const selectedRole = req.user?.role;
    res.json({ user: sanitizeUser(user, selectedRole) });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function sanitizeUser(user, selectedRole) {
  const roles = Array.isArray(user.roles) && user.roles.length
    ? user.roles
    : (user.role ? [user.role] : ['student']);
  return { id: String(user._id), name: user.name, email: user.email, role: selectedRole || roles[0], roles, avatarUrl: user.avatarUrl || '' };
}
