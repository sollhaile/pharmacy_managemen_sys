import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CustomerAttributes {
  customer_id: number;
  phone: string;        // Primary identifier
  name: string;         // Customer name
  total_visits: number; // Auto-tracked
  last_visit: Date;     // Auto-tracked
  created_at?: Date;
}

export interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'customer_id' | 'total_visits' | 'last_visit'> {}

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public customer_id!: number;
  public phone!: string;
  public name!: string;
  public total_visits!: number;
  public last_visit!: Date;
  public created_at!: Date;
}

Customer.init(
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    total_visits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_visit: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at'
  }
);