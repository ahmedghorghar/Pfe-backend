// routes/admin.route.js

const express = require('express');
const router = express.Router();
const adminController = require('../logic/admin/admin.auth.controller');
const adminAuthMiddleware = require('../middleware/admin.middl');
const AdminPasswordReset = require('../logic/admin/services/admin.Password.Reset.Logic')
const guest = require('../logic/guest.controller');
const userManagementController = require('../logic/admin/admin.overview');
const userAgencyController = require('../logic/admin/admin.listView');
const adminApproval = require('../logic/admin/admin.approval')

// Route to generate unique admin credentials
router.post('/generateCredentials', adminController.generateAdminCredentials);
// Route for admin login
router.post('/admin-login', adminController.adminLogin);

const adminPasswordReset = new AdminPasswordReset();
router.post("/reset-password/send-code", adminPasswordReset.sendVerificationCode);
router.post("/reset-password/verify-code", adminPasswordReset.verifyResetCode);
router.post("/reset-password/change-password", adminPasswordReset.changePassword);

// Route to count the number 
router.get('/count-guest',adminAuthMiddleware, guest.GuestCounter);
router.get('/user-count', userManagementController.getUserCount);
router.get('/agency-count', userManagementController.getAgencyCount);

// Route to list all registered users ang agencies
router.get('/users', /* adminAuthMiddleware,  */userAgencyController.listUsers);
router.get('/agencies', /* adminAuthMiddleware,  */userAgencyController.listAgencies);


// Route to fetch pending agency registrations
router.get('/pending-agency-registrations', adminApproval.pendingAgencyRegistrations)
router.get('/registered/:id', adminApproval.approveAgencyRegistration)
router.get('/reject-agency-registration/:id', adminApproval.rejectAgencyRegistration)

// Route to delete a user or agency
router.delete('/delete/:id', /* adminAuthMiddleware, */ adminController.deleteUserOrAgency);

module.exports = router;
