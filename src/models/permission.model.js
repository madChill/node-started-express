const { Model, snakeCaseMappers } = require('objection');

/**
 * Permission Model
 * @private
 */
class Permission extends Model {
  static get tableName() {
    return 'permissions';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  $beforeInsert() {
    const timestamp = new Date().toISOString();
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }

  $beforeUpdate() {
    const timestamp = new Date().toISOString();
    this.updated_at = timestamp;
  }
  
  static get relationMappings() {
    const User = require('./user.model');
    return {
      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: Permission,
        join: {
          from: 'roles.id',
          through: {
            // role_permissions is the join table.
            from: 'role_permissions.role_id',
            to: 'role_permissions.permission_id',
          },
          to: 'permissions.id',
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          through: {
            // user_roles is the join table.
            from: 'user_roles.role_id',
            to: 'user_roles.user_id',
          },
          to: 'users.id',
        },
      },
    };
  }
}

/**
 * @typedef Client
 */
module.exports = Permission;
