const userRolesRepository = require('./usersRoles.repository');
const userRepository = require('../users/user.repository');
const roleRepository = require('../roles/role.repository');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

class UserRolesService {
    instance = null;
    constructor() {
        if (!UserRolesService.instance) {
            UserRolesService.instance = this;
        }
        return UserRolesService.instance;
    }
    getInstances() {
        if (!UserRolesService.instance) {
            UserRolesService.instance = new UserRolesService();
        }
        return UserRolesService.instance;
    }
    /**
     * Assign a role to multiple users
     * @param {Array<number>} userIds Array of user IDs
     * @param {number} roleId Role ID
     * @param {Object} meta Metadata for all assignments
     * @returns {Promise<Object>} Result of operation
     */
    async assignRoleToMultipleUsers(userIds, roleId, meta = {}) {
        // Verify all users exist
        const users = await userRepository.findByIds(userIds);
        if (users.length !== userIds.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'One or more users not found');
        }

        // Verify role exists
        const role = await roleRepository.findById(roleId);
        if (!role) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
        }

        return userRolesRepository.assignRoleToUsers(userIds, roleId, meta);
    }
}

module.exports = new UserRolesService();