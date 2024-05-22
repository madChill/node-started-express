/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').insert([
    {
      "email":"admin@gmail.com",
      "password":"$2a$10$0.rJ4oVNsZuMyW4eK.Uj8ORImJp43ZDLW4rzIfJ68uHuhaVsOVolm",//admin123@
      "first_name":"admin",
      "role":"admin",
      "gender":"male",
      "dob":"2000-02-04",
      "phone_number":"0332643434",
      "device":{
          "language":"en"
      }
    },
    {
      "email":"admin2@gmail.com",
      "password":"$2a$10$0.rJ4oVNsZuMyW4eK.Uj8ORImJp43ZDLW4rzIfJ68uHuhaVsOVolm",
      "first_name":"cong",
      "role":"admin",
      "gender":"female",
      "dob":"1995-02-04",
      "phone_number":"0332654565",
      "device":{
          "language":"en"
      }
    },
    {
      "email":"manager1@gmail.com",
      "password":"$2a$10$0.rJ4oVNsZuMyW4eK.Uj8ORImJp43ZDLW4rzIfJ68uHuhaVsOVolm",
      "first_name":"manager1",
      "role":"managers",
      "gender":"female",
      "dob":"1995-02-04",
      "phone_number":"0332654565",
      "device":{
          "language":"en"
      }
    },
    {
      "email":"user1@gmail.com",
      "password":"$2a$10$0.rJ4oVNsZuMyW4eK.Uj8ORImJp43ZDLW4rzIfJ68uHuhaVsOVolm",
      "first_name":"user 1",
      "role":"users",
      "gender":"female",
      "dob":"1995-02-04",
      "phone_number":"0332654565",
      "device":{
          "language":"en"
      }
    }
  ]);

  await knex('roles').insert([
    {id: 1, name: 'admin', slug: 'admin', description: 'Administration role'},
    {id: 2, name: 'Manage Bookings', slug: 'manage-bookings', description: 'Manager role'},
    {id: 3, name: 'users', slug: 'users', description: 'Normal users'},
  ]);

  await knex('permissions').insert([
    {id: 1, name: 'Read Users', slug: 'r-users', description: 'roles action', object: 'users', action: 'read'},
    {id: 2, name: 'Update Users', slug: 'u-users', description: 'roles action', object: 'users', action: 'update'},
    {id: 3, name: 'Create Users', slug: 'c-users', description: 'roles action', object: 'users', action: 'create'},
    {id: 4, name: 'Delate Users', slug: 'd-users', description: 'roles action', object: 'users', action: 'delete'},

    {id: 5, name: 'Read Items', slug: 'r-items', description: 'roles action', object: 'items', action: 'read'},
    {id: 6, name: 'Update Items', slug: 'u-items', description: 'roles action', object: 'items', action: 'update'},
    {id: 7, name: 'Create Items', slug: 'c-items', description: 'roles action', object: 'items', action: 'create'},
    {id: 8, name: 'Delate Items', slug: 'd-items', description: 'roles action', object: 'items', action: 'delete'},
  ]);

  await knex('role_permissions').insert([
    {permission_id: 1, role_id: 1},
    {permission_id: 2, role_id: 1},
    {permission_id: 3, role_id: 1},
    {permission_id: 4, role_id: 1},

    {permission_id: 5, role_id: 2},
    {permission_id: 6, role_id: 2},
    {permission_id: 7, role_id: 2},
    {permission_id: 8, role_id: 2},
  ]);
  await knex('user_roles').insert([
    {role_id: 1, user_id: 1},
    {role_id: 2, user_id: 1},
    {role_id: 2, user_id: 3},
    {role_id: 3, user_id: 4},
  ]);
};
