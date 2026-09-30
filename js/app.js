/* موعدي - Fully Functional Doctolib Tunisia Controller & Engine */

document.addEventListener('DOMContentLoaded', () => {
  // LocalStorage Helper Keys
  const STORAGE_KEY_QUEUE = 'موعدي_queue_v2';
  const STORAGE_KEY_PRESCRIPTION = 'موعدي_prescription_v2';
  const STORAGE_KEY_USER = 'موعدي_user_v2';

  // API Backend URL (Express / Python Server)
  const API_BASE_URL = 'http://localhost:4000/api';

  // Load Persisted Data
  function loadInitialQueue() {
    const saved = localStorage.getItem(STORAGE_KEY_QUEUE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return window.موعديData.initialQueue;
  }

  function loadInitialPrescription() {
    const saved = localStorage.getItem(STORAGE_KEY_PRESCRIPTION);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { drug: 'Doliprane 1000 mg', posology: '1 comprimé toutes les 8 heures si douleur', duration: '5 jours' },
      { drug: 'Inexium 40 mg', posology: '1 comprimé le matin à jeun', duration: '14 jours' }
    ];
  }

  function loadInitialUser() {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return null;
  }

  // Application State
  const state = {
    currentLang: 'fr',
    activeTab: 'patient',
    activeDbTable: 'users',
    currentUser: loadInitialUser(),
    selectedDoctor: null,
    selectedSlot: null,
    selectedDay: 'Aujourd\'hui',
    selectedDayMatrix: {},
    delayMinutes: 0,
    apiConnected: false,
    aiSymptomsBrief: null,
    searchFilters: {
      keyword: '',
      specialty: 'all',
      location: 'all',
      cnamOnly: false,
      telehealthOnly: false
    },
    myBooking: {
      doctorName: 'Dr. Selim Ben Ali',
      specialty: 'Cardiologie & Maladies Vasculaires',
      location: 'Ennasr 2, Tunis',
      date: 'Aujourd\'hui à 11:00',
      rank: 4,
      patientName: 'Fatma Ben Abdallah',
      phone: '+216 20 999 123',
      cnamCarnet: 'CNAM-99014-B'
    },
    doctorQueue: loadInitialQueue(),
    prescriptionItems: loadInitialPrescription()
  };

  // Cache DOM Elements
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewPanels = document.querySelectorAll('.view-panel');
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const doctorListContainer = document.getElementById('doctor-list-container');
  const searchKeywordInput = document.getElementById('search-keyword');
  const searchInputSpecialty = document.getElementById('search-specialty');
  const searchInputLocation = document.getElementById('search-location');
  const cnamCheckbox = document.getElementById('cnam-filter');
  const telehealthCheckbox = document.getElementById('telehealth-filter');
  const authButtonContainer = document.getElementById('auth-button-container');

  window.switchView = switchView;

  // Initialize
  initApp();

  async function initApp() {
    setupNavigation();
    setupLanguageToggle();
    renderDoctorList();
    renderPharmaciesList();
    setupSearchFilters();
    setupQueueSimulation();
    setupDoctorSaaS();
    setupPrescriptionBuilder();
    setupGlobalModals();
    updateHeaderUserStatus();

    // Check URL parameters for view switching
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'doctor') {
      switchView('doctor');
    } else if (urlParams.get('view') === 'database') {
      switchView('database');
    }

    // Dynamic Sync with Express REST API Backend Server if running
    await checkBackendApiConnection();
    renderDatabaseInspector('users');
  }

  async function checkBackendApiConnection() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      if (data.status === 'HEALTHY') {
        state.apiConnected = true;
        console.log('🟢 Connected to موعدي REST API Backend!');
        const kpiStatus = document.getElementById('db-kpi-status');
        if (kpiStatus) kpiStatus.innerHTML = `🟢 Connecté Serveur REST API Backend (Port 4000)`;
        await syncDataFromApi();
      }
    } catch (e) {
      console.log('⚪ Standalone Mode (localStorage & offline data)');
      const kpiStatus = document.getElementById('db-kpi-status');
      if (kpiStatus) kpiStatus.innerHTML = `⚪ Mode Persistance LocalStorage & Client JSON`;
    }
  }

  async function syncDataFromApi() {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors`);
      const result = await res.json();
      if (result.success && result.data.length > 0) {
        window.موعديData.doctors = result.data;
        renderDoctorList();
      }
    } catch (e) { }
  }

  // Navigation Logic
  function setupNavigation() {
    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = tab.getAttribute('data-view');
        switchView(targetView);
      });
    });
  }

  function switchView(viewId) {
    state.activeTab = viewId;
    navTabs.forEach(t => {
      if (t.getAttribute('data-view') === viewId) {
        t.classList.add('bg-teal-600', 'text-white');
        t.classList.remove('text-slate-300', 'hover:text-white');
      } else {
        t.classList.remove('bg-teal-600', 'text-white');
        t.classList.add('text-slate-300', 'hover:text-white');
      }
    });

    viewPanels.forEach(panel => {
      if (panel.id === `${viewId}-view` || (viewId === 'doctor' && panel.id === 'doctor-view')) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    if (viewId === 'database') {
      renderDatabaseInspector(state.activeDbTable);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // DATABASE INSPECTOR ENGINE
  window.switchDbTable = function (tableName) {
    state.activeDbTable = tableName;
    renderDatabaseInspector(tableName);
  };

  window.refreshDatabaseInspector = async function () {
    await checkBackendApiConnection();
    renderDatabaseInspector(state.activeDbTable);
    showToast('🗄️ Base de données rafraîchie avec succès !', 'success');
  };

  function renderDatabaseInspector(tableName = 'users') {
    const headElem = document.getElementById('db-grid-head');
    const bodyElem = document.getElementById('db-grid-body');
    if (!headElem || !bodyElem) return;

    // Update KPI Counts
    const docCount = document.getElementById('db-kpi-doctors');
    const qCount = document.getElementById('db-kpi-queue');
    const phCount = document.getElementById('db-kpi-pharmacies');
    if (docCount) docCount.textContent = `${window.موعديData.doctors.length} Records`;
    if (qCount) qCount.textContent = `${state.doctorQueue.length} Records`;
    if (phCount) phCount.textContent = `${window.موعديData.pharmaciesDeGarde.length} Records`;

    if (tableName === 'users') {
      headElem.innerHTML = `
        <tr class="bg-slate-900 text-white text-[11px] uppercase font-extrabold border-b border-slate-800">
          <th class="px-4 py-3">User UUID</th>
          <th class="px-4 py-3">Email Account</th>
          <th class="px-4 py-3">Mot de Passe (Haché Bcrypt / Hash)</th>
          <th class="px-4 py-3">Nom & Prénom</th>
          <th class="px-4 py-3">Rôle système</th>
          <th class="px-4 py-3">Méthode de Stockage</th>
        </tr>
      `;

      const usersList = [
        { id: 'usr-8812', email: 'dr.selim@موعدي.tn', passHash: '$2b$10$e892u... [Doctor2026!]', name: 'Dr. Selim Ben Ali', role: 'DOCTOR', storage: 'PostgreSQL DB / LocalStorage' },
        { id: 'usr-9014', email: 'dr.meriem@موعدي.tn', passHash: '$2b$10$k194a... [Doctor2026!]', name: 'Dr. Meriem Karray', role: 'DOCTOR', storage: 'PostgreSQL DB / LocalStorage' },
        { id: 'usr-4410', email: 'fatma.benabdallah@gmail.com', passHash: '$2b$10$p904x... [PatientPass]', name: 'Fatma Ben Abdallah', role: 'PATIENT', storage: 'PostgreSQL DB / Session' }
      ];

      bodyElem.innerHTML = usersList.map(usr => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-800">
          <td class="px-4 py-3 font-mono text-[11px] text-cyan-700 font-bold">${usr.id}</td>
          <td class="px-4 py-3 font-bold text-slate-900">${usr.email}</td>
          <td class="px-4 py-3 font-mono text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-1 rounded border border-rose-200">${usr.passHash}</td>
          <td class="px-4 py-3 font-extrabold text-slate-900">${usr.name}</td>
          <td class="px-4 py-3"><span class="${usr.role === 'DOCTOR' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-700'} px-2 py-0.5 rounded text-[10px] font-extrabold">${usr.role}</span></td>
          <td class="px-4 py-3 text-slate-600">${usr.storage}</td>
        </tr>
      `).join('');

    } else if (tableName === 'doctors') {
      headElem.innerHTML = `
        <tr class="bg-slate-900 text-white text-[11px] uppercase font-extrabold border-b border-slate-800">
          <th class="px-4 py-3">UUID / ID</th>
          <th class="px-4 py-3">Ordre des Médecins</th>
          <th class="px-4 py-3">Nom Praticien</th>
          <th class="px-4 py-3">Spécialité</th>
          <th class="px-4 py-3">Gouvernorat</th>
          <th class="px-4 py-3">CNAM Status</th>
          <th class="px-4 py-3 text-right">Honoraires (TND)</th>
        </tr>
      `;

      bodyElem.innerHTML = window.موعديData.doctors.map(doc => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-800">
          <td class="px-4 py-3 font-mono text-[11px] text-cyan-700 font-bold">${doc.id}</td>
          <td class="px-4 py-3 font-bold text-slate-900">${doc.ordreId || 'N° 14092'}</td>
          <td class="px-4 py-3 font-extrabold text-slate-900">${doc.name}</td>
          <td class="px-4 py-3 text-teal-700 font-bold">${doc.specialtyFr}</td>
          <td class="px-4 py-3 text-slate-600">${doc.city} (${doc.delegation})</td>
          <td class="px-4 py-3"><span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-extrabold">${doc.cnamType || 'Filière Privée'}</span></td>
          <td class="px-4 py-3 text-right font-black text-slate-900">${doc.fee} TND</td>
        </tr>
      `).join('');

    } else if (tableName === 'queue') {
      headElem.innerHTML = `
        <tr class="bg-slate-900 text-white text-[11px] uppercase font-extrabold border-b border-slate-800">
          <th class="px-4 py-3">Queue ID</th>
          <th class="px-4 py-3">Rang</th>
          <th class="px-4 py-3">Patient</th>
          <th class="px-4 py-3">Téléphone Mobile</th>
          <th class="px-4 py-3">Motif Consultation</th>
          <th class="px-4 py-3">Statut Stage</th>
          <th class="px-4 py-3">Mode Paiement</th>
        </tr>
      `;

      bodyElem.innerHTML = state.doctorQueue.map(item => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-800">
          <td class="px-4 py-3 font-mono text-[11px] text-cyan-700 font-bold">${item.id}</td>
          <td class="px-4 py-3 font-extrabold text-slate-900">Rang N° ${item.rank}</td>
          <td class="px-4 py-3 font-bold text-slate-900">${item.name}</td>
          <td class="px-4 py-3 text-slate-600">${item.phone}</td>
          <td class="px-4 py-3 text-slate-700">${item.motif}</td>
          <td class="px-4 py-3"><span class="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-extrabold">${item.status}</span></td>
          <td class="px-4 py-3 font-bold text-slate-900">${item.payment}</td>
        </tr>
      `).join('');

    } else if (tableName === 'pharmacies') {
      headElem.innerHTML = `
        <tr class="bg-slate-900 text-white text-[11px] uppercase font-extrabold border-b border-slate-800">
          <th class="px-4 py-3">Pharmacy ID</th>
          <th class="px-4 py-3">Nom Pharmacie</th>
          <th class="px-4 py-3">Pharmacien Responsable</th>
          <th class="px-4 py-3">Type Garde</th>
          <th class="px-4 py-3">Gouvernorat</th>
          <th class="px-4 py-3">Adresse & Téléphone</th>
        </tr>
      `;

      bodyElem.innerHTML = window.موعديData.pharmaciesDeGarde.map(ph => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-800">
          <td class="px-4 py-3 font-mono text-[11px] text-cyan-700 font-bold">${ph.id}</td>
          <td class="px-4 py-3 font-extrabold text-slate-900">${ph.name}</td>
          <td class="px-4 py-3 text-teal-700 font-bold">${ph.pharmacist}</td>
          <td class="px-4 py-3"><span class="${ph.type === 'GARDE_NUIT' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'} text-[10px] font-extrabold px-2 py-0.5 rounded">${ph.openHours}</span></td>
          <td class="px-4 py-3 text-slate-600">${ph.city} (${ph.delegation})</td>
          <td class="px-4 py-3 text-slate-700">${ph.address} — 📞 ${ph.phone}</td>
        </tr>
      `).join('');

    } else if (tableName === 'prescriptions') {
      headElem.innerHTML = `
        <tr class="bg-slate-900 text-white text-[11px] uppercase font-extrabold border-b border-slate-800">
          <th class="px-4 py-3">Item N°</th>
          <th class="px-4 py-3">Médicament (PCT Code)</th>
          <th class="px-4 py-3">Posologie Recommandée</th>
          <th class="px-4 py-3">Durée Traitement</th>
          <th class="px-4 py-3">Signature QR Hash</th>
        </tr>
      `;

      bodyElem.innerHTML = state.prescriptionItems.map((item, idx) => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-800">
          <td class="px-4 py-3 font-bold text-slate-900">#${idx + 1}</td>
          <td class="px-4 py-3 font-extrabold text-slate-900">${item.drug}</td>
          <td class="px-4 py-3 text-slate-700">${item.posology}</td>
          <td class="px-4 py-3 text-teal-700 font-bold">${item.duration}</td>
          <td class="px-4 py-3 font-mono text-[10px] text-slate-500">QR-PCT-88194-${idx}</td>
        </tr>
      `).join('');

    } else if (tableName === 'claims') {
      headElem.innerHTML = `
        <tr class="bg-slate-900 text-white text-[11px] uppercase font-extrabold border-b border-slate-800">
          <th class="px-4 py-3">Bulletin N°</th>
          <th class="px-4 py-3">Patient Assuré</th>
          <th class="px-4 py-3">Carnet CNAM ID</th>
          <th class="px-4 py-3">Code Acte</th>
          <th class="px-4 py-3">Total Acte</th>
          <th class="px-4 py-3 text-right">Part CNAM (70%)</th>
        </tr>
      `;

      bodyElem.innerHTML = state.doctorQueue.map(item => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-800">
          <td class="px-4 py-3 font-mono text-[11px] text-cyan-700 font-bold">${item.cnamSheet || 'BS-8891'}</td>
          <td class="px-4 py-3 font-extrabold text-slate-900">${item.name}</td>
          <td class="px-4 py-3 font-mono text-slate-600">CNAM-99014-B</td>
          <td class="px-4 py-3 font-bold text-slate-800">C1 (Consultation Spécialiste)</td>
          <td class="px-4 py-3 font-bold text-slate-900">70 TND</td>
          <td class="px-4 py-3 text-right font-black text-emerald-700">49 TND</td>
        </tr>
      `).join('');
    }
  }

  // Tunisian Derja Voice Search Simulator
  window.triggerDerjaVoiceSearch = function () {
    showToast('🎙️ Écoute de votre voix en Tounsi (Derja)... Spécialités & Villes');
    setTimeout(() => {
      if (searchKeywordInput) {
        searchKeywordInput.value = 'Dr. Ben Ali Cardiologue Ennasr';
        state.searchFilters.keyword = 'Dr. Ben Ali Cardiologue Ennasr';
        renderDoctorList();
      }
      showToast('🗣️ "نحب نأخذ ميعاد مع طبيب قلب في النصر" ➔ Résultats filtrés !', 'success', 5000);
    }, 1500);
  };

  // AI Pre-Consultation Symptom Assistant
  window.openAiSymptomModal = function () {
    document.getElementById('ai-symptom-modal')?.classList.remove('hidden');
  };

  window.closeAiSymptomModal = function () {
    document.getElementById('ai-symptom-modal')?.classList.add('hidden');
  };

  window.analyzeAiSymptoms = function (e) {
    if (e) e.preventDefault();
    const symptoms = document.getElementById('ai-symptoms-input')?.value || 'Douleur poitrine et palpitation';
    const duration = document.getElementById('ai-duration-input')?.value || '3 jours';

    state.aiSymptomsBrief = `Pré-consultation IA: ${symptoms} (Durée: ${duration})`;

    // Auto-select Cardiologist
    state.searchFilters.specialty = 'cardio';
    if (searchInputSpecialty) searchInputSpecialty.value = 'cardio';
    renderDoctorList();
    closeAiSymptomModal();

    showToast(`🤖 Analyse IA terminée ! Résumé préparé et spécialité recommandée: Cardiologie & Maladies Vasculaires.`, 'success', 6000);
  };

  // Pharmacies de Garde Renderer
  function renderPharmaciesList() {
    const container = document.getElementById('pharmacies-list-container');
    if (!container) return;

    container.innerHTML = window.موعديData.pharmaciesDeGarde.map(ph => `
      <div class="glass-panel p-5 border border-slate-200 rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl ${ph.type === 'GARDE_NUIT' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'} flex items-center justify-center text-xl font-bold">
            ${ph.type === 'GARDE_NUIT' ? '🌙' : '☀️'}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-extrabold text-xs text-slate-900">${ph.name}</h4>
              <span class="${ph.type === 'GARDE_NUIT' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'} text-[10px] font-extrabold px-2 py-0.5 rounded">
                ${ph.openHours}
              </span>
            </div>
            <p class="text-xs text-teal-700 font-bold mt-0.5">${ph.pharmacist}</p>
            <p class="text-xs text-slate-500 font-medium">📍 ${ph.address} (${ph.city})</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a href="tel:${ph.phone}" class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
            <span>📞</span> ${ph.phone}
          </a>
        </div>
      </div>
    `).join('');
  }

  // Header User Status
  function updateHeaderUserStatus() {
    if (!authButtonContainer) return;

    if (state.currentUser) {
      const isDoc = state.currentUser.role === 'doctor';
      authButtonContainer.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${state.currentUser.name} (${isDoc ? 'Médecin' : 'Patient'})</span>
          </div>
          <button onclick="window.logoutUser()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all" title="Déconnexion">
            🚪
          </button>
        </div>
      `;
    } else {
      authButtonContainer.innerHTML = `
        <a href="pages/Doctors_pages/doctor-auth.html" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center gap-2">
          <span>➕</span> Créer un Cabinet Médical 🩺
        </a>
      `;
    }
  }

  window.logoutUser = function () {
    state.currentUser = null;
    localStorage.removeItem(STORAGE_KEY_USER);
    updateHeaderUserStatus();
    switchView('patient');
    showToast(`Vous avez été déconnecté.`);
  };

  // Language Switcher
  function setupLanguageToggle() {
    if (!langToggleBtn) return;
    langToggleBtn.addEventListener('click', () => {
      state.currentLang = state.currentLang === 'fr' ? 'ar' : 'fr';
      document.body.classList.toggle('lang-ar', state.currentLang === 'ar');
      langToggleBtn.innerHTML = state.currentLang === 'fr'
        ? `<span class="flex items-center gap-1.5"><span class="text-xs">🇹🇳</span> العربية</span>`
        : `<span class="flex items-center gap-1.5"><span class="text-xs">🇫🇷</span> Français</span>`;

      renderDoctorList();
      updateQueueViewText();
    });
  }

  function get5ConsecutiveDays(offsetWeeks = 0) {
    const dayNames = ['dim.', 'lundi', 'mardi', 'mercr.', 'jeudi', 'vendr.', 'sam.'];
    const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

    const days = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (offsetWeeks * 7));

    for (let i = 0; i < 5; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      days.push({
        fullDateStr: `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`,
        dayName: dayNames[d.getDay()],
        dateNum: d.getDate(),
        monthName: monthNames[d.getMonth()],
        iso: d.toISOString().split('T')[0]
      });
    }
    return days;
  }

  window.shiftDoctorWeek = function (doctorId, direction) {
    if (!state.doctorWeekOffset) state.doctorWeekOffset = {};
    const current = state.doctorWeekOffset[doctorId] || 0;
    state.doctorWeekOffset[doctorId] = Math.max(0, current + direction);
    renderDoctorList();
  };

  // Helper to sync live inputs with browser URL and re-render
  function updateUrlAndRender() {
    const kInput = document.getElementById('search-keyword');
    const lInput = document.getElementById('search-location-input');

    const keyVal = kInput ? kInput.value.trim() : '';
    const locVal = lInput ? lInput.value.trim() : '';

    const params = new URLSearchParams();
    if (keyVal) params.set('keyword', keyVal);
    if (locVal) params.set('location', locVal);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
    renderDoctorList();
  }

  // Doctor List & Matrix Rendering with Search Autocomplete & 5-Day Calendar
  function renderDoctorList() {
    if (!doctorListContainer) return;

    const locInputEl = document.getElementById('search-location-input');
    const keyInputEl = document.getElementById('search-keyword');

    const keySearchVal = keyInputEl ? keyInputEl.value.toLowerCase().trim() : '';
    const locSearchVal = locInputEl ? locInputEl.value.toLowerCase().trim() : '';

    const filtered = window.موعديData.doctors.filter(doc => {
      const matchKey = !keySearchVal ||
        doc.name.toLowerCase().includes(keySearchVal) ||
        doc.address.toLowerCase().includes(keySearchVal) ||
        doc.specialtyFr.toLowerCase().includes(keySearchVal) ||
        doc.specialtyId.toLowerCase().includes(keySearchVal);

      const matchLoc = !locSearchVal ||
        locSearchVal === 'all' ||
        doc.city.toLowerCase().includes(locSearchVal) ||
        doc.delegation.toLowerCase().includes(locSearchVal) ||
        doc.address.toLowerCase().includes(locSearchVal);

      const matchCnam = !state.searchFilters.cnamOnly || doc.cnam;
      const matchTele = !state.searchFilters.telehealthOnly || doc.telehealth;

      return matchKey && matchLoc && matchCnam && matchTele;
    });

    const countEl = document.getElementById('results-count');
    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      doctorListContainer.innerHTML = `
        <div class="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm">
          <div class="w-16 h-16 bg-teal-50 text-[#0086cd] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">🔍</div>
          <h3 class="text-lg font-extrabold text-slate-800 mb-2">Aucun praticien trouvé</h3>
          <p class="text-slate-500 max-w-md mx-auto mb-6 text-xs font-medium">Veuillez vérifier vos critères de recherche (nom ou gouvernorat) ou réinitialiser vos filtres.</p>
          <button id="reset-filters-btn" class="bg-[#0086cd] hover:bg-[#0074b3] text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md text-xs">
            Réinitialiser tous les filtres
          </button>
        </div>
      `;
      document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
        state.searchFilters = { keyword: '', location: '', specialty: 'all', cnamOnly: false, telehealthOnly: false };
        if (keyInputEl) keyInputEl.value = '';
        if (locInputEl) locInputEl.value = '';
        window.history.replaceState({}, '', window.location.pathname);
        renderDoctorList();
      });
      return;
    }

    doctorListContainer.innerHTML = filtered.map(doc => {
      const offset = (state.doctorWeekOffset && state.doctorWeekOffset[doc.id]) || 0;
      const weekDays = get5ConsecutiveDays(offset);
      const specText = state.currentLang === 'ar' ? doc.specialtyAr : doc.specialtyFr;
      const avatarSrc = doc.avatar || 'images/doctor.png';

      return `
        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300">
  <div class="flex flex-col lg:flex-row gap-7 items-start">

    <!-- Left Side: Doctor Card Info -->
    <div class="flex gap-5 items-start w-full lg:w-5/12">

      <div class="relative shrink-0">
        <img src="${avatarSrc}" onerror="this.onerror=null; this.src='images/doctor.png';" alt="${doc.name}" 
             class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm border-2 border-slate-100">

        <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"
              title="Disponible en ligne"></span>
      </div>

      <div class="space-y-2 flex-1 min-w-0">

        <div>
          <h3 class="text-lg sm:text-xl font-extrabold text-[#0086cd] cursor-pointer hover:text-[#00b4b6] transition-colors flex items-center gap-2 leading-snug"
              onclick="window.openDoctorBioModal('${doc.id}')">
            <span>${doc.name}</span>
          </h3>

          <p class="text-xs sm:text-base font-bold text-slate-700 mt-1">
            ${specText}
          </p>
        </div>

        <p class="text-xs text-slate-500 flex items-start gap-2 leading-relaxed font-medium cursor-pointer group/addr"
           title="${doc.address} (Cliquer pour développer l'adresse)" 
           onclick="const el = this.querySelector('.addr-text'); el.classList.toggle('truncate'); el.classList.toggle('whitespace-normal');">

          <img src="../../images/gps.png"
               alt="Localisation"
               class="w-4 h-4 mt-0.5 shrink-0 opacity-70 group-hover/addr:opacity-100 group-hover/addr:scale-110 transition-all">

          <span class="addr-text truncate group-hover/addr:whitespace-normal group-hover/addr:text-slate-900 font-semibold transition-all"
                title="${doc.address}">
            ${doc.address}
          </span>
        </p>

        <div class="flex items-center gap-3 text-xs sm:text-base font-semibold text-slate-700 pt-1 flex-wrap">

          <span class="text-amber-500 font-extrabold flex items-center gap-1.5">
            ★ ${doc.rating || 4.9}
            <span class="text-slate-400 font-medium">
              (${doc.reviewsCount || 100})
            </span>
          </span>

          <span class="text-slate-300">-</span>

          <span class="text-slate-900 font-extrabold">
            ${doc.fee} TND
          </span>

        </div>

        <div class="pt-3 flex items-center gap-3 flex-wrap">

          <button onclick="window.openDoctorBioModal('${doc.id}')"
                  class="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-[#0086cd] font-bold transition-colors group">

            <svg class="w-4 h-4 text-slate-400 group-hover:text-[#0086cd] transition-colors"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>

            <span class="underline underline-offset-2 decoration-slate-300 group-hover:decoration-[#0086cd]">
              Voir la fiche du cabinet
            </span>
          </button>

          ${doc.telehealth ? `
            <button onclick="window.openVideoRoomModal('${doc.name}')"
                    class="inline-flex items-center gap-2 px-3 py-2 bg-cyan-50 hover:bg-cyan-100 text-[#0086cd] text-xs font-extrabold rounded-xl border border-cyan-200/80 transition-all shadow-2xs group"
                    title="Consulter ce médecin en vidéo">

              <svg class="w-4 h-4 text-[#0086cd] group-hover:scale-110 transition-transform"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>

              <span>Téléconsultation disponible</span>
            </button>
          ` : ''}

        </div>
      </div>
    </div>

    <!-- Right Side: Calendar -->
    <div class="w-full lg:w-7/12 bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">

      <!-- Days Header -->
      <div class="grid grid-cols-5 gap-2 text-center border-b border-slate-200/60 pb-3 relative">

        <button onclick="window.shiftDoctorWeek('${doc.id}', -1)" 
                class="absolute -left-2 top-0 w-7 h-7 rounded-full bg-white hover:bg-[#0086cd] hover:text-white border border-slate-200 text-slate-600 font-extrabold flex items-center justify-center text-xs transition-all shadow-xs">
          ‹
        </button>

        ${weekDays.map(day => `
          <div class="px-1">
            <span class="block font-extrabold text-slate-800 text-xs capitalize">
              ${day.dayName}
            </span>

            <span class="block text-xs text-slate-500 font-semibold mt-0.5">
              ${day.dateNum} ${day.monthName}
            </span>
          </div>
        `).join('')}

        <button onclick="window.shiftDoctorWeek('${doc.id}', 1)" 
                class="absolute -right-2 top-0 w-7 h-7 rounded-full bg-white hover:bg-[#0086cd] hover:text-white border border-slate-200 text-slate-600 font-extrabold flex items-center justify-center text-xs transition-all shadow-xs">
          ›
        </button>

      </div>

      <!-- Time Slots -->
      <div class="grid grid-cols-5 gap-2 pt-4 text-center">

        ${weekDays.map((dayObj, colIdx) => {
        const dayKey = dayObj.dayName;

        const daySlots =
          (doc.slots && doc.slots[dayKey])
            ? doc.slots[dayKey]
            : (colIdx % 2 === 0
              ? ['08:40', '09:40', '14:20', '15:20']
              : ['09:00', '11:30', '14:00', '16:00']);

        if (!daySlots || daySlots.length === 0) {
          return `
              <div class="flex flex-col items-center justify-center min-h-[140px] text-slate-00 font-bold text-xs">
                —
              </div>
            `;
        }

        return `
            <div class="flex flex-col gap-2">

              ${daySlots.slice(0, 3).map(slot => `
                <button onclick="window.openBookingModal('${doc.id}', '${slot}', '${dayObj.fullDateStr}')"
                        class="w-full bg-[#e0f7fa] hover:bg-[#0086cd] hover:text-white text-[#0086cd] font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-xs border border-cyan-100 transform hover:-translate-y-0.5">

                  ${slot}

                </button>
              `).join('')}

            </div>
          `;

      }).join('')}

      </div>
    </div>

  </div>
</div>
      
        `;
    }).join('');
  }

  // Setup Search Filter Listeners & Parse URL Parameters
  function setupSearchFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlKeyword = urlParams.get('keyword') || urlParams.get('query');
    const urlSpecialty = urlParams.get('specialty');
    const urlLocation = urlParams.get('location') || urlParams.get('governorat');

    const kInput = document.getElementById('search-keyword');
    const lInput = document.getElementById('search-location-input');
    const sBtn = document.getElementById('search-btn');

    const specialtyMap = {
      'cardio': 'Cardiologie',
      'pediatrie': 'Pédiatrie',
      'dentiste': 'Dentiste',
      'generaliste': 'Médecine Générale',
      'gyneco': 'Gynécologie'
    };

    const effectiveQuery = urlKeyword || (urlSpecialty ? (specialtyMap[urlSpecialty] || urlSpecialty) : '');

    if (effectiveQuery && kInput) {
      kInput.value = decodeURIComponent(effectiveQuery);
    }

    if (urlLocation && lInput) {
      lInput.value = decodeURIComponent(urlLocation);
    }

    if (kInput) {
      kInput.addEventListener('input', () => updateUrlAndRender());

      // Real-time Autocomplete Suggestions for search-keyword
      const keySuggestions = document.getElementById('search-keyword-suggestions');
      if (keySuggestions) {
        kInput.addEventListener('input', () => {
          const query = kInput.value.toLowerCase().trim();
          if (!query) {
            keySuggestions.classList.add('hidden');
            keySuggestions.innerHTML = '';
            return;
          }

          const doctors = (window.موعديData && window.موعديData.doctors) ? window.موعديData.doctors : [];
          const specialties = (window.موعديData && window.موعديData.specialties) ? window.موعديData.specialties : [];

          const matchingSpecs = specialties.filter(s =>
            s.fr.toLowerCase().includes(query) || (s.ar && s.ar.includes(query)) || s.id.toLowerCase().includes(query)
          );

          const matchingDocs = doctors.filter(d =>
            d.name.toLowerCase().includes(query) ||
            d.specialtyFr.toLowerCase().includes(query) ||
            d.city.toLowerCase().includes(query) ||
            (d.delegation && d.delegation.toLowerCase().includes(query))
          );

          if (matchingSpecs.length === 0 && matchingDocs.length === 0) {
            keySuggestions.classList.remove('hidden');
            keySuggestions.innerHTML = `<div class="p-3 text-xs font-semibold text-slate-400 text-center">Aucune suggestion pour "${kInput.value}"</div>`;
            return;
          }

          let html = '';

          if (matchingSpecs.length > 0) {
            html += `<div class="px-2 py-1 text-[10px] font-black uppercase text-[#0086cd] tracking-wider">💡 Spécialités</div>`;
            matchingSpecs.forEach(s => {
              html += `
                <div class="suggestion-item flex items-center gap-2 p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors" data-value="${s.fr}">
                  <span class="w-6 h-6 rounded-lg bg-blue-100 text-[#0086cd] flex items-center justify-center text-xs font-bold shrink-0">🩺</span>
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-slate-800">${s.fr}</div>
                    ${s.ar ? `<div class="text-[10px] text-slate-400 font-medium">${s.ar}</div>` : ''}
                  </div>
                </div>`;
            });
          }

          if (matchingDocs.length > 0) {
            html += `<div class="px-2 py-1 mt-1 text-[10px] font-black uppercase text-[#0086cd] tracking-wider">👨‍⚕️ Médecins Praticiens</div>`;
            matchingDocs.forEach(d => {
              html += `
                <div class="suggestion-item flex items-center gap-2.5 p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors" data-value="${d.name}">
                  <div class="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                    <img src="images/doctor.png" class="w-full h-full object-cover">
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-slate-800 truncate">${d.name}</div>
                    <div class="text-[10px] text-slate-500 font-medium truncate">${d.specialtyFr} • ${d.city} (${d.delegation || ''})</div>
                  </div>
                </div>`;
            });
          }

          keySuggestions.classList.remove('hidden');
          keySuggestions.innerHTML = html;

          keySuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
              kInput.value = item.getAttribute('data-value');
              keySuggestions.classList.add('hidden');
              updateUrlAndRender();
            });
          });
        });

        document.addEventListener('click', (e) => {
          if (!kInput.contains(e.target) && !keySuggestions.contains(e.target)) {
            keySuggestions.classList.add('hidden');
          }
        });
      }
    }

    if (lInput) {
      lInput.addEventListener('input', () => updateUrlAndRender());

      // Real-time Autocomplete Suggestions for search-location-input
      const locSuggestions = document.getElementById('search-location-suggestions');
      if (locSuggestions) {
        lInput.addEventListener('input', () => {
          const query = lInput.value.toLowerCase().trim();
          if (!query) {
            locSuggestions.classList.add('hidden');
            locSuggestions.innerHTML = '';
            return;
          }

          const locations = (window.موعديData && window.موعديData.locations) ? window.موعديData.locations : [];
          let matchingGovs = locations.filter(loc => loc.city.toLowerCase().includes(query));

          let matchingDels = [];
          locations.forEach(loc => {
            loc.delegations.forEach(del => {
              if (del.toLowerCase().includes(query)) {
                matchingDels.push({ delegation: del, city: loc.city });
              }
            });
          });

          if (matchingGovs.length === 0 && matchingDels.length === 0) {
            locSuggestions.classList.remove('hidden');
            locSuggestions.innerHTML = `<div class="p-3 text-xs font-semibold text-slate-400 text-center">Aucune localité pour "${lInput.value}"</div>`;
            return;
          }

          let html = '';
          if (matchingGovs.length > 0) {
            html += `<div class="px-2 py-1 text-[10px] font-black uppercase text-[#0086cd] tracking-wider">🏢 Gouvernorats</div>`;
            matchingGovs.forEach(g => {
              html += `
                <div class="suggestion-item flex items-center gap-2 p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors" data-value="${g.city}">
                  <span class="text-xs inline-block mx-1"></span>
                  <div class="text-xs font-bold text-slate-800">${g.city}</div>
                </div>`;
            });
          }

          if (matchingDels.length > 0) {
            html += `<div class="px-2 py-1 mt-1 text-[10px] font-black uppercase text-[#0086cd] tracking-wider">🏙️ Localités / Délégations</div>`;
            matchingDels.slice(0, 8).forEach(d => {
              html += `
                <div class="suggestion-item flex items-center gap-2 p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors" data-value="${d.delegation}, ${d.city}">
                                    <span class="text-xs inline-block mx-1"></span>

                  <div class="text-xs font-bold text-slate-800">${d.delegation} <span class="text-slate-400 font-normal">(${d.city})</span></div>
                </div>`;
            });
          }

          locSuggestions.classList.remove('hidden');
          locSuggestions.innerHTML = html;

          locSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
              lInput.value = item.getAttribute('data-value');
              locSuggestions.classList.add('hidden');
              updateUrlAndRender();
            });
          });
        });

        document.addEventListener('click', (e) => {
          if (!lInput.contains(e.target) && !locSuggestions.contains(e.target)) {
            locSuggestions.classList.add('hidden');
          }
        });
      }
    }
    if (sBtn) {
      sBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateUrlAndRender();
      });
    }

    const availBtn = document.getElementById('filter-avail-btn');
    if (availBtn) {
      availBtn.addEventListener('click', () => window.openAvailabilityModal());
    }

    renderDoctorList();
  }

  // Availability Filter Modal Logic
  window.openAvailabilityModal = function () {
    const modal = document.getElementById('availability-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeAvailabilityModal = function () {
    const modal = document.getElementById('availability-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.clearAvailabilityFilter = function () {
    const radios = document.querySelectorAll('input[name="avail-option"]');
    radios.forEach(r => r.checked = false);
    state.searchFilters.availFilter = null;

    const availBtn = document.getElementById('filter-avail-btn');
    if (availBtn) {
      availBtn.classList.remove('bg-[#0086cd]', 'text-white');
      availBtn.classList.add('bg-slate-100', 'text-slate-700');
    }

    closeAvailabilityModal();
    renderDoctorList();
  };

  window.applyAvailabilityFilter = function () {
    const selected = document.querySelector('input[name="avail-option"]:checked')?.value;
    state.searchFilters.availFilter = selected || null;

    const availBtn = document.getElementById('filter-avail-btn');
    if (availBtn) {
      if (selected) {
        availBtn.classList.remove('bg-slate-100', 'text-slate-700');
        availBtn.classList.add('bg-[#0086cd]', 'text-white');
      } else {
        availBtn.classList.remove('bg-[#0086cd]', 'text-white');
        availBtn.classList.add('bg-slate-100', 'text-slate-700');
      }
    }

    closeAvailabilityModal();
    renderDoctorList();
  };

  // Booking Modal Logic with Flouci / D17 Payment Support
  window.openBookingModal = function (doctorId, timeSlot, day) {
    const customDocs = JSON.parse(localStorage.getItem('موعدي_custom_doctors') || '[]');
    const allDocs = [...(window.موعديData.doctors || []), ...customDocs];
    const doc = allDocs.find(d => d.id === doctorId);
    if (!doc) return;

    state.selectedDoctor = doc;
    state.selectedSlot = timeSlot;
    state.selectedDay = day;

    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    const avatarEl = document.getElementById('modal-doc-avatar');
    if (avatarEl) {
      avatarEl.src = (doc.avatar && !doc.avatar.includes('3ila_doctor')) ? doc.avatar : 'images/doctor.png';
    }

    const nameEl = document.getElementById('modal-doc-name');
    if (nameEl) nameEl.textContent = doc.name;

    const specEl = document.getElementById('modal-doc-spec');
    if (specEl) specEl.textContent = `${doc.specialtyFr} • ${doc.city} (${doc.delegation || ''})`;

    const slotEl = document.getElementById('modal-slot-time');
    if (slotEl) slotEl.textContent = `${day} à ${timeSlot}`;

    const feeEl = document.getElementById('modal-doc-fee');
    if (feeEl) feeEl.textContent = `${doc.fee} TND`;

    const cnamInfoEl = document.getElementById('modal-doc-cnam-info');
    if (cnamInfoEl) {
      if (doc.cnam) {
        cnamInfoEl.innerHTML = `<span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl font-black">~${doc.cnamReimbursement} TND <span class="text-[10px] font-semibold text-emerald-600">(Reste : ${doc.fee - doc.cnamReimbursement} TND)</span></span>`;
      } else {
        cnamInfoEl.innerHTML = `<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-xl font-bold">Paiement direct (Hors CNAM)</span>`;
      }
    }

    modal.classList.remove('hidden');
  };

  window.closeBookingModal = function () {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.confirmBooking = async function (event) {
    if (event) event.preventDefault();

    const patientName = document.getElementById('patient-name-input')?.value || 'Fatma Ben Abdallah';
    const patientPhone = document.getElementById('patient-phone-input')?.value || '+216 20 999 123';
    const cnamCarnet = document.getElementById('patient-cnam-input')?.value || 'CNAM-99014-B';
    const motif = document.getElementById('booking-motif')?.value || 'Consultation de suivi';
    const payMode = document.getElementById('booking-pay-mode')?.value || 'CABINET';

    state.myBooking = {
      doctorName: state.selectedDoctor.name,
      specialty: state.selectedDoctor.specialtyFr,
      location: `${state.selectedDoctor.delegation}, ${state.selectedDoctor.city}`,
      date: `${state.selectedDay} à ${state.selectedSlot}`,
      rank: state.doctorQueue.length + 1,
      patientName: patientName,
      phone: patientPhone,
      cnamCarnet: cnamCarnet
    };

    const newQueueItem = {
      id: `q-${Date.now()}`,
      rank: state.doctorQueue.length + 1,
      name: patientName,
      phone: patientPhone,
      motif: state.aiSymptomsBrief ? `${motif} (${state.aiSymptomsBrief})` : motif,
      status: 'En salle d\'attente',
      time: state.selectedSlot,
      payment: payMode === 'FLOUCI' ? 'Flouci Mobile Pay (70 TND)' : (payMode === 'D17' ? 'La Poste D17 (70 TND)' : `Espèces (${state.selectedDoctor.fee} TND)`),
      cnamSheet: `BS-${Math.floor(1000 + Math.random() * 9000)}`
    };

    state.doctorQueue.push(newQueueItem);
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(state.doctorQueue));

    if (payMode === 'FLOUCI' || payMode === 'D17') {
      showToast(`💳 Paiement mobile via ${payMode} confirmé avec succès !`, 'success');
    }

    closeBookingModal();

    // Reset input fields after confirmation
    const nameInput = document.getElementById('patient-name-input');
    if (nameInput) nameInput.value = '';
    const phoneInput = document.getElementById('patient-phone-input');
    if (phoneInput) phoneInput.value = '';
    const cnamInput = document.getElementById('patient-cnam-input');
    if (cnamInput) cnamInput.value = '';

    renderSecretaryTable();
    switchView('queue');
    updateQueueViewText();
    showToast(`✅ Rendez-vous confirmé chez ${state.selectedDoctor.name}. SMS/WhatsApp de confirmation envoyé au ${patientPhone}.`, 'success');
  };

  // Live Queue Simulator
  function setupQueueSimulation() {
    const advanceBtn = document.getElementById('advance-queue-btn');
    if (!advanceBtn) return;

    advanceBtn.addEventListener('click', () => {
      if (state.myBooking.rank > 1) {
        state.myBooking.rank -= 1;
        updateQueueViewText();

        if (state.myBooking.rank === 1) {
          showToast(`🔔 C'EST À VOUS DE PASSER ! Veuillez accéder au cabinet du ${state.myBooking.doctorName}.`, 'success', 8000);
          window.openVideoRoomModal(state.myBooking.doctorName);
        } else {
          showToast(`⏱️ Mise à jour du rang: Vous êtes actuellement N° ${state.myBooking.rank}.`);
        }
      } else {
        showToast(`✅ Consultation achevée. Merci de votre confiance en موعدي.`);
      }
    });
  }

  function updateQueueViewText() {
    const rankElem = document.getElementById('queue-rank-display');
    const docElem = document.getElementById('queue-doc-display');
    const timeElem = document.getElementById('queue-time-display');

    if (rankElem) rankElem.textContent = `N° ${state.myBooking.rank}`;
    if (docElem) docElem.textContent = state.myBooking.doctorName;
    if (timeElem) {
      const waitTime = (state.myBooking.rank * 6) + state.delayMinutes;
      timeElem.textContent = state.myBooking.rank === 1 ? 'ACCÈS AU CABINET' : `~${waitTime} minutes ${state.delayMinutes > 0 ? `(+${state.delayMinutes}m retard signalé)` : ''}`;
    }
  }

  // Doctor SaaS Workspace
  function setupDoctorSaaS() {
    renderSecretaryTable();

    document.getElementById('add-walkin-btn')?.addEventListener('click', () => {
      document.getElementById('walkin-modal')?.classList.remove('hidden');
    });
  }

  // 1-Click Smart Delay Broadcast Handler
  window.triggerDoctorDelay = async function (minutes) {
    state.delayMinutes += minutes;
    updateQueueViewText();

    if (state.apiConnected) {
      try {
        await fetch(`${API_BASE_URL}/queue/delay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes })
        });
      } catch (e) { }
    }

    showToast(`📢 Retard de +${minutes} min signalé ! WhatsApp de mise à jour envoyé à ${state.doctorQueue.length} patients en salle d'attente.`, 'success', 6000);
  };

  // Posology Preset Launcher
  window.applyPrescriptionPreset = function (presetType) {
    if (presetType === 'cardio') {
      state.prescriptionItems = [
        { drug: 'Doliprane 1000 mg', posology: '1 comprimé toutes les 8h si douleur', duration: '5 jours' },
        { drug: 'Tahor 20 mg', posology: '1 comprimé le soir au coucher', duration: '30 jours' },
        { drug: 'Inexium 40 mg', posology: '1 comprimé le matin à jeun', duration: '14 jours' }
      ];
    } else if (presetType === 'infectious') {
      state.prescriptionItems = [
        { drug: 'Augmentin 1 g / 125 mg', posology: '1 comprimé 2 fois par jour pendant 7 jours', duration: '7 jours' },
        { drug: 'Solupred 20 mg', posology: '2 comprimés le matin avec petit-déjeuner', duration: '5 jours' },
        { drug: 'Spasfon 80 mg', posology: '2 comprimés en cas de crise', duration: '5 jours' }
      ];
    }
    localStorage.setItem(STORAGE_KEY_PRESCRIPTION, JSON.stringify(state.prescriptionItems));
    renderPrescriptionItems();
    showToast(`Preset d'ordonnance appliqué (${presetType.toUpperCase()}) !`, 'success');
  };

  // Confraternal Referral Letter Generator
  window.openReferralModal = function () {
    document.getElementById('referral-modal')?.classList.remove('hidden');
  };

  window.closeReferralModal = function () {
    document.getElementById('referral-modal')?.classList.add('hidden');
  };

  window.printReferralLetter = function (e) {
    if (e) e.preventDefault();
    alert('📋 Lettre d\'adressage confraternelle générée et prête pour impression !');
    window.print();
    closeReferralModal();
  };

  // CNAM Revenue Analytics Modal
  window.openRevenueModal = function () {
    document.getElementById('revenue-modal')?.classList.remove('hidden');
  };

  window.closeRevenueModal = function () {
    document.getElementById('revenue-modal')?.classList.add('hidden');
  };

  function renderSecretaryTable() {
    const tableBody = document.getElementById('secretary-queue-table');
    if (!tableBody) return;

    tableBody.innerHTML = state.doctorQueue.map((item, index) => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-all text-xs">
        <td class="px-4 py-3.5 font-extrabold text-slate-800">
          <span class="w-7 h-7 rounded-lg ${item.status === 'En Consultation' ? 'bg-emerald-600 text-white font-extrabold' : 'bg-slate-200 text-slate-700'} inline-flex items-center justify-center text-xs">
            ${index + 1}
          </span>
        </td>
        <td class="px-4 py-3.5 font-bold text-slate-900 cursor-pointer hover:text-teal-600" onclick="window.openPatientEhrModal('${item.name}')">
          ${item.name} 📂
          ${item.rank === 5 ? `<span class="badge-cnam text-[9px] ml-1">⚠️ 2 Absences Non Honorées</span>` : ''}
        </td>
        <td class="px-4 py-3.5 text-slate-600">${item.motif}</td>
        <td class="px-4 py-3.5 font-semibold text-slate-700">${item.time}</td>
        <td class="px-4 py-3.5">
          <select onchange="window.updatePatientStatus(${index}, this.value)" class="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-slate-800">
            <option value="En salle d'attente" ${item.status === 'En salle d\'attente' ? 'selected' : ''}>En salle d'attente</option>
            <option value="En Consultation" ${item.status === 'En Consultation' ? 'selected' : ''}>En Consultation</option>
            <option value="Terminé" ${item.status === 'Terminé' ? 'selected' : ''}>Terminé</option>
            <option value="Absent / Annulé" ${item.status === 'Absent / Annulé' ? 'selected' : ''}>Absent / Annulé</option>
          </select>
        </td>
        <td class="px-4 py-3.5 font-medium text-slate-600">${item.payment}</td>
        <td class="px-4 py-3.5 text-right flex gap-1.5 justify-end">
          <button onclick="window.openCnamFormModal('${item.name}', '${item.cnamSheet}')" class="text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-2 py-1 rounded border border-blue-200">
            Bulletin CNAM
          </button>
          <button onclick="window.removePatientFromQueue(${index})" class="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded border border-rose-200">
            Supprimer
          </button>
        </td>
      </tr>
    `).join('');

    const kpiTotal = document.getElementById('kpi-total-rdv');
    const kpiWait = document.getElementById('kpi-waiting-room');
    const kpiComp = document.getElementById('kpi-completed');
    if (kpiTotal) kpiTotal.textContent = `${state.doctorQueue.length} Patients`;
    if (kpiWait) kpiWait.textContent = `${state.doctorQueue.filter(q => q.status === 'En salle d\'attente').length} Patients`;
    if (kpiComp) kpiComp.textContent = `${state.doctorQueue.filter(q => q.status === 'Terminé').length} Patients`;
  }

  window.updatePatientStatus = function (index, newStatus) {
    if (state.doctorQueue[index]) {
      state.doctorQueue[index].status = newStatus;
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(state.doctorQueue));
      renderSecretaryTable();
      showToast(`Statut de ${state.doctorQueue[index].name} mis à jour : ${newStatus}`);
    }
  };

  window.removePatientFromQueue = function (index) {
    if (confirm('Êtes-vous sûr de vouloir retirer ce patient de la file d\'attente ?')) {
      const removed = state.doctorQueue.splice(index, 1);
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(state.doctorQueue));
      renderSecretaryTable();
      showToast(`Patient ${removed[0]?.name} retiré de la file.`);
    }
  };

  window.confirmAddWalkinPatient = function (event) {
    if (event) event.preventDefault();
    const name = document.getElementById('walkin-name-input')?.value || 'Nouveau Patient';
    const phone = document.getElementById('walkin-phone-input')?.value || '+216 22 111 222';
    const motif = document.getElementById('walkin-motif-input')?.value || 'Consultation directe';

    const newItem = {
      id: `q-${Date.now()}`,
      rank: state.doctorQueue.length + 1,
      name: name,
      phone: phone,
      motif: motif,
      status: 'En salle d\'attente',
      time: 'Sans RDV',
      payment: 'Espèces (70 TND)',
      cnamSheet: `BS-${Math.floor(1000 + Math.random() * 9000)}`
    };

    state.doctorQueue.push(newItem);
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(state.doctorQueue));
    document.getElementById('walkin-modal')?.classList.add('hidden');
    renderSecretaryTable();
    showToast(`Patient Sans RDV ${name} ajouté avec succès au rang N° ${state.doctorQueue.length}.`, 'success');
  };

  // Electronic Prescription Builder
  function setupPrescriptionBuilder() {
    const addDrugBtn = document.getElementById('add-drug-btn');
    const drugSelect = document.getElementById('pct-drug-select');
    const printBtn = document.getElementById('print-prescription-btn');

    if (drugSelect) {
      drugSelect.innerHTML = window.موعديData.pctMedications.map(m => `
        <option value="${m.name}" data-posology="${m.defaultPosology}">${m.name} — ${m.category}</option>
      `).join('');
    }

    if (addDrugBtn) {
      addDrugBtn.addEventListener('click', () => {
        const drugName = drugSelect.value;
        const selectedOpt = drugSelect.options[drugSelect.selectedIndex];
        const defaultPos = selectedOpt.getAttribute('data-posology') || '1 comprimé par jour';
        const duration = document.getElementById('drug-duration-input')?.value || '7 jours';

        state.prescriptionItems.push({ drug: drugName, posology: defaultPos, duration: duration });
        localStorage.setItem(STORAGE_KEY_PRESCRIPTION, JSON.stringify(state.prescriptionItems));
        renderPrescriptionItems();
        showToast(`Médicament ${drugName} ajouté à l'ordonnance.`);
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.openPrescriptionPrintModal();
      });
    }

    renderPrescriptionItems();
  }

  function renderPrescriptionItems() {
    const container = document.getElementById('prescription-items-list');
    if (!container) return;

    container.innerHTML = state.prescriptionItems.map((item, idx) => `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2 text-xs">
        <div>
          <span class="font-extrabold text-slate-900 block">${idx + 1}. ${item.drug}</span>
          <span class="text-slate-600">${item.posology} — <span class="font-bold text-teal-700">Pendant ${item.duration}</span></span>
        </div>
        <button onclick="window.removePrescriptionItem(${idx})" class="text-rose-500 hover:text-rose-700 font-bold px-2 py-1">
          ✕
        </button>
      </div>
    `).join('');
  }

  window.removePrescriptionItem = function (index) {
    state.prescriptionItems.splice(index, 1);
    localStorage.setItem(STORAGE_KEY_PRESCRIPTION, JSON.stringify(state.prescriptionItems));
    renderPrescriptionItems();
  };

  // Global Modals
  function setupGlobalModals() {
    window.openDoctorBioModal = function (doctorId) {
      const doc = window.موعديData.doctors.find(d => d.id === doctorId);
      if (!doc) return;

      const modal = document.getElementById('doctor-bio-modal');
      if (!modal) return;

      document.getElementById('bio-doc-name').textContent = `${doc.name} (${doc.ordreId})`;
      document.getElementById('bio-doc-title').textContent = doc.title;
      document.getElementById('bio-doc-spec').textContent = doc.specialtyFr;
      document.getElementById('bio-doc-faculty').textContent = doc.faculty;
      document.getElementById('bio-doc-cnam').textContent = doc.cnamType;
      document.getElementById('bio-doc-phone').textContent = doc.phone;
      document.getElementById('bio-doc-address').textContent = doc.address;
      document.getElementById('bio-doc-equipment').innerHTML = doc.equipment.map(e => `<li class="text-xs text-slate-700 font-medium">✓ ${e}</li>`).join('');

      modal.classList.remove('hidden');
    };

    window.closeDoctorBioModal = function () {
      document.getElementById('doctor-bio-modal')?.classList.add('hidden');
    };

    window.openPatientEhrModal = function (patientName) {
      const modal = document.getElementById('patient-ehr-modal');
      if (!modal) return;

      const record = window.موعديData.patientEHRs[patientName] || {
        age: 35,
        gender: 'Patient',
        blood: 'O+',
        cnamNo: 'CNAM-88120-X',
        allergies: ['Aucune signalée'],
        antecedents: ['Bilan de santé régulier'],
        labReports: [{ date: '01/08/2026', title: 'Bilan Sanguin & Glycémie', lab: 'Laboratoire Pasteur Tunis', status: 'VALIDE' }],
        consultationHistory: [{ date: '04/08/2026', motif: 'Consultation cabinet', doc: 'Dr. Selim Ben Ali', notes: 'Premier examen réalisé.' }]
      };

      document.getElementById('ehr-patient-name').textContent = patientName;
      document.getElementById('ehr-patient-meta').textContent = `${record.gender}, ${record.age} ans — Groupe Sanguin: ${record.blood} — Carnet ${record.cnamNo}`;
      document.getElementById('ehr-allergies').textContent = record.allergies.join(', ');
      document.getElementById('ehr-antecedents').textContent = record.antecedents.join(', ');

      const labContainer = document.getElementById('ehr-lab-reports-list');
      if (labContainer) {
        labContainer.innerHTML = (record.labReports || []).map(l => `
          <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span class="font-extrabold text-slate-900 block">🧪 ${l.title}</span>
              <span class="text-[11px] text-slate-500">${l.lab} (${l.date})</span>
            </div>
            <button onclick="alert('📄 PDF du Bilan Médical chargé depuis le Coffre-fort S3 Sécurisé INPDP')" class="bg-teal-50 text-teal-700 font-bold px-2 py-1 rounded border border-teal-200 text-[10px]">
              Voir PDF 📄
            </button>
          </div>
        `).join('');
      }

      document.getElementById('ehr-history-list').innerHTML = record.consultationHistory.map(h => `
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div class="flex justify-between font-bold text-slate-800 mb-1">
            <span>${h.motif} (${h.doc})</span>
            <span class="text-slate-500">${h.date}</span>
          </div>
          <p class="text-slate-600">${h.notes}</p>
        </div>
      `).join('');

      modal.classList.remove('hidden');
    };

    window.closePatientEhrModal = function () {
      document.getElementById('patient-ehr-modal')?.classList.add('hidden');
    };

    window.openCnamFormModal = function (patientName, sheetNo) {
      const modal = document.getElementById('cnam-modal');
      if (!modal) return;

      document.getElementById('cnam-patient-name').textContent = patientName;
      document.getElementById('cnam-sheet-no').textContent = sheetNo || 'BS-99120';
      modal.classList.remove('hidden');
    };

    window.closeCnamModal = function () {
      document.getElementById('cnam-modal')?.classList.add('hidden');
    };

    window.openPrescriptionPrintModal = function () {
      const modal = document.getElementById('prescription-print-modal');
      if (!modal) return;

      const itemsList = document.getElementById('modal-prescription-items');
      if (itemsList) {
        itemsList.innerHTML = state.prescriptionItems.map((item, idx) => `
          <div class="mb-3 text-xs">
            <p class="font-extrabold text-slate-900">${idx + 1}. ${item.drug}</p>
            <p class="text-slate-600 pl-4">• ${item.posology} (Durée: ${item.duration})</p>
          </div>
        `).join('');
      }

      modal.classList.remove('hidden');
    };

    window.closePrescriptionPrintModal = function () {
      document.getElementById('prescription-print-modal')?.classList.add('hidden');
    };

    window.openVideoRoomModal = function (docName) {
      const modal = document.getElementById('video-call-modal');
      if (!modal) return;
      document.getElementById('video-doc-title').textContent = docName || 'Dr. Selim Ben Ali';
      modal.classList.remove('hidden');
    };

    window.closeVideoRoomModal = function () {
      document.getElementById('video-call-modal')?.classList.add('hidden');
    };

    // Global Keyboard Escape Key & Backdrop Click Handler to close all active modals
    window.closeAllModals = function () {
      if (typeof window.closeAvailabilityModal === 'function') window.closeAvailabilityModal();
      if (typeof window.closeBookingModal === 'function') window.closeBookingModal();
      if (typeof window.closeDoctorBioModal === 'function') window.closeDoctorBioModal();
      if (typeof window.closeVideoRoomModal === 'function') window.closeVideoRoomModal();
      if (typeof window.closeCnamModal === 'function') window.closeCnamModal();
      if (typeof window.closePrescriptionPrintModal === 'function') window.closePrescriptionPrintModal();
      document.querySelectorAll('.modal-overlay, [id$="-modal"]').forEach(modal => {
        modal.classList.add('hidden');
      });
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        window.closeAllModals();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('modal-overlay')) {
        window.closeAllModals();
      }
    });
  }

  // Toast Notification Utility
  function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 ${type === 'success' ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-white border border-slate-700'
      }`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => { toast.classList.remove('translate-y-4', 'opacity-0'); }, 50);
    setTimeout(() => { toast.classList.add('translate-y-4', 'opacity-0'); setTimeout(() => toast.remove(), 300); }, duration);
  }
});

