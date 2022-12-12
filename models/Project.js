const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Project title is required']
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    start_date: {
        type: Date,
        required: [true, 'Please specify a Start date']
    },
    deadline: Date,
    priority: {
        type: String,
        default: 'moderate'
    },
    assigned_team: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            roles: [
                {
                type: String,
                default: 'Submitter'
                }
            ]
        }
    ],
    isArchived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('project', projectSchema);
