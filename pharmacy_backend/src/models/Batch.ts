import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Medicine } from './Medicine';
//import { Supplier } from './Supplier';

export interface BatchAttributes {
  batch_id: number;
  batch_number: string;
  medicine_id: number;
  expiry_date: Date;
  manufacturing_date: Date | null;
  supplier_id: number | null;
  quantity: number;
  cost_price: number | null;
  selling_price: number | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;

}

export interface BatchCreationAttributes extends Optional<BatchAttributes, 'batch_id' | 'is_active'> {}

export class Batch extends Model<BatchAttributes, BatchCreationAttributes> implements BatchAttributes {
  public batch_id!: number;
  public batch_number!: string;
  public medicine_id!: number;
  public expiry_date!: Date;
  public manufacturing_date!: Date | null;
  public supplier_id!: number | null;
  public quantity!: number;
  public cost_price!: number | null;
  public selling_price!: number | null;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
  public batch_medicine?: Medicine;

  // Get days until expiry
  getDaysUntilExpiry(): number {
    const today = new Date();
    const expiry = new Date(this.expiry_date);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Get expiry status
  getExpiryStatus(): 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'OK' {
    const days = this.getDaysUntilExpiry();
    if (days < 0) return 'EXPIRED';
    if (days <= 30) return 'CRITICAL';
    if (days <= 180) return 'WARNING';
    return 'OK';
  }

  // Check if can sell
  canSell(quantity: number): boolean {
    return this.is_active && 
           this.quantity >= quantity && 
           this.getDaysUntilExpiry() > 0;
  }
}

Batch.init(
  {
    batch_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    batch_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    medicine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medicines',
        key: 'medicine_id'
      }
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    manufacturing_date: {
      type: DataTypes.DATEONLY
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'suppliers',
        key: 'supplier_id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'batches',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);