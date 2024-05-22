/* eslint-disable global-require */
const { Model, snakeCaseMappers } = require('objection');
const httpStatus = require('http-status');
const Permission = require('./permission.model');
const APIError = require('../utils/APIError');

/**
 * Role Model
 * @private
 */
class Role extends Model {
  static get tableName() {
    return 'roles';
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
    this.updatedAt = timestamp;
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

  static checkDuplicateRole(err) {
    const error = err.nativeError || err;
    if (error.constraint === 'roles_name_unique' || error.constraint === 'roles_slug_unique' || error.code === '23505') {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'name',
          location: 'body',
          messages: ['"Role Name" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  }
}

Role.operableFields = {
  roleName: { name: 'roles.name', op: 'LIKE' },
  roleSlug: { name: 'roles.slug', op: '=' },
};

Role.insertOptions = {
  relate: ['permissions'],
};

Role.upsertOptions = {
  unrelate: ['permissions', 'users'],
  relate: ['permissions', 'users'],
  noInsert: ['users'],
  noUpdate: ['users'],
  noDelete: ['permissions', 'users'],
};

/**
 * @typedef Client
 */
module.exports = Role;
