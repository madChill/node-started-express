const { Model, snakeCaseMappers } = require('objection');
const httpStatus = require('http-status');
const pick = require('lodash/pick');

const APIError = require('../../utils/APIError');

/**
 * User Model
 * @private
 */
class Items extends Model {
  static get tableName() {
    return 'items';
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


  static transform(user_items) {
    const data = pick(user_items, ['id', 'picture', 'meta']);
    return data;
  }

  static get relationMappings() {
    const User = require('../users/user.model');

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'items.id',
          through: {
            // user_roles is the join table.
            from: 'user_items.item_id',
            to: 'user_items.user_id',
          },
          to: 'users.id',
        },
      },
    };
  }

}

/**
 * @typedef Items
 */
module.exports = Items;
