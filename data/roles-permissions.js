exports.USER_PERMISSIONS = {
    'role-edit-roles' : {
        key: 'Define Custom Roles',
        description: 'User can create/edit Custom Roles'
    },
    'usr-view-usr': {
        key: 'View Users',
        description: 'User can see all register users'
    },
    'usr-edit-usr': {
        key: 'Edit User Info',
        description: 'User can edit other users\' info (Name, Display Name)'
    },
    'usr-assign-access': {
        key: 'Assign User Access',
        description: 'User can modify other users\'s permissions'
    },
    'usr-lock-users': {
        key: 'Lock User\'s Accounts',
        description: 'User can lock other user\'s accounts'
    },
    'usr-delete-users': {
        key: 'Delete User\'s Accounts',
        description: 'User can delete other user\'s accounts'
    },
    'pjt-create-pjt': {
        key: 'Create Projects',
        description: 'User can create new Projects'
    },
    'pjt-view-asg': {
        key: 'View Assigned Projects',
        description: 'User can view projects that they are assigned to'
    },
    'pjt-view-all': {
        key: 'View All Projects',
        description: 'User can view all projects'
    },
    'pjt-edit-asg': {
        key: 'Edit Assigned Projects',
        description: 'User can edit projects that they are assigned to'
    },
    'pjt-edit-all': {
        key: 'Edit All Projects',
        description: 'User can edit all open projects'
    },
    'pjt-del-asg': {
        key: 'Delete Assigned Projects',
        description: 'User can delete projects that they are assigned to'
    },
    'pjt-del-all': {
        key: 'Delete All Project',
        description: 'User can delete any open projects'
    },
    'pjt-usr-asg': {
        key: 'Assigned Users to Assigned Projects',
        description: 'User can add and remove users to/from projects they are assigned to'
    },
    'pjt-usr-all': {
        key: 'Assign Users to All Projects',
        description: 'User can can add and remove users from any open project'
    },
    'tck-create-asg': {
        key: 'Add New Ticket to Assigned Projects',
        description: 'User can add tickets to projects that they are assigned to'
    },
    'tck-create-all': {
        key: 'Add New Ticket to Projects',
        description: 'User can add tickets to any active project'
    },
    'tck-view-prj': {
        key: 'View Tickets in Assigned Projects',
        description: 'User can view all tickets in projects that they are assigned to'
    },
    'tck-view-usr': {
        key: 'View Tickets Create by User',
        description: 'User can view only tickets created by them'
    },
    'tck-view-all': {
        key: 'View all tickets',
        description: 'User can view tickets in the database'
    },
    'tck-edit-asg': {
        key: 'Edit Assigned Tickets',
        description: 'User can edit tickets are assigned to'
    },
    'tck-edit-prj': {
        key: 'Edit Tickets in Assigned Projects',
        description: 'User can edit tickets in projects that they are assigned to'
    },
    'tck-edit-all': {
        key: 'Edit All Tickets',
        description: 'User can edit all tickets in the database'
    },
    'tck-asset-vw': {
        key: 'View Assets',
        description: 'User can view assets for any ticket they can view'
    },
    'tck-asset-add': {
        key: 'Add Assets',
        description: 'User can add assets to any ticket they can view'
    },
    'tck-close-asg': {
        key: 'Close Assigned Ticket',
        description: 'User can close tickets assigned to them'
    },
    'tck-close-prj': {
        key: 'Close Tickets in Assigned Projects',
        description: 'User can close tickets in projects assigned to them'
    },
    'tck-close-all': {
        key: 'Close Tickets',
        description: 'User can close any ticket'
    },
}

exports.DEFAULT_ROLES = {
    admin: {
        key: 'Administrator',
        default_permissions: [
            'usr-view-usr',
            'usr-edit-usr',
            'usr-assign-access',
            'usr-lock-users',
            'pjt-create-pjt',
            'pjt-view-all',
            'pjt-edit-all',
            'pjt-del-all',
            'pjt-usr-all',
            'tck-create-all',
            'tck-view-all',
            'tck-edit-all',
            'tck-asset-vw',
            'tck-asset-add',
            'tck-close-all'
        ]
    },
    projMgr: {
        key: 'Project Manager',
        default_permissions: [
            'pjt-view-asg',
            'pjt-user-asg',
            'tck-create-asg',
            'tck-view-prj',
            'tck-edit-prj',
            'tck-asset-vw',
            'tck-asset-add',
            'tck-close-prj'
        ]
    },
    developer: {
        key: 'Developer',
        default_permissions: [
            'pjt-view-asg',
            'tck-create-asg',
            'tck-view-prj',
            'tck-edit-prj',
            'tck-asset-vw',
            'tck-asset-add',
            'tck-close-asg',
        ]
    },
    submitter: {
        key: 'Submitter',
        default_permissions: [
            'pjt-view-asg',
            'tck-create-asg',
            'tck-view-usr',
            'tck-edit-asg',
            'tck-asset-vw',
            'tck-asset-add'
        ]
    },
    user : {
        key: 'User',
        default_permissions: []
    }
};