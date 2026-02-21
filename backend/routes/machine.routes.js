import express from 'express';
import {
    getAllMachines,
    getMachineById,
    createMachine,
    updateMachine,
    deleteMachine,
    getMachinesByOwner
} from '../controllers/machineController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Public routes
router.get('/', getAllMachines);
router.get('/:id', getMachineById);

// Protected routes
router.post('/', authenticate, authorize('owner', 'admin'), createMachine);
router.put('/:id', authenticate, authorize('owner', 'admin'), updateMachine);
router.delete('/:id', authenticate, authorize('owner', 'admin'), deleteMachine);
router.get('/owner/:ownerId', authenticate, getMachinesByOwner);

export default router;
