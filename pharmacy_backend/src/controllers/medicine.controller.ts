import { Request, Response } from 'express';
import { Medicine } from '../models/Medicine';
import { Batch } from '../models/Batch';
import { Op } from 'sequelize';

export const getMedicines = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;
    
    // Build where clause
    let whereClause: any = { is_active: true };
    
    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { generic_name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    const medicines = await Medicine.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });

    const medicinesWithStock = await Promise.all(
      medicines.map(async (medicine) => {
        const batches = await Batch.findAll({
          where: { 
            medicine_id: medicine.medicine_id,
            is_active: true 
          }
        });
        const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);
        return {
          ...medicine.toJSON(),
          total_stock: totalStock,
          is_low_stock: totalStock <= medicine.reorder_level
        };
      })
    );

    res.status(200).json({
      success: true,
      count: medicinesWithStock.length,
      data: medicinesWithStock
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const getMedicine = async (req: Request, res: Response) => {
  try {
    // ✅ FIXED: Add 'as string'
    const id = parseInt(req.params.id as string);
    const medicine = await Medicine.findOne({
      where: { medicine_id: id, is_active: true }
    });

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    const batches = await Batch.findAll({
      where: { medicine_id: id, is_active: true },
      order: [['expiry_date', 'ASC']]
    });

    const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        ...medicine.toJSON(),
        total_stock: totalStock,
        is_low_stock: totalStock <= medicine.reorder_level,
        batches
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const { name, generic_name, brand, category, form, strength, unit, barcode, reorder_level } = req.body;

    const existing = await Medicine.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Medicine with this name already exists' });
    }

    const medicine = await Medicine.create({
      name,
      generic_name,
      brand,
      category,
      form,
      strength,
      unit,
      barcode,
      reorder_level: reorder_level || 10,
      is_active: true
    });

    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const updateMedicine = async (req: Request, res: Response) => {
  try {
    // ✅ FIXED: Add 'as string'
    const id = parseInt(req.params.id as string);
    const medicine = await Medicine.findOne({
      where: { medicine_id: id, is_active: true }
    });

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    await medicine.update(req.body);
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    // ✅ FIXED: Add 'as string'
    const id = parseInt(req.params.id as string);
    const medicine = await Medicine.findByPk(id);

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    await medicine.update({ is_active: false });
    res.status(200).json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.findAll({
      where: { is_active: true },
      attributes: ['category']
    });

    const categories = [...new Set(medicines.map(m => m.category).filter(Boolean))];
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const getLowStockMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.findAll({ where: { is_active: true } });
    const lowStockItems = [];

    for (const medicine of medicines) {
      const batches = await Batch.findAll({
        where: { medicine_id: medicine.medicine_id, is_active: true }
      });
      
      const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);
      
      if (totalStock <= medicine.reorder_level) {
        lowStockItems.push({
          ...medicine.toJSON(),
          total_stock: totalStock,
          shortage: medicine.reorder_level - totalStock
        });
      }
    }

    res.status(200).json({ success: true, count: lowStockItems.length, data: lowStockItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};