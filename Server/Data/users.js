import bcrypt from "bcryptjs"

export const users = [{
  name: 'Admin',
  email: 'admin@example.com',
  password: bcrypt.hashSync('123456', 10),
  Admin: true
}, {
  name: 'User',
  email: 'user@example.com',
  password: bcrypt.hashSync('123456', 10),
}];