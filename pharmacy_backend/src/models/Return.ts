import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ReturnAttributes {
  return_id: number;
  return_type: 'CUSTOMER' | 'SUPPLIER';
  reference_id: string;
  batch_id: number;
  medicine_id: number;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  reason: 'EXPIRED' | 'DAMAGED' | 'WRONG_ITEM' | 'CUSTOMER_RETURN' | 'QUALITY_ISSUE' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  notes: string;
  created_by: number;
  approved_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReturnCreationAttributes extends Optional<ReturnAttributes, 'return_id' | 'status' | 'approved_by' | 'updated_at'> {}

export class Return extends Model<ReturnAttributes, ReturnCreationAttributes> implements ReturnAttributes {
  public return_id!: number;
  public return_type!: 'CUSTOMER' | 'SUPPLIER';
  public reference_id!: string;
  public batch_id!: number;
  public medicine_id!: number;
  public medicine_name!: string;
  public batch_number!: string;
  public quantity!: number;
  public unit_price!: number;
  public total_amount!: number;
  public reason!: 'EXPIRED' | 'DAMAGED' | 'WRONG_ITEM' | 'CUSTOMER_RETURN' | 'QUALITY_ISSUE' | 'OTHER';
  public status!: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  public notes!: string;
  public created_by!: number;
  public approved_by?: number;
  public created_at!: Date;
  public updated_at!: Date;
}

Return.init(
  {
    return_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    return_type: {
      type: DataTypes.ENUM('CUSTOMER', 'SUPPLIER'),
      allowNull: false
    },
    reference_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    medicine_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    medicine_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    batch_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    reason: {
      type: DataTypes.ENUM('EXPIRED', 'DAMAGED', 'WRONG_ITEM', 'CUSTOMER_RETURN', 'QUALITY_ISSUE', 'OTHER'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'),
      defaultValue: 'PENDING'
    },
    notes: {
      type: DataTypes.TEXT
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_by: {
      type: DataTypes.INTEGER
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'returns',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);