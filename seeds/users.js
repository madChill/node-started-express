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
};