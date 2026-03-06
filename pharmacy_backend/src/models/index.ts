import { Wastage } from './Wastage';
import { Return } from './Return';
import { sequelize } from '../config/database';
import { User } from './User';
import { Medicine } from './Medicine';
import { Batch } from './Batch';
import { Supplier } from './Supplier';
import { Customer } from './Customer';
import { Sale } from './Sale';
import { SaleItem } from './SaleItem';

export const db = {
  sequelize,
  Sequelize: sequelize.constructor,
  User,
  Medicine,
  Batch,
  Supplier,
  Customer,
  Sale,
  SaleItem,
   Wastage,
  Return
};

export const setupAssociations = () => {
  // Medicine - Batch
  Medicine.hasMany(Batch, {
    foreignKey: 'medicine_id',
    as: 'medicine_batches'
  });

  Batch.belongsTo(Medicine, {
    foreignKey: 'medicine_id',
    as: 'batch_medicine'
  });

  // Supplier - Batch
  Supplier.hasMany(Batch, {
    foreignKey: 'supplier_id',
    as: 'supplier_batches'
  });

  Batch.belongsTo(Supplier, {
    foreignKey: 'supplier_id',
    as: 'batch_supplier'
  });
  // ✅ Sale - SaleItem associations
  Sale.hasMany(SaleItem, {
    foreignKey: 'sale_id',
    as: 'items'
  });

  SaleItem.belongsTo(Sale, {
    foreignKey: 'sale_id',
    as: 'sale'
  });

  // ✅ SaleItem - Batch association
  SaleItem.belongsTo(Batch, {
    foreignKey: 'batch_id',
    as: 'batch'
  });
};

