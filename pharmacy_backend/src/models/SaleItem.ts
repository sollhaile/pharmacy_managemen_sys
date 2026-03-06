import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Sale } from './Sale'; // Add this import
import { Batch } from './Batch';

export interface SaleItemAttributes {
  sale_item_id: number;
  sale_id: number;
  batch_id: number;
  medicine_id: number;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface SaleItemCreationAttributes extends Optional<SaleItemAttributes, 'sale_item_id'> {}

export class SaleItem extends Model<SaleItemAttributes, SaleItemCreationAttributes> implements SaleItemAttributes {
  public sale_item_id!: number;
  public sale_id!: number;
  public batch_id!: number;
  public medicine_id!: number;
  public medicine_name!: string;
  public batch_number!: string;
  public quantity!: number;
  public unit_price!: number;
  public total_price!: number;

  // ✅ Add associations
  public sale?: Sale;
  public batch?: Batch;
}

SaleItem.init(
  {
    sale_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sale_id: {
      type: DataTypes.INTEGER,
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
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'sale_items',
    timestamps: false
  }
);

// ✅ ADD ASSOCIATIONS HERE
export const setupSaleItemAssociations = () => {
  SaleItem.belongsTo(Sale, {
    foreignKey: 'sale_id',
    as: 'sale'
  });

  SaleItem.belongsTo(Batch, {
    foreignKey: 'batch_id',
    as: 'batch'
  });
};