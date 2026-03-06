import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface UserAttributes {
  user_id: number;
  username: string;
  password_hash: string;
  full_name: string;
  role: 'admin' | 'pharmacist' | 'manager' | 'cashier' | 'store_keeper';
  is_active: boolean;
  created_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'role' | 'is_active' | 'created_at'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public username!: string;
  public password_hash!: string;
  public full_name!: string;
  public role!: 'admin' | 'pharmacist' | 'manager' | 'cashier' | 'store_keeper';
  public is_active!: boolean;
  public created_at!: Date;

  // Compare password method
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password_hash);
  }

  // Generate JWT token - MAKE SURE THIS IS INSIDE THE CLASS
  generateAuthToken(): string {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const payload = {
      id: this.user_id,
      username: this.username,
      role: this.role
    };

    return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  }
}

// Initialize the model - THIS MUST BE OUTSIDE THE CLASS
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'pharmacist', 'manager', 'cashier', 'store_keeper'),
      defaultValue: 'pharmacist'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  }
);