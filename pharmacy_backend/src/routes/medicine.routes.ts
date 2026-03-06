import { Router } from 'express';
import { 
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getCategories,
  getLowStockMedicines
} from '../controllers/medicine.controller';
import { getMedicineBatches } from '../controllers/batch.controller';


const router = Router();

router.get('/', getMedicines);
router.get('/categories', getCategories);
router.get('/low-stock', getLowStockMedicines);
router.get('/:id', getMedicine);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);
router.get('/:medicineId/batches', getMedicineBatches);

export default router;
