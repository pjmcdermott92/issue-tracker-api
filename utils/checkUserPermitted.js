const checkUserPermitted = (user, allowedPermissions) => {
    const assignedPermissions = user.permissions;
    if (!allowedPermissions.some(permission => assignedPermissions.includes(permission))) {
        return false;
    } else {
        return true;
    }
}

module.exports = checkUserPermitted;
