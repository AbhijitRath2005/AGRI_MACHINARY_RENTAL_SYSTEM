import Maintenance from '../models/Maintenance.js';
import Machine from '../models/Machine.js';

// Create maintenance schedule
export const createMaintenance = async (req, res) => {
    try {
        const { machineId, description, scheduledDate, cost, notes } = req.body;

        const machine = await Machine.findById(machineId);
        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        // Check if user is the owner
        if (machine.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const maintenance = new Maintenance({
            machineId,
            scheduledBy: req.user._id,
            description,
            scheduledDate,
            cost,
            notes
        });

        await maintenance.save();

        // Update machine status
        machine.status = 'maintenance';
        await machine.save();

        res.status(201).json({
            success: true,
            message: 'Maintenance scheduled successfully',
            data: maintenance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all maintenance records
export const getAllMaintenance = async (req, res) => {
    try {
        const { status, machineId } = req.query;

        let query = {};
        if (status) query.status = status;
        if (machineId) query.machineId = machineId;

        const maintenance = await Maintenance.find(query)
            .populate('machineId', 'name type')
            .populate('scheduledBy', 'name email')
            .populate('approvedBy', 'name')
            .sort({ scheduledDate: -1 });

        res.json({
            success: true,
            count: maintenance.length,
            data: maintenance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get maintenance by ID
export const getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id)
            .populate('machineId')
            .populate('scheduledBy', 'name email phone')
            .populate('approvedBy', 'name');

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance record not found'
            });
        }

        res.json({
            success: true,
            data: maintenance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update maintenance status
export const updateMaintenanceStatus = async (req, res) => {
    try {
        const { status, completedDate, notes } = req.body;

        const maintenance = await Maintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance record not found'
            });
        }

        maintenance.status = status;
        if (completedDate) maintenance.completedDate = completedDate;
        if (notes) maintenance.notes = notes;

        await maintenance.save();

        // If maintenance is completed, update machine status
        if (status === 'completed') {
            const machine = await Machine.findById(maintenance.machineId);
            machine.status = 'available';
            await machine.save();
        }

        res.json({
            success: true,
            message: 'Maintenance status updated successfully',
            data: maintenance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Approve maintenance (admin only)
export const approveMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id);

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance record not found'
            });
        }

        maintenance.status = 'approved';
        maintenance.approvedBy = req.user._id;
        maintenance.approvedAt = new Date();

        await maintenance.save();

        res.json({
            success: true,
            message: 'Maintenance approved successfully',
            data: maintenance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
