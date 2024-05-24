/* eslint-disable no-await-in-loop */
/* eslint-disable global-require */
const { Model, snakeCaseMappers } = require('objection');
const httpStatus = require('http-status');
const pick = require('lodash/pick');

const APIError = require('../../utils/APIError');

/**
 * User Model
 * @private
 */
class User extends Model {
  static get tableName() {
    return 'users';
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
    const Role = require('../roles/roles.model');
    const Items = require('../items/items.model');

    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'user_roles.user_id',
            to: 'user_roles.role_id',
          },
          to: 'roles.id',
        },
      },   
      items: {
        relation: Model.ManyToManyRelation,
        modelClass: Items,
        join: {
          from: 'users.id',
          through: {
            from: 'user_items.user_id',
            to: 'user_items.item_id',
          },
          to: 'items.id',
        },
      },    
    };
  }

  static transform(user) {
    const userData = pick(user, ['id', 'uuid', 'email', 'firstName', 'lastName', 'role',
      'gender', 'dob', 'phoneNumber'
    ]);
    return userData;
  }

  static checkDuplicateEmail(err) {
    const error = err.nativeError || err;
    if (error.constraint === 'users_email_unique' && error.code === '23505') {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  }

}

User.operableFields = {
  userId: { name: 'users.id', op: '=' },
  email: { name: 'users.email', op: 'ILIKE' },
  firstName: { name: 'users.first_name', op: 'LIKE' },
  lastName: { name: 'users.last_name', op: 'LIKE' },
  fullName: { name: ['users.first_name', 'users.last_name'], op: 'ILIKE' },
  dob: { name: 'users.dob', op: '=' },
  gender: { name: 'users.gender', op: '=' },
  phoneNumber: { name: 'users.phone_number', op: '=' },
};

/**
 * @typedef User
 */
module.exports = User;
