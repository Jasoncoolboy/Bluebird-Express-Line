import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async create(userData) {
    const { username, password, role } = userData;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role]
      );
      return { id: result.insertId, username, role };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

export default User;