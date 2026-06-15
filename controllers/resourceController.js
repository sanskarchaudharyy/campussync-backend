import Resource from "../models/Resource.js";
import User from "../models/User.js";

// GET all resources (with optional filters)
export const getResources = async (req, res) => {
  try {
    const { subject, type, branch } = req.query;

    const filter = {};

    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (branch) filter.branch = branch;

    const resources = await Resource.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// POST - Upload a resource
export const uploadResource = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);
    
    const {
      title,
      description,
      subject,
      type,
      branch,
      year,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a PDF file",
      });
    }

    const resource = await Resource.create({
      title,
      description,
      subject,
      type,
      branch,
      year,
      fileUrl: req.file.path,      // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public ID
      uploadedBy: req.user._id,
    });

    // Reward user with 10 points
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: 10 },
      }
    );

    res.status(201).json({
      message: "Resource uploaded successfully",
      resource,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

// PATCH - Increment download count
export const incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { downloads: 1 },
      },
      {
        new: true,
      }
    );

    if (!resource) {
      return res.status(404).json({
        error: "Resource not found",
      });
    }

    res.json(resource);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};