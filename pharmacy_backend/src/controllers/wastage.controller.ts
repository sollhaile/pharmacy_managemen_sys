import { Request, Response } from 'express';
import { Wastage } from '../models/Wastage';
import { Batch } from '../models/Batch';
import { Medicine } from '../models/Medicine';
import { sequelize } from '../config/database';
import { Op, fn, col, literal } from 'sequelize';
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

// @desc    Get wastage summary statistics
// @route   GET /api/wastage/summary
export const getWastageSummary = async (req: Request, res: Response) => {
  try {
    // Get all wastage reports
    const reports = await Wastage.findAll();
    
    // Calculate total loss
    const totalLoss = reports.reduce((sum, r) => sum + Number(r.total_loss), 0);
    
    // Calculate by reason
    const byReason = {
      EXPIRED: 0,
      DAMAGED: 0,
      SPILLED: 0,
      BROKEN: 0,
      THEFT: 0,
      OTHER: 0
    };
    
    reports.forEach(r => {
      const reason = r.reason as keyof typeof byReason;
      if (byReason[reason] !== undefined) {
        byReason[reason] += Number(r.total_loss);
      }
    });
    
    // Get monthly breakdown (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyReports = await Wastage.findAll({
      where: {
        reported_date: {
          [Op.gte]: sixMonthsAgo
        }
      },
      order: [['reported_date', 'ASC']]
    });
    
    const byMonth: { [key: string]: { loss: number; count: number } } = {};
    
    monthlyReports.forEach(r => {
      const month = new Date(r.reported_date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!byMonth[month]) {
        byMonth[month] = { loss: 0, count: 0 };
      }
      byMonth[month].loss += Number(r.total_loss);
      byMonth[month].count += 1;
    });
    
    const monthlyArray = Object.entries(byMonth).map(([month, data]) => ({
      month,
      loss: data.loss,
      count: data.count
    }));
    
    res.json({
      success: true,
      data: {
        total_reports: reports.length,
        total_loss: totalLoss,
        by_reason: byReason,
        by_month: monthlyArray
      }
    });
  } catch (error) {
    console.error('Get wastage summary error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Auto-detect and report expired batches
// @route   POST /api/wastage/auto-detect
// @desc    Auto-detect and report expired batches
// @route   POST /api/wastage/auto-detect
export const autoDetectExpired = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const user_id = 1; // System user ID (admin)

    // Find all batches that are expired (expiry_date < today) and have quantity > 0
    const expiredBatches = await Batch.findAll({
      where: {
        is_active: true,
        expiry_date: {
          [Op.lt]: new Date()
        },
        quantity: {
          [Op.gt]: 0
        }
      },
      include: [{
        model: Medicine,
        as: 'batch_medicine',
        attributes: ['name']
      }],
      transaction: t
    });
    
    if (expiredBatches.length === 0) {
      await t.rollback();
      return res.json({
        success: true,
        data: {
          processed: 0,
          total_loss: 0,
          details: []
        }
      });
    }
    
    const results = [];
    let totalLoss = 0;
    
    for (const batch of expiredBatches) {
      // Calculate loss
      const lossAmount = Number(batch.quantity) * Number(batch.cost_price || 0);
      totalLoss += lossAmount;
      
      // Check if already reported today
      const existingReport = await Wastage.findOne({
        where: {
          batch_id: batch.batch_id,
          reason: 'EXPIRED',
          reported_date: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });
      
      if (!existingReport) {
        // Create wastage record
        const wastage = await Wastage.create({
          batch_id: batch.batch_id,
          medicine_id: batch.medicine_id,
          medicine_name: (batch as any).batch_medicine?.name || 'Unknown',
          batch_number: batch.batch_number,
          quantity: batch.quantity,
          cost_price: batch.cost_price,
          total_loss: lossAmount,
          reason: 'EXPIRED',
          notes: `Auto-detected expired batch. Expired on ${new Date(batch.expiry_date).toLocaleDateString()}`,
          reported_by: user_id, // ✅ Now using fixed user_id
          reported_date: new Date()
        }, { transaction: t });
        
        // Deactivate the batch
        await batch.update({ 
          is_active: false,
          quantity: 0 
        }, { transaction: t });
        
        results.push({
          wastage_id: wastage.wastage_id,
          medicine_name: wastage.medicine_name,
          batch_number: wastage.batch_number,
          quantity: wastage.quantity,
          loss: wastage.total_loss
        });
      }
    }
    
    await t.commit();
    
    // Send Telegram summary
    if (results.length > 0) {
      const message = `
🤖 <b>AUTO-DETECT EXPIRED BATCHES</b>

📊 <b>Processed:</b> ${results.length} batches
💰 <b>Total Loss:</b> ETB ${totalLoss}

${results.slice(0, 5).map(r => `• ${r.medicine_name} (${r.batch_number}): ${r.quantity} units - ETB ${r.loss}`).join('\n')}
${results.length > 5 ? `\n... and ${results.length - 5} more` : ''}
      `;
      
      await sendTelegramMessage(message);
    }
    
    res.json({
      success: true,
      data: {
        processed: results.length,
        total_loss: totalLoss,
        details: results
      }
    });

  } catch (error) {
    await t.rollback();
    console.error('Auto-detect expired error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get wastage by date range
// @route   GET /api/wastage/date-range
export const getWastageByDateRange = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Start date and end date are required' 
      });
    }

    const reports = await Wastage.findAll({
      where: {
        reported_date: {
          [Op.between]: [new Date(start_date as string), new Date(end_date as string)]
        }
      },
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

// @desc    Get wastage by reason
// @route   GET /api/wastage/reason/:reason
export const getWastageByReason = async (req: Request, res: Response) => {
  try {
    const { reason } = req.params;
    
    const reports = await Wastage.findAll({
      where: { reason },
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

// @desc    Delete wastage record
// @route   DELETE /api/wastage/:id
export const deleteWastage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string); // ✅ FIXED: Parse ID
    
    const wastage = await Wastage.findByPk(id);
    
    if (!wastage) {
      return res.status(404).json({ 
        success: false, 
        error: 'Wastage record not found' 
      });
    }
    
    await wastage.destroy();
    
    res.json({
      success: true,
      message: 'Wastage record deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
