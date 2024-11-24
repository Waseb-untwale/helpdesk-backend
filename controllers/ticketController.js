const Ticket = require("../models/Ticket");

// 1. Create a new ticket
exports.createTicket = async (req, res) => {
  const {name , title, description  } = req.body;

  try {
    const newTicket = new Ticket({
      name,
      title,
      description
    });
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: "Failed to create ticket", error });
  }
};

// 2. Fetch all tickets (for customer-dashboard, agent-dashboard, admin-dashboard)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ updatedAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets", error });
  }
};

// 3. Update ticket status (for admin-dashboard and agent-dashboard)
exports.updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status, lastUpdated: Date.now() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Failed to update ticket", error });
  }

  
};



exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user.userId });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Fetch ticket details by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("customer", "name email");
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Add a note to a ticket
exports.addTicketNote = async (req, res) => {
  try {
    const { note } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    const newNote = {
      user: req.user.userId,
      note,
      timestamp: new Date(),
    };

    ticket.notes.push(newNote);
    ticket.updatedAt = new Date();
    await ticket.save();

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getNotesByTicketId = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the ticket by ID and include the notes field
    const ticket = await Ticket.findById(id).select('notes'); // Assuming notes is a field in your Ticket model

    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    // Return the notes
    res.status(200).json({ notes: ticket.notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};




