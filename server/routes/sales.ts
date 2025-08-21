import { Request, Response } from 'express';
import Content from '../models/Content.js';
import Order from '../models/Order.js';
import Revenue from '../models/Revenue.js';
import mongoose from 'mongoose';

export const getMySales = async (req: Request, res: Response) => {
  try {
    // Get all contents by this creator
    const contents = await Content.find({ 
      creatorId: req.user?._id,
      isActive: true 
    });

    const contentIds = contents.map(content => content._id);

    // Aggregate sales data
    const salesData = await Order.aggregate([
      {
        $match: {
          contentId: { $in: contentIds },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: '$contentId',
          totalSales: { $sum: 1 },
          totalEarnings: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'contents',
          localField: '_id',
          foreignField: '_id',
          as: 'content'
        }
      },
      {
        $unwind: '$content'
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'content.businessId',
          foreignField: '_id',
          as: 'business'
        }
      },
      {
        $project: {
          contentId: '$_id',
          contentTitle: '$content.title',
          contentType: '$content.type',
          contentPrice: '$content.price',
          businessName: { $arrayElemAt: ['$business.name', 0] },
          totalSales: 1,
          totalEarnings: 1
        }
      },
      {
        $sort: { totalEarnings: -1 }
      }
    ]);

    // Calculate overall totals
    const overallStats = await Order.aggregate([
      {
        $match: {
          contentId: { $in: contentIds },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalEarnings: { $sum: '$amount' }
        }
      }
    ]);

    const stats = overallStats[0] || { totalSales: 0, totalEarnings: 0 };

    res.json({
      salesData,
      overallStats: {
        totalSales: stats.totalSales,
        totalEarnings: stats.totalEarnings,
        totalContents: contents.length
      }
    });
  } catch (error) {
    console.error('Get my sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContentSales = async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;

    // Verify content belongs to creator
    const content = await Content.findOne({
      _id: contentId,
      creatorId: req.user?._id,
      isActive: true
    }).populate('businessId', 'name');

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Get detailed sales for this content
    const orders = await Order.find({
      contentId: contentId,
      status: 'paid'
    })
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });

    // Calculate stats
    const stats = await Order.aggregate([
      {
        $match: {
          contentId: new mongoose.Types.ObjectId(contentId),
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalEarnings: { $sum: '$amount' }
        }
      }
    ]);

    const salesStats = stats[0] || { totalSales: 0, totalEarnings: 0 };

    res.json({
      content: {
        id: content._id,
        title: content.title,
        type: content.type,
        price: content.price,
        businessName: ((content.businessId as unknown as { name?: string } | null)?.name) ?? null
      },
      stats: salesStats,
      orders
    });
  } catch (error) {
    console.error('Get content sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRevenue = async (contentId: string, amount: number) => {
  try {
    const content = await Content.findById(contentId);
    if (!content) return;

    // Find or create revenue record
    let revenue = await Revenue.findOne({ contentId });
    
    if (!revenue) {
      revenue = new Revenue({
        creatorId: content.creatorId,
        contentId: contentId,
        businessId: content.businessId,
        totalSales: 1,
        totalEarnings: amount
      });
    } else {
      revenue.totalSales += 1;
      revenue.totalEarnings += amount;
    }

    await revenue.save();
  } catch (error) {
    console.error('Update revenue error:', error);
  }
};
