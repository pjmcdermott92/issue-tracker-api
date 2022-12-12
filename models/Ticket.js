const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    contact_name: String,
    contact_email: String,
    submitted_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    ticket_description: {
        type: String,
        required: [true, 'Ticket description is required']
    },
    type: {
        type: String,
        required: [true, 'Ticket type is required']
    },
    priority: {
        type: String,
        default: 'moderate'
    },
    status: {
        type: String,
        default: 'Open'
    },
    problem_description: {
        type: String,
        required: [true, 'Problem description is required']
    },
    assigned_team: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            roles: {
                type: String,
                default: 'Submitter'
            }
        }
    ],
    attachments: [
        {
            description: String,
            path: String
        }
    ],
    notes: [
        {
            createdAt: {
                type: Date,
                default: Date.now
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            message: String
        }
    ],
    history: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            value_changed: String,
            old_value: String,
            new_value: String
        }
    ]
});

module.exports = mongoose.model('ticket', ticketSchema);
