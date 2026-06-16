import Deadline from "../models/Deadline.js";


// Create Deadline
export const createDeadline = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Title and due date are required",
      });
    }

    const deadline = await Deadline.create({
      title,
      description,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Deadline created successfully",
      deadline,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get User Deadlines
export const getDeadlines = async (req, res) => {
  try {
    const deadlines = await Deadline.find({
      user: req.user._id,
    }).sort({
      dueDate: 1,
    });

    res.status(200).json(deadlines);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete Deadline
export const deleteDeadline = async (req, res) => {
  try {
    const deadline = await Deadline.findById(
      req.params.id
    );

    if (!deadline) {
      return res.status(404).json({
        message: "Deadline not found",
      });
    }

    if (
      deadline.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await deadline.deleteOne();

    res.status(200).json({
      message: "Deadline deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};