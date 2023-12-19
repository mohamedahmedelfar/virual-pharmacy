const Notification = require('../models/notificationModel');
const Pharmacist = require('../models/pharmacists')

const createNotification = async (req, res) => {
  try {
    const { PharmacistName, message } = req.body;

    // Validate required fields
    if (!PharmacistName || !message ) {
      return res.status(400).json({ message: 'Recipient ID, message are required' });
    }

    // Find the recipient
    const recipient = await Pharmacist.findOne({ name: PharmacistName });

    // Create a new notification
    const notification = new Notification({
      recipient_id: recipient._id,
      message,
    });

    // Save the notification to the database
    await notification.save();

    return res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ message: 'Error creating notification' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Validate notification ID
    if (!notificationId) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    // Find and delete the notification
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification deleted successfully', deletedNotification });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Error deleting notification' });
  }
};

//Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const { username } = req.body;

    // Validate the username
    if (!username) {
      return res.status(400).json({ message: 'Username is required in the request body' });
    }

    // Find the pharmacist by username
    const pharmacist = await Pharmacist.findOne({ UserName: username });
    console.log(pharmacist)

    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    // Get all notifications for the pharmacist based on their ID
    const notifications = await Notification.find({ recipient_id: pharmacist._id });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return res.status(500).json({ message: 'Error getting notifications' });
  }
};



module.exports = { createNotification, deleteNotification , getAllNotifications};
