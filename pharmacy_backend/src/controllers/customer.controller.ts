import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { Sale } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';
import { Op } from 'sequelize';

// @desc    Get all customers
// @route   GET /api/customers
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    let whereClause: any = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const customers = await Customer.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        error: 'Customer not found' 
      });
    }
    
    // Get customer's sales
    const sales = await Sale.findAll({
      where: { customer_id: id },
      include: [{
        model: SaleItem,
        as: 'items'
      }],
      order: [['sale_date', 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        ...customer.toJSON(),
        sales
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get customer by phone (used by checkout)
// @route   GET /api/customers/phone/:phone
export const getCustomerByPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    
    const customer = await Customer.findOne({
      where: { phone }
    });
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        error: 'Customer not found' 
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create customer
// @route   POST /api/customers
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body;  // Removed address
    
    // Check if customer already exists
    const existing = await Customer.findOne({ where: { phone } });
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'Customer with this phone already exists' 
      });
    }
    
    const customer = await Customer.create({
      name,
      phone,
      total_visits: 0,
      last_visit: new Date()
    });
    
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        error: 'Customer not found' 
      });
    }
    
    await customer.update(req.body);
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        error: 'Customer not found' 
      });
    }
    
    await customer.destroy();
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
