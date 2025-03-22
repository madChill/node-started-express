const slug = require('slug');
const httpStatus = require('http-status');
const Role = require('./roles.model');
const APIError = require('../../utils/APIError');

const roleColumns = {
  roleId: { field: 'roles.id', op: '=' },
  name: { field: 'roles.name', op: 'LIKE' },
  slug: { field: 'roles.slug', op: '=' },
};

const permissionColumns = {
  permissionName: { field: 'permissions.name', op: 'LIKE' },
  permissionSlug: { field: 'permissions.slug', op: '=' },
};

/**
 * Get all roles
 * @public
 */
exports.getRoles = async (req, res, next) => {
  try {
    const sortArray = [];
    if (req.query.sort) {
      let { sort } = req.query;
      sort = sort.split(',');
      sort.forEach((value) => {
        const values = value.split(':');
        let order = values.length > 1 ? values[1] : 'asc';
        let column;
        if (roleColumns[values[0]]) {
          column = roleColumns[values[0]].field;
        }
        if (column) {
          order = order === 'desc' ? 'DESC NULLS LAST' : 'ASC';
          sortArray.push(`${column} ${order}`);
        }
      });
    }

    const roles = await Role.query()
      .eager('[permissions, users]')
      .modifyEager('users', (qb) => {
        qb.select('users.id', 'users.first_name', 'users.last_name', 'users.email');
      })
      .modify((qb) => {
        if (req.query.page && req.query.resultsPerPage) {
          qb.page(req.query.page - 1, req.query.resultsPerPage);
        }

        Object.keys(roleColumns).forEach((param) => {
          if (req.query[param]) {
            const { field, op } = roleColumns[param];
            qb.where(field, op, req.query[param]);
          }
        });

        Object.keys(permissionColumns).forEach((param) => {
          if (req.query[param]) {
            const { field, op } = permissionColumns[param];
            qb.whereExists(
              Role.relatedQuery('permissions').where(field, op, req.query[param]),
            );
          }
        });

        sortArray.forEach((val) => {
          qb.orderByRaw(val);
        });
      });

    const results = roles.results ? roles.results : roles;

    let data = {};
    if (!roles.results) {
      data = {
        data: results,
        total: roles.length,
      };
    } else {
      data = {
        data: results,
        currentPage: req.query.page,
        lastPage: Math.ceil(roles.total / req.query.resultsPerPage),
        perPage: req.query.resultsPerPage,
        total: roles.total,
      };
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Role
 * @public
 */
exports.updateRole = async (req, res, next) => {
  try {
    const { body } = req;
    body.id = req.params.id;

    if (body.name) {
      body.slug = slug(body.name);
    }

    let role = await Role
      .query()
      .upsertGraph(body, Role.upsertOptions);

    role = await Role.query()
      .eager('permissions')
      .where('id', '=', req.params.id)
      .first();

    res.json(role);
  } catch (error) {
    next(Role.checkDuplicateRole(error));
  }
};

exports.addRole = async (req, res, next) => {
  const { body } = req;
  body.slug = slug(req.body.name);
  let role = await Role
    .query()
    .insertGraph(body, Role.insertOptions)
    .returning('*');

  if (role) {
    role = await Role.query()
      .eager('permissions')
      .where('id', '=', role.id)
      .first();
  }
  res.json(role);
};

exports.removeRole = async (req, res, next) => {
  const body = {
    id: req.params.id,
    permissions: [],
    users: [],
  };
  const role = await Role
    .query()
    .upsertGraphAndFetch(body, Role.upsertOptions);

  if (role) {
    await Role.query().deleteById(body.id);
  }

  if (!role) {
    throw new APIError({
      message: 'Role Not Found',
      errors: ['role_not_found'],
      status: httpStatus.BAD_REQUEST,
      isPublic: true,
    });
  }
  res.json({ success: true });
};
