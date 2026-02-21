import Machine from '../models/Machine.js';

// Get all machines with filters
export const getAllMachines = async (req, res) => {
    try {
        const { type, status, minPrice, maxPrice, search } = req.query;

        let query = { isActive: true };

        // Apply filters
        if (type) query.type = type;
        if (status) query.status = status;
        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice) query.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const machines = await Machine.find(query)
            .populate('ownerId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: machines.length,
            data: machines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single machine
export const getMachineById = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id)
            .populate('ownerId', 'name email phone address');

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        res.json({
            success: true,
            data: machine
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create new machine (owner only)
export const createMachine = async (req, res) => {
    try {
        const machineData = {
            ...req.body,
            ownerId: req.user._id
        };

        const machine = new Machine(machineData);
        await machine.save();

        res.status(201).json({
            success: true,
            message: 'Machine created successfully',
            data: machine
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update machine
export const updateMachine = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        // Check ownership (unless admin)
        if (machine.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const updatedMachine = await Machine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Machine updated successfully',
            data: updatedMachine
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete machine
export const deleteMachine = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        // Check ownership (unless admin)
        if (machine.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Soft delete
        machine.isActive = false;
        await machine.save();

        res.json({
            success: true,
            message: 'Machine deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get machines by owner
export const getMachinesByOwner = async (req, res) => {
    try {
        const machines = await Machine.find({
            ownerId: req.params.ownerId,
            isActive: true
        });

        res.json({
            success: true,
            count: machines.length,
            data: machines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
