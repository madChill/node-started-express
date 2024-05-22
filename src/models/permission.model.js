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
}

/**
 * @typedef Client
 */
module.exports = Permission;
