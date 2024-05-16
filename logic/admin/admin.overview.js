// backend/controllers/admin/admin.overview.controller.js

const User = require('../../models/AuthModel');    


exports.getUserCount = async (req, res) => {
    try {
        // Get total number of users
        const userCount = await User.countDocuments({ type: 'user' });

        // Send the response
        return res.status(200).json({ success: true, userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getAgencyCount = async (req, res) => {
    try {
        // Get total number of agencies
        const agencyCount = await User.countDocuments({ type: 'agency' });

        // Send the response
        return res.status(200).json({ success: true, agencyCount });
    } catch (error) {
        console.error('Error fetching agency count:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};