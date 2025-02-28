const { ObjectId } = require('mongodb');
const { connectDB, db } = require('../config/db.config');
const notificationCollection = db.collection("notifications");


const getAllNotifications = async (req, res) => {
    try {
        await connectDB();
        const userId = req.user.userId; // Get user ID from JWT token
        const notifications = await notificationCollection.find({isDeleted:false}).sort({ createdAt: -1 }).toArray();
        // Mark notifications as seen/unseen
        notifications.forEach((object) => {
            object.isSeen = object.readBy && object.readBy.some(id => id.toString() === userId.toString());
        });
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const markAsRead = async (req, res) => {
    try {
        await connectDB();
        const userId = req.user.userId; // Get user ID from JWT token
        const notificationId = req.params.id;
        // Validate ObjectId
        if (!ObjectId.isValid(notificationId)) {
            return res.status(400).json({ message: "Invalid Notification ID format" });
        }
        // Mark notification as read (avoid duplicates using $addToSet)
        const notification = await notificationCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(notificationId) },
            { $addToSet: { readBy: ObjectId.createFromHexString(userId) } }, // Prevent duplicate entries
            { returnDocument: "after" }
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        return res.status(200).json(notification);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



module.exports = { getAllNotifications, markAsRead }