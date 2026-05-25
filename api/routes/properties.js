import express from 'express';
import { store } from '../store.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET all properties (with filtering, search, sorting)
router.get('/', async (req, res) => {
  try {
    const properties = await store.getProperties(req.query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await store.getPropertyById(req.params.id);
    res.json(property);
  } catch (error) {
    res.status(404).json({ error: error.message || 'Property not found' });
  }
});

// POST a new property (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const newProperty = await store.createProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT (update) an existing property (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedProperty = await store.updateProperty(req.params.id, req.body);
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a property (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedProperty = await store.deleteProperty(req.params.id);
    res.json({ message: 'Property deleted successfully', deletedProperty });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
