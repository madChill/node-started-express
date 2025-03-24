const { Op } = require('sequelize');
const UserRole = require('./usersRoles.model');
class UserRolesRepository {
  /**
   * Assign a role to multiple users
   * @param {Array<number>} userIds Array of user IDs
   * @param {number} roleId Role ID
   * @param {Object} meta Metadata to apply to all assignments
   * @returns {Promise<Object>} Results of the operation
   */
  async assignRoleToUsers(userIds, roleId, meta = {}) {
    // Get existing assignments for this role
    const existingAssignments = await UserRole.findAll({
      where: {
        userId: { [Op.in]: userIds },
        roleId
      },
      attributes: ['userId']
    });
    
    // Extract user IDs that already have this role
    const existingUserIds = existingAssignments.map(a => a.userId);
    
    // Filter out users that already have this role
    const newUserIds = userIds.filter(id => !existingUserIds.includes(id));
    
    // Create new assignments
    const assignmentsToCreate = newUserIds.map(userId => ({
      userId,
      roleId,
      meta
    }));
    
    let created = [];
    if (assignmentsToCreate.length > 0) {
      created = await UserRole.bulkCreate(assignmentsToCreate);
    }
    
    return {
      created,
      existing: existingAssignments,
      summary: {
        total: userIds.length,
        created: created.length,
        existing: existingUserIds.length
      }
    };
  }
}

module.exports = new UserRolesRepository();