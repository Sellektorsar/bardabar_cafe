import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import * as api from './api';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Admin routes
app.get('/api/admin/status', async (req, res) => {
  try {
    const result = await api.getAdminStatus();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/verify', async (req, res) => {
  try {
    const result = await api.verifyAdminPassword(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/password', async (req, res) => {
  try {
    const result = await api.setAdminPassword(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Menu Categories
app.get('/api/menu/categories', async (req, res) => {
  try {
    const result = await api.getMenuCategories();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu/categories', async (req, res) => {
  try {
    const result = await api.createMenuCategory(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/menu/categories/:id', async (req, res) => {
  try {
    const result = await api.updateMenuCategory({ id: req.params.id, ...req.body });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/menu/categories/:id', async (req, res) => {
  try {
    const result = await api.deleteMenuCategory({ id: req.params.id });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Menu Items
app.get('/api/menu/items', async (req, res) => {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const result = await api.getMenuItems(categoryId ? { categoryId } : undefined);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu/items', async (req, res) => {
  try {
    const result = await api.createMenuItem(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/menu/items/:id', async (req, res) => {
  try {
    const result = await api.updateMenuItem({ id: req.params.id, ...req.body });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/menu/items/:id', async (req, res) => {
  try {
    const result = await api.deleteMenuItem({ id: req.params.id });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const result = await api.getEvents();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const result = await api.createEvent(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const result = await api.updateEvent({ id: req.params.id, ...req.body });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const result = await api.deleteEvent({ id: req.params.id });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// News
app.get('/api/news', async (req, res) => {
  try {
    const result = await api.getNews();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const result = await api.createNews(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const result = await api.updateNews({ id: req.params.id, ...req.body });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    const result = await api.deleteNews({ id: req.params.id });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Contact Requests
app.post('/api/contacts', async (req, res) => {
  try {
    const result = await api.submitContactRequest(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const result = await api.getContactRequests();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Staff
app.get('/api/staff', async (req, res) => {
  try {
    const result = await api.getStaffMembers();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    const result = await api.createStaffMember(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/staff/:id', async (req, res) => {
  try {
    const result = await api.updateStaffMember({ id: req.params.id, ...req.body });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    const result = await api.deleteStaffMember({ id: req.params.id });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// About Content
app.get('/api/about', async (req, res) => {
  try {
    const result = await api.getAboutContent();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/about', async (req, res) => {
  try {
    const result = await api.updateAboutContent(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Development/Debug routes
app.post('/api/_seed', async (req, res) => {
  try {
    const result = await api._seedInitialData();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/_reset-admin', async (req, res) => {
  try {
    const result = await api._resetAdminPassword();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/_make-admin', async (req, res) => {
  try {
    const result = await api._makeUserAdmin();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 