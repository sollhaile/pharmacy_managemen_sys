import { Request, Response } from 'express';
import { Supplier } from '../models/Supplier';
import { Batch } from '../models/Batch';
import { Op } from 'sequelize';

// @desc    Get all suppliers
// @route   GET /api/suppliers
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        error: 'Supplier not found' 
      });
    }
    
    // Get batches from this supplier
    const batches = await Batch.findAll({
      where: { supplier_id: id, is_active: true },
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        ...supplier.toJSON(),
        batches
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { name, contact_person, email, phone, address } = req.body;
    
    // Check if supplier already exists
    const existing = await Supplier.findOne({ where: { name } });
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'Supplier with this name already exists' 
      });
    }
    
    const supplier = await Supplier.create({
      name,
      contact_person,
      email,
      phone,
      address,
      is_active: true
    });
    
    res.status(201).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        error: 'Supplier not found' 
      });
    }
    
    // If name is being changed, check if new name already exists
    if (req.body.name && req.body.name !== supplier.name) {
      const existing = await Supplier.findOne({ 
        where: { name: req.body.name } 
      });
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          error: 'Supplier with this name already exists' 
        });
      }
    }
    
    await supplier.update(req.body);
    
    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete supplier (soft delete)
// @route   DELETE /api/suppliers/:id
export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        error: 'Supplier not found' 
      });
    }
    
    // Check if supplier has active batches
    const batches = await Batch.findOne({ 
      where: { supplier_id: id, is_active: true } 
    });
    
    if (batches) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete supplier with active batches' 
      });
    }
    
    await supplier.update({ is_active: false });
    
    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
