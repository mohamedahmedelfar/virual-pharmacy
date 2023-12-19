//Create a schema for messages in the database with the following fields: 1-Text 2-convesationId 3-senderId 4-date

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        text: {
        type: String,
        },
        conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        },
        senderId: {
        type: Schema.Types.ObjectId,
        },
        senderName: {
            type: String,
        },
    },
    { timestamps: true }
    );

module.exports = mongoose.model('Message', MessageSchema);
