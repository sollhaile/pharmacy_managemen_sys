import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { SaleItem } from './SaleItem'; // Add this import

export interface SaleAttributes {
  sale_id: number;
  invoice_number: string;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  prescription_id: string;
  doctor_name: string;
  items_total: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_method: 'cash' | 'transfer' | 'card' | 'insurance';
  payment_status: 'paid' | 'pending' | 'cancelled';
  sale_date: Date;
  sold_by: number;
  notes: string;
}

export interface SaleCreationAttributes extends Optional<SaleAttributes, 'sale_id' | 'invoice_number' | 'discount' | 'tax' | 'payment_status' | 'notes'> {}

export class Sale extends Model<SaleAttributes, SaleCreationAttributes> implements SaleAttributes {
  public sale_id!: number;
  public invoice_number!: string;
  public customer_id!: number;
  public customer_name!: string;
  public customer_phone!: string;
  public prescription_id!: string;
  public doctor_name!: string;
  public items_total!: number;
  public discount!: number;
  public tax!: number;
  public total_amount!: number;
  public payment_method!: 'cash' | 'transfer' | 'card' | 'insurance';
  public payment_status!: 'paid' | 'pending' | 'cancelled';
  public sale_date!: Date;
  public sold_by!: number;
  public notes!: string;

  // ✅ Add association
  public items?: SaleItem[];
}

Sale.init(
  {
    sale_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      unique: true,
      defaultValue: () => 'INV-' + Date.now().toString().slice(-8)
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    prescription_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    doctor_name: {
      type: DataTypes.STRING(100)
    },
    items_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'transfer', 'card', 'insurance'),
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM('paid', 'pending', 'cancelled'),
      defaultValue: 'paid'
    },
    sale_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    sold_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'sales',
    timestamps: true,
    updatedAt: false,
    createdAt: 'sale_date'
  }
);

// ✅ ADD ASSOCIATION HERE
export const setupSaleAssociations = () => {
  Sale.hasMany(SaleItem, {
    foreignKey: 'sale_id',
    as: 'items'
  });
};