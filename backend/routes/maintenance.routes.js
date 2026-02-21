import express from 'express';
import {
    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenanceStatus,
    approveMaintenance
} from '../controllers/maintenanceController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', authorize('owner', 'admin'), createMaintenance);
router.get('/', getAllMaintenance);
router.get('/:id', getMaintenanceById);
router.put('/:id/status', authorize('owner', 'admin'), updateMaintenanceStatus);
router.put('/:id/approve', authorize('admin'), approveMaintenance);

export default router;
