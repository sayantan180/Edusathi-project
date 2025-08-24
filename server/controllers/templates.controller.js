import TemplateSelection from '../models/TemplateSelection.js';
import Center from '../models/Center.js';
import User from '../models/User.js';

// POST /api/templates/apply
// Requires authenticateToken middleware to set req.user
export const applyTemplate = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.sub;
    const { templateId } = req.body || {};
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!templateId) return res.status(400).json({ error: 'templateId is required' });

    // Lookup user to get email
    const user = await User.findById(userId).select('email');
    if (!user?.email) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the Center document for this user's email
    const updatedCenter = await Center.findOneAndUpdate(
      { email: user.email },
      { $set: { templateId } },
      { new: true }
    );

    // Persist selection history (non-blocking with await for consistency)
    const doc = new TemplateSelection({ userId, templateId, appliedAt: new Date() });
    await doc.save();

    return res.json({
      ok: true,
      templateId,
      center: updatedCenter
        ? { id: updatedCenter._id.toString(), email: updatedCenter.email, templateId: updatedCenter.templateId }
        : null,
      selection: { id: doc._id.toString(), userId: doc.userId.toString(), templateId: doc.templateId, appliedAt: doc.appliedAt },
    });
  } catch (error) {
    console.error('applyTemplate error:', error);
    return res.status(500).json({ error: 'Failed to save template selection' });
  }
};

export default { applyTemplate };
