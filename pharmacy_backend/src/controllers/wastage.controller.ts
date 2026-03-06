import { Request, Response } from 'express';
import { Wastage } from '../models/Wastage';
import { Batch } from '../models/Batch';
import { Medicine } from '../models/Medicine';
import { sequelize } from '../config/database';
import { Op } from 'sequelize';
import { sendTelegramMessage } from '../services/notification.service';

// @desc    Report damaged/expired medicine
// @route   POST /api/wastage
export const reportWastage = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const { batch_id, quantity, reason, notes } = req.body;
    const user_id = req.body.user_id || 1;

    // Get batch details
    const batch = await Batch.findOne({
      where: { batch_id, is_active: true },
      include: [{
        model: Medicine,
        as: 'batch_medicine',
        attributes: ['name']
      }],
      transaction: t
    });

    if (!batch) {
      await t.rollback();
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    if (batch.quantity < quantity) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient stock. Available: ${batch.quantity}` 
      });
    }

    // Calculate loss
    const totalLoss = Number(batch.cost_price || 0) * quantity;

    // Create wastage record
    const wastage = await Wastage.create({
      batch_id: batch.batch_id,
      medicine_id: batch.medicine_id,
      medicine_name: (batch as any).batch_medicine?.name || 'Unknown',
      batch_number: batch.batch_number,
      quantity,
      cost_price: Number(batch.cost_price || 0),
      total_loss: totalLoss,
      reason,
      notes: notes || '',
      reported_by: user_id,
      reported_date: new Date()
    }, { transaction: t });

    // Reduce batch quantity
    await batch.update({
      quantity: batch.quantity - quantity
    }, { transaction: t });

    await t.commit();

    // Send Telegram alert
    const emoji = reason === 'EXPIRED' ? '🕰️' : reason === 'THEFT' ? '🚨' : '⚠️';
    const message = `
${emoji} <b>WASTAGE REPORTED</b>

💊 <b>Medicine:</b> ${wastage.medicine_name}
📦 <b>Batch:</b> ${wastage.batch_number}
❌ <b>Quantity:</b> ${wastage.quantity} units
💰 <b>Loss:</b> ETB ${wastage.total_loss}
📌 <b>Reason:</b> ${wastage.reason}
📝 <b>Notes:</b> ${wastage.notes || 'N/A'}
👤 <b>Reported by:</b> User #${user_id}
⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `;

    await sendTelegramMessage(message);

    res.status(201).json({
      success: true,
      message: 'Wastage reported successfully',
      data: wastage
    });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get wastage reports
// @route   GET /api/wastage
export const getWastageReports = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date, reason } = req.query;
    
    let whereClause: any = {};
    
    if (start_date && end_date) {
      whereClause.reported_date = {
        [Op.between]: [new Date(start_date as string), new Date(end_date as string)]
      };
    }
    
    if (reason) {
      whereClause.reason = reason;
    }

    const reports = await Wastage.findAll({
      where: whereClause,
      order: [['reported_date', 'DESC']]
    });

    const totalLoss = reports.reduce((sum, r) => sum + Number(r.total_loss), 0);

    res.json({
      success: true,
      count: reports.length,
      total_loss: totalLoss,
      data: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};