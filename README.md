
# Description
node-started-express
✨ **This workspace has been developed by cong.nguyen ✨
[Express js](https://github.com/expressjs/express) framework nodejs backend starter repository.

# Installation
### Setup development with Docker
#### Install the docker or docker desktops, then install docker-compose tool to automatically run development local.

#### setup .env file(the aes couple key)
JWT_SECRET= ""
JWT_PUBLIC_KEY = ""
DB_CONNECTION_URI=mysql://admin:admin12%23%24@localhost:3306/school_app

#### 1. setup mysql databas with docker-compose 
 ```bash
 docker-compose up --build
```

### Setup development without Docker

#### 2. run install package
 ```bash
 $ pnpm install
```
#### 3. install the mysql server, then add the .env file(follow the .env.example)
 ```bash
  JWT_SECRET= ""
  JWT_PUBLIC_KEY = ""
  DB_CONNECTION_URI=mysql://admin:admin12%23%24@localhost:3306/school_app
```
#### 4.run migrate database with knex
 ```bash
 $ pnpm run knex:migrate
 $ pnpm run knex:seed
```
#### run development local
```bash
# development
$ pnpm run start:dev
```
#### test the health check 
Endpoint: GET http://localhost:3000/status
#### enpoint swaggeer
Endpoint: GET http://localhost:3000/doc
#### endpoint for login make sure you've logged in to get bearer user token for every single api call
bellow is a test user
```bash
# development
{
    "email":"teacherken@gmail.com",
    "password": "admin123@"
}
```


### production 

### production mode
``` bash
$ pnpm run start:prod
```

## Project Structure
The most obvious difference in a Javascript + Node project is the folder structure.
In a Expressjs project, it's best to have separate _source_  and _distributable_ files.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `pnpm run build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the dist dir                               |
| **src/config**           | Passport authentication strategies and constants variables, logging.. etc   |
|                          | Add other complex config code here                                                            |
| **src/modules/*.route**          | Routing files in each folders for all express application                             |
| **src/modules/*.controllers**      | Controllers define functions that respond to various http requests                  |
| **src/modules/*.service**      | contains main logic of all projects                                                     |
| **src/modules/*.model**  | Models define Objection, Knex schemas that will be used in storing,retrieving data from postgres|
| **src/utils**            | The basic common function used to be reused multiple times in app                             |
| **src/combined.log**     | The logging files we can tracert the issues related to server side                            |
| **migrations**           | Contains migrations .js files and history from Knex tool for postgres sql.                    |
| **seeds**                | Contains seeds .js files prepare testing data after setup database intergration.              |
| .env                     | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos. |
| .env.example             | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos. |
| .Dockerfile              | Used to configure docker image build scenario                                                 |
| package.json             | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                          |
| .babelrc                 | Config settings for compiling server code written in TypeScript                               |
| .eslintrc                | Config settings for ESLint code style checking                                                |
| .eslintignore            | Config settings for paths to exclude from linting                                             |


## Security 
#### Validation

#### Authentications
We use the expressjs middware, passport, passport-jwt strategy  library to implement the authentication scenario.
For more detail: After login with email, password we'll seen the users bearer token for include http request header later..
Then for every http request need auth who created require we verify the bearer token with JWT custom scenario in JwtStrategy.

Middware to fillter users logined or not with jwt scenario

```javascript
exports.authorize = () => (req, res, next) => passport.authenticate(
  'jwt', { session: false },
  handleJWT(req, res, next),
)(req, res, next);
```

JWT custom scenario in JwtStrategy:
```javascript
const jwt = async (payload, done) => {
  try {
    if (payload.user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};
```
#### Authorization
After authentication we should get the user's roles, permission to verify that they can do action with the route.
Its another middware after authentication filter.

Verify the model, action can excute or not

```javascript
  authzHasPermission: function (obj, act) {
    return async (req, res, next) => {
      try {
        const { user } = req;
        const userRaw = await userController.getUserData(user)
        let isPermission = false
        forEach(userRaw.permissions, item => {
          if(obj == item.object && act == item.action) isPermission = true;
        })
        if (!isPermission) {
          throw new APIError({
            message: 'Insufficient permissions',
            errors: ['insufficient_permissions'],
            status: httpStatus.FORBIDDEN,
            isPublic: true,
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }
```

Use the middware authorization
```javascript
router.route('/items')
  .post(authorize(), authz.authzHasPermission('items', 'create'), validate(items), controller.addItems)
  .get(authorize(), authz.authzHasPermission('items', 'read'), controller.getItems);
```

#### Ratelimit
Use to limit repeated requests from specific IP.

```javascript
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})
```

## Api docs
#### Swagger integration
before add a new file route in a new module make sure includes that's file in swagger.js file, option name is 'endpointsFiles'. 
Then rerun the command, this will automatically get the changes from the route file, includes the swagger api docs.
``` command
  yarn swagger-autogen
```
So, now access to path /doc to double check your api is released.


## Migration
#### Create a new file migration database
``` command
yarn knex:make [--file-name]
```
#### Run the migration
``` command
yarn knex:migrate
```
#### Rollback 
``` command
yarn knex:rollback
```

## Support

Expressjs is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://github.com/expressjs/express).

## Stay in touch


## License

Expressjs is [MIT licensed](LICENSE).
