import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SupplierAttributes {
  supplier_id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at?: Date;
}

export interface SupplierCreationAttributes extends Optional<SupplierAttributes, 'supplier_id' | 'is_active' | 'created_at'> {}

export class Supplier extends Model<SupplierAttributes, SupplierCreationAttributes> implements SupplierAttributes {
  public supplier_id!: number;
  public name!: string;
  public contact_person!: string | null;
  public email!: string | null;
  public phone!: string | null;
  public address!: string | null;
  public is_active!: boolean;
  public created_at!: Date;
}

Supplier.init(
  {
    supplier_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    contact_person: {
      type: DataTypes.STRING(100)
    },
    email: {
      type: DataTypes.STRING(100)
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    address: {
      type: DataTypes.TEXT
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
    tableName: 'suppliers',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at'
  }
);