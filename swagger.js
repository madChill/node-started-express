const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/modules/users/user.route.js'
, './src/modules/auth/auth.route.js'
]

swaggerAutogen(outputFile, endpointsFiles)