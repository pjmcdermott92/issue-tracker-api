const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const { errorResponse } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const checkUserPermitted = require('../utils/checkUserPermitted');

// @route   GET /api/v1/tickets
// @desc    Get all Tickets
// @access  Private (Permission only)
exports.getAllTickets = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['tck-view-prj', 'tck-view-usr', 'tck-view-all'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const tickets = await Ticket.find({})
        .populate('created_by', '_id, display_name')
        .populate('assigned_team', '_id, display_name')
});