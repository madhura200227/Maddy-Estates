import express from 'express';
import { store } from '../store.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET all leads (Admin Dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const leads = await store.getLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new customer inquiry
router.post('/', async (req, res) => {
  try {
    const newLead = await store.createLead(req.body);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT (update) lead status (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedLead = await store.updateLead(req.params.id, req.body);
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
