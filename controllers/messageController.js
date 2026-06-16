import Group from "../models/Group.js";
import Message from "../models/Message.js";


// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Message text is required",
            });
        }

        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found",
            });
        }

        const isMember = group.members.some(
            member => member.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this group",
            });
        }

        const message = await Message.create({
            group: req.params.groupId,
            sender: req.user._id,
            text,
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: message,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



// Get Group Messages
export const getGroupMessages = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found",
            });
        }

        const isMember = group.members.some(
            member => member.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this group",
            });
        }

        const messages = await Message.find({
            group: req.params.groupId,
        })
            .populate("sender", "name email")
            .sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};