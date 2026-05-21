import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';
import path from 'path';

const doc = {
  info: {
    title: 'Game Atlas API',
    description: 'Automatically generated Swagger API documentation for Game Atlas',
    version: '1.0.0'
  },
  host: 'localhost:5000',
  basePath: '/api',
};

const outputFile = './src/swagger_output.json';

// Feed all route files directly to be safe
const routesDir = './src/routes';
const endpointsFiles = fs.readdirSync(routesDir)
  .filter(f => f.endsWith('.ts'))
  .map(f => path.join(routesDir, f));

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger UI documentation generated successfully.");
});
