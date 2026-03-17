export default {
  api: {
    input: 'http://localhost:3000/swagger.json',
    output: {
      target: './src/api/generated.ts',
      client: 'axios',
    },
  },
};