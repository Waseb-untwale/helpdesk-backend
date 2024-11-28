const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password ,role} = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists!' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword , role});

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password, } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found!' });

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


// const getProfile= async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select("-password");
//     console.log(user)
//     if (!user) return res.status(400).json({ msg: 'User not found!' });

    
//     if (user.role !== "customer") {
//       return res.status(403).json({ msg: 'Access denied. Only customers can view their profile.' });
//     }

//     // Return user profile details
//     res.json({
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       createdAt: user.createdAt,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


const getCustomers = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId).select("-password");
    if (!requestingUser) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    if (!['admin', 'agent'].includes(requestingUser.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const customers = await User.find({ role: 'customer' }).select('name email role createdAt');

    if (!customers || customers.length === 0) {
      return res.status(404).json({ msg: 'No customers found' });
    }

    res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};



const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};



module.exports = { registerUser, loginUser, getCustomers, editUser};
