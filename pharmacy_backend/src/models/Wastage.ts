import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface WastageAttributes {
  wastage_id: number;
  batch_id: number;
  medicine_id: number;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  cost_price: number;
  total_loss: number;
  reason: 'EXPIRED' | 'DAMAGED' | 'SPILLED' | 'BROKEN' | 'THEFT' | 'OTHER';
  notes: string;
  reported_by: number;
  reported_date: Date;
}

export interface WastageCreationAttributes extends Optional<WastageAttributes, 'wastage_id' | 'notes'> {}

export class Wastage extends Model<WastageAttributes, WastageCreationAttributes> implements WastageAttributes {
  public wastage_id!: number;
  public batch_id!: number;
  public medicine_id!: number;
  public medicine_name!: string;
  public batch_number!: string;
  public quantity!: number;
  public cost_price!: number;
  public total_loss!: number;
  public reason!: 'EXPIRED' | 'DAMAGED' | 'SPILLED' | 'BROKEN' | 'THEFT' | 'OTHER';
  public notes!: string;
  public reported_by!: number;
  public reported_date!: Date;
}

Wastage.init(
  {
    wastage_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_loss: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    reason: {
      type: DataTypes.ENUM('EXPIRED', 'DAMAGED', 'SPILLED', 'BROKEN', 'THEFT', 'OTHER'),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    },
    reported_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reported_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'wastage',
    timestamps: false
  }
);