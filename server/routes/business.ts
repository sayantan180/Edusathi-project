import { Request, Response } from 'express';
import Business from '../models/Business.js';
import { z } from 'zod';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().optional(),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  address: z.string().optional()
});

export const createBusiness = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const validatedData = businessSchema.parse(req.body);

    // Check if business already exists with this email
    const existingBusiness = await Business.findOne({ email: validatedData.email });
    if (existingBusiness) {
      return res.status(400).json({ error: 'Business already exists with this email' });
    }

    const business = new Business({
      ...validatedData,
      ownerId: req.user._id
    });

    await business.save();

    res.status(201).json({
      message: 'Business created successfully',
      business
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create business error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const businesses = await Business.find({ isActive: true })
      .select('_id name description email')
      .sort({ name: 1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
