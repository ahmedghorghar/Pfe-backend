// backend/controllers/admin/userManagement.controller.js


const User = require('../../models/AuthModel');


exports.listUsers = async (req, res) => {
    try {
        // Query the database to find all users
        const users = await User.find({ type: 'user' }).select('name email country createdAt');

        // Send the response with user details
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.listAgencies = async (req, res) => {
    try {
        // Query the database to find all agencies
        const agencies = await User.find({ type: 'agency' }).select('agencyName email location createdAt');

        // Send the response with agency details
        res.status(200).json({ success: true, agencies });
    } catch (error) {
        console.error('Error listing agencies:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};