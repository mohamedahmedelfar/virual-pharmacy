
const { default: mongoose } = require('mongoose');
const Conversation = require('../models/Convesation');
const Message = require('../models/Messages');
const Pharmacist = require('../models/pharmacists');
const Patient = require('../models/regesterAsPatient');


// get conversation between two users

const getConversationPatient = async (req, res) => {
    try {
        const { senderName, receiverName } = req.body;

        // Validate required fields
        if (!senderName || !receiverName) {
            return res.status(400).json({ message: 'Sender Name and receiver Name are required' });
        }

        const patient = await Patient.findOne({ UserName: senderName });
        const pharmacist = await Pharmacist.findOne({ UserName: receiverName });
        const conversation = await Conversation.findOne({ senderId: patient._id, receiverId: pharmacist._id });
        const conversation2 = await Conversation.findOne({ senderId: pharmacist._id, receiverId: patient._id });
        if (!conversation && !conversation2) {
            // If no conversation is found, create a new one
            const newConversation = new Conversation({
                senderId: patient._id,
                receiverId: pharmacist._id,
            });
            await newConversation.save();
            return res.status(200).json({ message: 'No conversation was found. A new one was created successfully', conversation: newConversation ,consversationID: newConversation._id });
        }
        //get all messages in the conversation
        if (conversation) {
            const messages = await Message.find({ conversationId: conversation._id });
            return res.status(200).json({ message: 'Conversation retrieved successfully', conversation, messages ,consversationID: conversation._id});
        }
        else {
            const messages = await Message.find({ conversationId: conversation2._id });
            return res.status(200).json({ message: 'Conversation retrieved successfully', conversation, messages ,consversationID: conversation2._id});
        }
    } catch (error) {
        console.error('Error retrieving conversation:', error);
        return res.status(500).json({ message: 'Error retrieving conversation' });
    }
}

// get conversation between two users for pharmacist

const getConversationPharmacistForDoctor = async (req, res) => {
    try {
        const { senderName, receiverName } = req.body;

        // Validate required fields
        if (!senderName || !receiverName) {
            return res.status(400).json({ message: 'Sender Name and receiver Name are required' });
        }

        const doctors = mongoose.connection.collection('doctors');
        const pharmacist = await Pharmacist.findOne({ UserName: senderName });
        const patient = await doctors.findOne({ username: receiverName });


        const conversation = await Conversation.findOne({ senderId: pharmacist._id, receiverId: patient._id });
        const conversation2 = await Conversation.findOne({ senderId: patient._id, receiverId: pharmacist._id });

        if (!conversation && !conversation2) {
            // If no conversation is found, create a new one
            const newConversation = new Conversation({
                senderId: pharmacist._id,
                receiverId: patient._id,
            });
            await newConversation.save();
            return res.status(200).json({ message: 'No conversation was found. A new one was created successfully', conversation: newConversation , consversationID: newConversation._id});
        }
        //get all messages in the conversation
        if (conversation) {
            const messages = await Message.find({ conversationId: conversation._id });
            return res.status(200).json({ message: 'Conversation retrieved successfully', conversation, messages , consversationID: conversation._id });
        }
        else {
            const messages = await Message.find({ conversationId: conversation2._id });
            return res.status(200).json({ message: 'Conversation retrieved successfully', conversation2, messages , consversationID: conversation2._id });
        }
    } catch (error) {
        console.error('Error retrieving conversation:', error);
        return res.status(500).json({ message: 'Error retrieving conversation' });
    }
}
const getConversationPharmacist = async (req, res) => {
    try {
        const { senderName, receiverName } = req.body;

        // Validate required fields
        if (!senderName || !receiverName) {
            return res.status(400).json({ message: 'Sender Name and receiver Name are required' });
        }

        const doctors = mongoose.connection.collection('doctors');
        const pharmacist = await Pharmacist.findOne({ UserName: senderName });
        const patient = await Patient.findOne({ UserName: receiverName });


        const conversation = await Conversation.findOne({ senderId: pharmacist._id, receiverId: patient._id });
        const conversation2 = await Conversation.findOne({ senderId: patient._id, receiverId: pharmacist._id });

        if (!conversation && !conversation2) {
            // If no conversation is found, create a new one
            const newConversation = new Conversation({
                senderId: pharmacist._id,
                receiverId: patient._id,
            });
            await newConversation.save();
            return res.status(200).json({ message: 'No conversation was found. A new one was created successfully', conversation: newConversation , consversationID: newConversation._id});
        }
        //get all messages in the conversation
        if (conversation) {
            const messages = await Message.find({ conversationId: conversation._id });
            return res.status(200).json({ message: 'Conversation retrieved successfully', conversation, messages , consversationID: conversation._id });
        }
        else {
            const messages = await Message.find({ conversationId: conversation2._id });
            return res.status(200).json({ message: 'Conversation retrieved successfully', conversation2, messages , consversationID: conversation2._id });
        }
    } catch (error) {
        console.error('Error retrieving conversation:', error);
        return res.status(500).json({ message: 'Error retrieving conversation' });
    }
}

// send a message

const sendMessagePharmacist = async (req, res) => {
    try {
        const { conversationId, senderName, text } = req.body;

        const pharmacist = await Pharmacist.findOne({ UserName: senderName });


        // Validate required fields
        if (!conversationId || !senderName || !text) {
            return res.status(400).json({ message: 'Conversation ID, sender Name and text are required' });
        }
        const conv = await Conversation.findById(conversationId);
        if (!conv) {
            return res.status(400).json({ message: 'Conversation ID is invalid' });
        }

        // Create a new message
        const message = new Message({
            conversationId,
            senderId: pharmacist._id,
            text,
            senderName: senderName,
        });

        // Save the message to the database
        await message.save();

        return res.status(201).json({ message: 'Message sent successfully', message });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Error sending message' });
    }
}

const sendMessagePatient = async (req, res) => {
    try {
        const { conversationId, senderName, text } = req.body;

        const pharmacist = await Patient.findOne({ UserName: senderName });


        // Validate required fields
        if (!conversationId || !senderName || !text) {
            return res.status(400).json({ message: 'Conversation ID, sender Name and text are required' });
        }
        const conv = await Conversation.findById(conversationId);
        if (!conv) {
            return res.status(400).json({ message: 'Conversation ID is invalid' });
        }

        // Create a new message
        const message = new Message({
            conversationId,
            senderId: pharmacist._id,
            text,
            senderName: senderName,
        });

        // Save the message to the database
        await message.save();

        return res.status(201).json({ message: 'Message sent successfully', message });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Error sending message' });
    }
}

// get messages in a conversation

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.body;

        // Validate required fields
        if (!conversationId) {
            return res.status(400).json({ message: 'Conversation ID is required' });
        }

        // Find the messages in the conversation
        const messages = await Message.find({ conversationId });

        return res.status(200).json({ message: 'Messages retrieved successfully', messages });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return res.status(500).json({ message: 'Error retrieving messages' });
    }
}

module.exports = { getConversationPatient, getConversationPharmacist, sendMessagePharmacist, getMessages ,sendMessagePatient,getConversationPharmacistForDoctor};
