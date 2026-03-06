import { Request, Response } from 'express';
import { Supplier } from '../models/Supplier';

// @desc    Get all suppliers
// @route   GET /api/suppliers
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { name, contact_person, email, phone, address } = req.body;
    
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

    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};