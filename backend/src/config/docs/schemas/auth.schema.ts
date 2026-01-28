export const authSchema = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', example: 'usuario@brasa.com' },
      password: { type: 'string', example: 'Teste123' },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Login successful' },
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  },
};