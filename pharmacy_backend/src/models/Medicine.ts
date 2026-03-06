import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MedicineAttributes {
  medicine_id: number;
  name: string;
  generic_name: string | null;
  brand: string | null;
  category: string | null;
  form: string | null;
  strength: string | null;
  unit: string | null;
  barcode: string | null;
  reorder_level: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface MedicineCreationAttributes extends Optional<MedicineAttributes, 'medicine_id' | 'reorder_level' | 'is_active'> {}

export class Medicine extends Model<MedicineAttributes, MedicineCreationAttributes> implements MedicineAttributes {
  public medicine_id!: number;
  public name!: string;
  public generic_name!: string | null;
  public brand!: string | null;
  public category!: string | null;
  public form!: string | null;
  public strength!: string | null;
  public unit!: string | null;
  public barcode!: string | null;
  public reorder_level!: number;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Medicine.init(
  {
    medicine_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    generic_name: {
      type: DataTypes.STRING(255)
    },
    brand: {
      type: DataTypes.STRING(100)
    },
    category: {
      type: DataTypes.STRING(100)
    },
    form: {
      type: DataTypes.STRING(50)
    },
    strength: {
      type: DataTypes.STRING(100)
    },
    unit: {
      type: DataTypes.STRING(50)
    },
    barcode: {
      type: DataTypes.STRING(50),
      unique: true
    },
    reorder_level: {
      type: DataTypes.INTEGER,
      defaultValue: 10
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
    tableName: 'medicines',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);