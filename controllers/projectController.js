const Project = require('../models/Project');
const { errorResponse } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const checkUserPermitted = require('../utils/checkUserPermitted');

// @route   POST /api/v1/projects
// @desc    Create new Project
// @access  Private (Permission only)
exports.createProject = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['pjt-create-pjt'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const {
        title,
        description,
        project_manager,
        start_date,
        deadline,
        priority
    } = req.body;

    if (!title || !description ||! start_date) {
        return next(errorResponse('Some required information is missing', 400));
    };

    const newProject = await Project.create({
        title,
        description,
        created_by: req.user._id,
        assigned_team: [{ user: project_manager, roles: ['project manager'] }],
        start_date,
        deadline,
        priority
    });

    res.status(201).json({ success: true, data: newProject });
});

// @route   GET /api/v1/projects
// @desc    Get all Projects
// @access  Private (Permission only)
exports.getAllProjects = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['pjt-view-all', 'pjt-view-asg'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    let projects = await Project.find({})
        .populate('created_by', '_id, display_name')
        .populate({ 
            path: 'assigned_team',
            populate: {
              path: 'user',
              model: 'user',
              select: '_id, display_name'
            }
         })
       

    if (req.user.permissions.includes('pjt-view-asg')) {
        projects = projects.filter(project => project.assigned_team.includes(req.user._id));
    }

    res.json({ success: true, data: projects });
});

// @route   GET /api/v1/projects/:id
// @desc    Get a Project by ID
// @access  Private (Permission only)
exports.getProjectById = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['pjt-view-all', 'pjt-view-asg'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const project = await Project.findById(req.params.id)
        .populate('created_by', '_id, display_name')
        .populate('assigned_team', '_id, display_name ');
    if (!project) return next(errorResponse('Project not found', 404));

    if (req.user.permissions.includes('pjt-view-asg') && !project.assigned_team.includes(req.user._id)) {
        return next(errorResponse('Insufficient Permissions', 403));
    }

    res.json({ success: true, data: project });
});

// @route   PUT /api/v1/projects/:id
// @desc    Edit a Project
// @access  Private (Permission only)
exports.editProject = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['pjt-edit-asg', 'pjt-edit-all'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const project = await Project.findById(req.params.id);
    if (!project) return next(errorResponse('Project not found', 404));
    if (req.user.permissions.includes('pjt-edit-asg') && !project.assigned_team.includes(req.user._id)) {
        return next(errorResponse('Insufficient Permissions', 403));
    }

    const {
        title,
        description,
        project_manager,
        start_date,
        deadline,
        priority
    } = req.body;

    project.title = title;
    project.description = description;
    project.project_manager = project_manager;
    project.start_date = start_date;
    project.deadline = deadline;
    project.priority = priority;
    await project.save();

    res.json({ success: true, data: project });
});

// @route   PUT /api/v1/projects/:id/assign-users
// @desc    Assign users to a project
// @access  Private (Permission only)
exports.assignProjectTeam = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['pjt-usr-asg', 'pjt-usr-all'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const { assigned_team } = req.body;
    if (!assigned_team) return next(errorResponse('No team assigned', 400));

    const project = await Project.findById(req.params.id);
    if (!project) return next(errorResponse('Project not found', 400));

    if (req.user.permissions.includes('pjt-usr-asg') && !project.assigned_team.includes(req.user.id)) {
        return next(errorResponse('Insufficient Permissions', 403));
    }

    project.assigned_team = assigned_team;
    await project.save();

    res.json({ success: true, data: project });
});

// @route   DELETE /api/v1/projects/:id
// @desc    Archive a Project
// @access  Private (Permission only)
exports.archiveProject = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['pjt-del-asg', 'pjt-del-all'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const project = await Project.findById(req.params.id);
    if (!project) return (errorResponse('Project not found', 404));
    if (req.user.permissions.includes('pjt-del-asg') && !project.assigned_team.includes(req.user.id)) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    project.isArchived = true;
    await project.save();

    res.status({ success: true, data: project });
});
