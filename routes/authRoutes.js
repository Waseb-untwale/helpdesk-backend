const express = require('express');
const { registerUser, loginUser, getCustomers ,editUser } = require('../controllers/authController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);
// router.get('/profile', authMiddleware, getProfile);

router.get(
  '/customers',
  authMiddleware, authorizeRoles('admin', 'agent'), // Only admin or agent can access
  getCustomers               // Controller function
);
// Protected Routes with role-based access
router.get('/customer-dashboard', authMiddleware, authorizeRoles('customer'), (req, res) => {
  res.json({ msg: 'Welcome to the Customer Dashboard!' });
});

router.get('/agent-dashboard', authMiddleware, authorizeRoles('agent'), (req, res) => {
  res.json({ msg: 'Welcome to the Agent Dashboard!' });
});

router.get('/admin-dashboard', authMiddleware, authorizeRoles('admin'), (req, res) => {
  res.json({ msg: 'Welcome to the Admin Dashboard!' });
});

router.put("/users/:id", authMiddleware, authorizeRoles("admin"), editUser); 

module.exports = router;
