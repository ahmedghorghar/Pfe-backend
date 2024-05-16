/* // backend/logic/contactsLogic.js

// Import the Contact model
const CONTACT = require('../models/contactsModel');

// Export functions related to contact logic
module.exports = {
    // Function to insert a new contact
    insertContact: async (req, res) => {
        // Create a new contact instance and save it to the database
        const contacts = await new CONTACT ({
            name: req.body.name,
            phone: req.body.phone,
        }).save();
        // Respond with success message and inserted contact details
        res.json({
            message: 'inserted successfully',
            id: contacts.id,
            name: contacts.name
        });
    },

    // Function to retrieve all contacts
    getContact: async (req, res) => {
        try {
            // Retrieve all contacts from the database
            const contacts = await CONTACT.find();
            // Respond with status 200 and list of contacts
            res.status(200).json({
                result: contacts.map(contact => ({
                    id: contact.id,
                    name: contact.name,
                    phone: contact.phone
                }))
            });
        } catch (error) {
            // Handle errors and respond with an internal server error
            console.error('Error in getting contacts:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
 */