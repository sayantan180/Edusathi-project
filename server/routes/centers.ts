import { RequestHandler } from "express";
import { Center as CenterType } from "../../shared/api.js";
import Center, { ICenter } from "../models/Center.js";

// GET /api/centers - Get all centers
export const getCenters: RequestHandler = async (req, res) => {
  try {
    const centersFromDb = await Center.find().sort({ createdAt: -1 });

    const centers: CenterType[] = centersFromDb.map((center: ICenter) => ({
      id: center._id.toString(),
      name: center.instituteName,
      domain: center.domain,
      website: `https://${center.domain}`,
      superAdminPath: '/admin',
      createdAt: center.createdAt.toISOString(),
      expireDate: center.expiresAt.toISOString(),
      status: new Date(center.expiresAt) > new Date() ? 'active' : 'inactive',
    }));

    res.json({ centers });
  } catch (error) {
    console.error("Error fetching centers:", error);
    res.status(500).json({ error: "Failed to fetch centers" });
  }
};

// POST /api/centers - Create a new center
export const createCenter: RequestHandler = async (req, res) => {
  try {
    const { instituteName, ownerName, email, domain, plan, razorpay_order_id, razorpay_payment_id } = req.body;

    // Check if domain or email already exists
    const existingCenter = await Center.findOne({ $or: [{ domain }, { email }] });
    if (existingCenter) {
      return res.status(409).json({ error: "A center with this domain or email already exists" });
    }

    // Calculate expiresAt date based on plan duration
    const expiresAt = new Date();
    if (plan === '1 Year Plan') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else if (plan === '3 Year Plan') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 3);
    } else if (plan === '5 Year Plan') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 5);
    } else {
      // Default to 1 year for unknown plans
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const newCenter = new Center({
      instituteName,
      ownerName,
      email,
      domain,
      plan,
      razorpay_order_id,
      razorpay_payment_id,
      expiresAt,
    });

    await newCenter.save();
    res.status(201).json(newCenter);
  } catch (error) {
    console.error("Error creating center:", error);
    res.status(500).json({ error: "Failed to create center" });
  }
};

// GET /api/centers/:id - Get a specific center
export const getCenterById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Center.findById(id);

    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }

    res.json(center);
  } catch (error) {
    console.error("Error fetching center:", error);
    res.status(500).json({ error: "Failed to fetch center" });
  }
};

// DELETE /api/centers/:id - Delete a center
export const deleteCenter: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCenter = await Center.findByIdAndDelete(id);

    if (!deletedCenter) {
      return res.status(404).json({ error: "Center not found" });
    }

    res.json({ message: "Center deleted successfully", center: deletedCenter });
  } catch (error) {
    console.error("Error deleting center:", error);
    res.status(500).json({ error: "Failed to delete center" });
  }
};
