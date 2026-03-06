import { Request, Response } from 'express';
import { Batch } from '../models/Batch';
import { Medicine } from '../models/Medicine';
import { Supplier } from '../models/Supplier';
import { sequelize } from '../config/database';
import { Op } from 'sequelize'; 

// @desc    Get all batches
// @route   GET /api/batches
// @access  Public
export const getBatches = async (req: Request, res: Response) => {
  try {
    const batches = await Batch.findAll({
      where: { is_active: true },
      include: [
        {
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['medicine_id', 'name', 'generic_name', 'category']
        },
        {
          model: Supplier,
          as: 'batch_supplier',
          attributes: ['supplier_id', 'name', 'contact_person']
        }
      ],
      order: [['expiry_date', 'ASC']]
    });

    // Add expiry status to each batch
    const batchesWithStatus = batches.map(batch => ({
      ...batch.toJSON(),
      days_until_expiry: batch.getDaysUntilExpiry(),
      expiry_status: batch.getExpiryStatus()
    }));

    res.status(200).json({
      success: true,
      count: batchesWithStatus.length,
      data: batchesWithStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Public
export const getBatch = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const batch = await Batch.findOne({
      where: { 
        batch_id: id,
        is_active: true 
      },
      include: [
        {
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['medicine_id', 'name', 'generic_name', 'category', 'reorder_level']
        },
        {
          model: Supplier,
          as: 'batch_supplier',
          attributes: ['supplier_id', 'name', 'contact_person', 'email', 'phone']
        }
      ]
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        error: 'Batch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...batch.toJSON(),
        days_until_expiry: batch.getDaysUntilExpiry(),
        expiry_status: batch.getExpiryStatus(),
        can_sell: batch.canSell(1)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new batch (add stock)
// @route   POST /api/batches
// @access  Public (auth later)
export const createBatch = async (req: Request, res: Response) => {
  try {
    const {
      batch_number,
      medicine_id,
      expiry_date,
      manufacturing_date,
      supplier_id,
      quantity,
      cost_price,
      selling_price
    } = req.body;

    // Check if medicine exists
    const medicine = await Medicine.findByPk(medicine_id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found'
      });
    }

    // Check if supplier exists (if provided)
    if (supplier_id) {
      const supplier = await Supplier.findByPk(supplier_id);
      if (!supplier) {
        return res.status(404).json({
          success: false,
          error: 'Supplier not found'
        });
      }
    }

    // Check if batch number already exists
    const existingBatch = await Batch.findOne({ 
      where: { batch_number } 
    });
    
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        error: 'Batch with this number already exists'
      });
    }

    // Validate dates
    if (new Date(expiry_date) <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Expiry date must be in the future'
      });
    }

    if (manufacturing_date && new Date(manufacturing_date) >= new Date(expiry_date)) {
      return res.status(400).json({
        success: false,
        error: 'Manufacturing date must be before expiry date'
      });
    }

    const batch = await Batch.create({
      batch_number,
      medicine_id,
      expiry_date,
      manufacturing_date: manufacturing_date || null,
      supplier_id: supplier_id || null,
      quantity: quantity || 0,
      cost_price: cost_price || null,
      selling_price: selling_price || null,
      is_active: true
    });

    // Get the complete batch with associations
    const newBatch = await Batch.findByPk(batch.batch_id, {
      include: [
        {
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['name', 'generic_name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Stock added successfully',
      data: newBatch
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Public (auth later)
export const updateBatch = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const updates = req.body;

    const batch = await Batch.findOne({
      where: { 
        batch_id: id,
        is_active: true 
      }
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        error: 'Batch not found'
      });
    }

    // Don't allow updating certain fields if stock has been sold
    if (batch.quantity !== updates.quantity && batch.quantity > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update quantity directly. Use stock adjustment instead.'
      });
    }

    await batch.update(updates);

    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete batch (soft delete)
// @route   DELETE /api/batches/:id
// @access  Public (auth later)
export const deleteBatch = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        error: 'Batch not found'
      });
    }

    // Check if batch has stock
    if (batch.quantity > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete batch with existing stock. Please remove stock first.'
      });
    }

    await batch.update({ is_active: false });

    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get batches for a specific medicine
// @route   GET /api/medicines/:medicineId/batches
// @access  Public
export const getMedicineBatches = async (req: Request, res: Response) => {
  try {
    const medicineId = parseInt(req.params.medicineId as string);

    const medicine = await Medicine.findByPk(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found'
      });
    }

    const batches = await Batch.findAll({
      where: { 
        medicine_id: medicineId,
        is_active: true 
      },
      include: [
        {
          model: Supplier,
          as: 'batch_supplier',
          attributes: ['supplier_id', 'name']
        }
      ],
      order: [['expiry_date', 'ASC']]
    });

    const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);

    res.status(200).json({
      success: true,
      medicine: {
        id: medicine.medicine_id,
        name: medicine.name,
        total_stock: totalStock,
        reorder_level: medicine.reorder_level,
        is_low_stock: totalStock <= medicine.reorder_level
      },
      count: batches.length,
      data: batches.map(batch => ({
        ...batch.toJSON(),
        days_until_expiry: batch.getDaysUntilExpiry(),
        expiry_status: batch.getExpiryStatus()
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get expiring soon batches
// @route   GET /api/batches/expiring/soon
// @access  Public
// @desc    Get expiring soon batches
// @route   GET /api/batches/expiring/soon
// @access  Public
export const getExpiringBatches = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;

    const batches = await Batch.findAll({
      where: {
        is_active: true,
        expiry_date: {
          [Op.between]: [new Date(), new Date(Date.now() + days * 24 * 60 * 60 * 1000)]  // ✅ FIXED
        }
      },
      include: [
        {
          model: Medicine,
          as: 'batch_medicine',
          attributes: ['name', 'generic_name', 'category']
        }
      ],
      order: [['expiry_date', 'ASC']]
    });

    const batchesWithStatus = batches.map(batch => ({
      ...batch.toJSON(),
      days_until_expiry: batch.getDaysUntilExpiry(),
      expiry_status: batch.getExpiryStatus()
    }));

    res.status(200).json({
      success: true,
      count: batchesWithStatus.length,
      data: batchesWithStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Adjust stock (add or remove)
// @route   PATCH /api/batches/:id/stock
// @access  Public (auth later)
export const adjustStock = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { quantity, operation, reason } = req.body;

    const batch = await Batch.findOne({
      where: { 
        batch_id: id,
        is_active: true 
      }
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        error: 'Batch not found'
      });
    }

    let newQuantity = batch.quantity;

    if (operation === 'add') {
      newQuantity += quantity;
    } else if (operation === 'remove') {
      if (batch.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock. Available: ${batch.quantity}`
        });
      }
      newQuantity -= quantity;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Operation must be "add" or "remove"'
      });
    }

    await batch.update({ quantity: newQuantity });

    res.status(200).json({
      success: true,
      message: `Stock ${operation === 'add' ? 'added' : 'removed'} successfully`,
      data: {
        batch_id: batch.batch_id,
        previous_quantity: batch.quantity - (operation === 'add' ? -quantity : quantity),
        new_quantity: newQuantity,
        operation,
        quantity_changed: quantity,
        reason: reason || 'Stock adjustment'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};