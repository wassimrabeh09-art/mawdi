/* موعدي - Express.js REST API Server (Doctolib Tunisia Backend) */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Helper function to load JSON datasets with path fallbacks
function loadJsonData(possiblePaths, fallbackData) {
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {
        console.error(`[DataLoader] Error reading ${p}:`, e);
      }
    }
  }
  return fallbackData;
}

// Load dataset JSON files from their specific module directories
const doctorsList = loadJsonData([
  path.join(__dirname, 'pages', 'Doctors_pages', 'doctors.json'),
  path.join(__dirname, 'data', 'doctors.json')
], []);

const adminData = loadJsonData([
  path.join(__dirname, 'pages', 'Admin_pages', 'admin-db.json'),
  path.join(__dirname, 'data', 'admin-db.json')
], { pharmacies: [], users: [] });

const patientsData = loadJsonData([
  path.join(__dirname, 'pages', 'Patients_pages', 'patients-queue.json'),
  path.join(__dirname, 'data', 'patients-queue.json')
], { queueEntries: [], delayMinutes: 0 });

// In-Memory Database Registry (Matching Database ERD Schema)
let db = {
  users: adminData.users || [
    { id: 'usr-1', email: 'patient@موعدي.tn', role: 'PATIENT', created: '2026-01-10' },
    { id: 'usr-2', email: 'praticien@موعدي.tn', role: 'DOCTOR', created: '2026-01-15' }
  ],
  doctors: doctorsList,
  pharmacies: adminData.pharmacies || [],
  appointments: [],
  queueEntries: patientsData.queueEntries || [],
  delayMinutes: patientsData.delayMinutes || 0
};

// --- REST API ENDPOINTS ---

// 1. GET /api/doctors - Fetch doctors with optional search filters
app.get('/api/doctors', (req, res) => {
  const { specialty, city, keyword } = req.query;

  let filtered = db.doctors;

  if (specialty && specialty !== 'all') {
    filtered = filtered.filter(d => d.specialtyId === specialty);
  }
  if (city && city !== 'all') {
    filtered = filtered.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    filtered = filtered.filter(d => d.name.toLowerCase().includes(kw) || d.address.toLowerCase().includes(kw) || d.specialtyFr.toLowerCase().includes(kw));
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

// 2. POST /api/doctors - Register a new doctor cabinet
app.post('/api/doctors', (req, res) => {
  const newDoctor = {
    id: `doc-${Date.now()}`,
    ...req.body,
    rating: 5.0,
    reviewsCount: 1,
    avatar: '../doctor_profile_avatar_1785749404814.png'
  };

  db.doctors.unshift(newDoctor);
  res.status(201).json({ success: true, message: 'Cabinet médical créé avec succès !', data: newDoctor });
});

// 3. GET /api/queue - Fetch live secretary queue entries
app.get('/api/queue', (req, res) => {
  res.json({ success: true, count: db.queueEntries.length, delayMinutes: db.delayMinutes, data: db.queueEntries });
});

// 4. POST /api/appointments - Book appointment & add to live queue
app.post('/api/appointments', (req, res) => {
  const { doctorId, patientName, patientPhone, cnamCarnet, slotTime, motif } = req.body;

  const newAppointment = {
    id: `app-${Date.now()}`,
    doctorId,
    patientName,
    patientPhone,
    cnamCarnet,
    slotTime,
    motif,
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppointment);

  const newQueueEntry = {
    id: `q-${Date.now()}`,
    rank: db.queueEntries.length + 1,
    name: patientName,
    phone: patientPhone,
    motif: motif || 'Consultation cabinet',
    status: 'En salle d\'attente',
    time: slotTime || '11:30',
    payment: 'Espèces (70 TND)'
  };

  db.queueEntries.push(newQueueEntry);

  res.status(201).json({
    success: true,
    message: `Rendez-vous réservé avec succès ! Rang N° ${newQueueEntry.rank} attribué.`,
    data: { appointment: newAppointment, queueEntry: newQueueEntry }
  });
});

// 5. POST /api/queue/delay - Broadcast doctor delay (WhatsApp alert simulation)
app.post('/api/queue/delay', (req, res) => {
  const { minutes } = req.body;
  db.delayMinutes += parseInt(minutes || 15);

  res.json({
    success: true,
    message: `Retard de +${minutes} min signalé à ${db.queueEntries.length} patients en salle d'attente.`,
    totalDelayMinutes: db.delayMinutes
  });
});

// 6. GET /api/revenue - Fetch daily financial breakdown
app.get('/api/revenue', (req, res) => {
  res.json({
    success: true,
    data: {
      cashCollected: 540,
      checksDeposited: 210,
      pendingCnamClaims: 490,
      totalGrossRevenue: 1240,
      currency: 'TND'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'HEALTHY', app: 'موعدي Backend REST API', version: '1.0.0' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 موعدي Backend API Server running at http://localhost:${PORT}`);
});

