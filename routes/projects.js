const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    editProject,
    assignProjectTeam,
    archiveProject
} = require('../controllers/projectController');

router.route('/')
    .post(createProject)
    .get(getAllProjects)

router.route('/:id')
    .get(getProjectById)
    .put(editProject)
    .delete(archiveProject);

router.put('/:id/assign-users', assignProjectTeam);

module.exports = router;
