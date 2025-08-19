import { RequestHandler } from "express";
import { z } from "zod";
import { CreateCenterRequest, CentersResponse, Center } from "@shared/api";

// Helper function to calculate expire date (28 days from creation)
const calculateExpireDate = (createdAt: string): string => {
  const created = new Date(createdAt);
  const expire = new Date(created.getTime() + (28 * 24 * 60 * 60 * 1000)); // 28 days in milliseconds
  return expire.toISOString();
};

// Helper function to calculate status based on expire date
const calculateStatus = (expireDate: string): 'active' | 'inactive' => {
  const now = new Date();
  const expire = new Date(expireDate);
  return now > expire ? 'inactive' : 'active';
};

// In-memory storage for demo purposes
// In production, this would be replaced with a database
let centers: Center[] = [
  (() => {
    const createdAt = new Date().toISOString();
    const expireDate = calculateExpireDate(createdAt);
    return {
      id: "1",
      name: "Demo Educational Center",
      domain: "demo-edu.com",
      website: "https://demo-edu.com",
      superAdminPath: "/admin",
      createdAt,
      expireDate,
      status: calculateStatus(expireDate),
    };
  })(),
  (() => {
    const createdAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago (expired)
    const expireDate = calculateExpireDate(createdAt);
    return {
      id: "2",
      name: "Tech Learning Hub",
      domain: "techlearn.edu",
      website: "https://techlearn.edu",
      superAdminPath: "/admin/dashboard",
      createdAt,
      expireDate,
      status: calculateStatus(expireDate),
    };
  })(),
];

// Validation schema for creating a center
const createCenterSchema = z.object({
  name: z.string().min(1, "Center name is required"),
  domain: z.string().min(1, "Domain is required"),
  website: z.string().url("Invalid website URL"),
  superAdminPath: z.string().min(1, "Super admin path is required"),
});

// GET /api/centers - Get all centers
export const getCenters: RequestHandler = (req, res) => {
  try {
    // Update status for all centers before returning
    const updatedCenters = centers.map(center => ({
      ...center,
      status: calculateStatus(center.expireDate)
    }));

    const response: CentersResponse = {
      centers: updatedCenters.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching centers:", error);
    res.status(500).json({ error: "Failed to fetch centers" });
  }
};

// POST /api/centers - Create a new center
export const createCenter: RequestHandler = (req, res) => {
  try {
    // Validate request body
    const validationResult = createCenterSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }

    const centerData: CreateCenterRequest = validationResult.data;

    // Check if domain already exists
    const existingCenter = centers.find(center => center.domain === centerData.domain);
    if (existingCenter) {
      return res.status(409).json({
        error: "A center with this domain already exists",
      });
    }

    // Create new center
    const createdAt = new Date().toISOString();
    const expireDate = calculateExpireDate(createdAt);
    const newCenter: Center = {
      id: Date.now().toString(), // Simple ID generation for demo
      name: centerData.name,
      domain: centerData.domain,
      website: centerData.website,
      superAdminPath: centerData.superAdminPath,
      createdAt,
      expireDate,
      status: calculateStatus(expireDate),
    };

    // Add to storage
    centers.push(newCenter);

    res.status(201).json(newCenter);
  } catch (error) {
    console.error("Error creating center:", error);
    res.status(500).json({ error: "Failed to create center" });
  }
};

// GET /api/centers/:id - Get a specific center
export const getCenterById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const center = centers.find(c => c.id === id);
    
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
export const deleteCenter: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const centerIndex = centers.findIndex(c => c.id === id);
    
    if (centerIndex === -1) {
      return res.status(404).json({ error: "Center not found" });
    }
    
    const deletedCenter = centers.splice(centerIndex, 1)[0];
    res.json({ message: "Center deleted successfully", center: deletedCenter });
  } catch (error) {
    console.error("Error deleting center:", error);
    res.status(500).json({ error: "Failed to delete center" });
  }
};
