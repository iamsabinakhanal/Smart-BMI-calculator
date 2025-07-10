const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/users', adminController.getAllUsers);
router.post('/user', adminController.addUser);
router.put('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);

router.get('/plans', adminController.getAllPlans);
router.delete('/plan/:id', adminController.deletePlan);

router.post('/regenerate/:userId', adminController.regeneratePlan);

router.get('/stats', adminController.getDashboardStats);

module.exports = router;
