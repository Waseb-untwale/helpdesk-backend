const express = require("express");
const router = express.Router();
const { createTicket, getTickets, updateTicketStatus,getAllTickets,
  getTicketById,
  addTicketNote, getNotesByTicketId} = require("../controllers/ticketController");
const {
  
} = require("../controllers/ticketController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");



router.get("/:id", authMiddleware, getTicketById);
router.post("/:id/notes", authMiddleware, addTicketNote);
router.get("/:id/notes", authMiddleware, getNotesByTicketId);
// POST: Create a new ticket (Customer creates ticket)
router.post("/", createTicket);

// GET: Fetch all tickets (Customer, Agent, Admin can view)
router.get("/", getTickets);

// PUT: Update ticket status (Admin, Agent can update status)
router.put("/:id", updateTicketStatus);

module.exports = router;
