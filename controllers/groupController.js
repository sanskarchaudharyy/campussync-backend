import Group from "../models/Group.js";

// Create Group
export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Group name is required",
            });
        }

        const group = await Group.create({
            name,
            description,
            createdBy: req.user._id,
            members: [req.user._id],
        });

        res.status(201).json({
            message: "Group created successfully",
            group,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Groups
export const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate("createdBy", "name email")
            .populate("members", "name email");

        res.status(200).json(groups);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Join Group
export const joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                message: "Group not found",
            });
        }

        const alreadyJoined = group.members.some(
            (member) =>
                member.toString() === req.user._id.toString()
        );

        if (alreadyJoined) {
            return res.status(400).json({
                message: "You are already a member of this group",
            });
        }

        group.members.push(req.user._id);

        await group.save();

        res.status(200).json({
            message: "Joined group successfully",
            group,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};