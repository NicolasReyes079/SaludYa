/* SaludYa – MVP  */

//  Estados 
const state = {
  currentUser: null,
  currentPage: null,
  selectedDate: null,
  selectedSlot: null,
};

/* Datos de muestra  */
const USERS_DB = [
  { id: 1, name: 'María González', email: 'maria@correo.com', password: '123456', role: 'patient', phone: '3001234567', status: 'active', initials: 'MG' },
  { id: 2, name: 'Hugo Luna',       email: 'hugo@correo.com',  password: '123456', role: 'patient', phone: '3109876543', status: 'active', initials: 'HL' },
  { id: 3, name: 'Dra. M.F. Fandiño', email: 'mfandino@saludya.com', password: 'med123', role: 'doctor', specialty: 'Medicina General', phone: '3201112233', status: 'active', initials: 'MF' },
  { id: 4, name: 'Dr. Sergio Quintero', email: 'squintero@saludya.com', password: 'med123', role: 'doctor', specialty: 'Especialista', phone: '3154445566', status: 'active', initials: 'SQ' },
  { id: 5, name: 'Admin Sistema',   email: 'admin@saludya.com', password: 'admin123', role: 'admin', phone: '3000000001', status: 'active', initials: 'AS' },
  { id: 6, name: 'Nicolas Luna',   email: 'Nicolas.luna@saludya.com', password: 'Luna123', role: 'admin', phone: '3000000002', status: 'active', initials: 'NL' },
  { id: 7, name: 'Nicolas Reyes',   email: 'Nicolas.reyes@saludya.com', password: 'Reyes123', role: 'admin', phone: '3000000003', status: 'active', initials: 'NR' },
];

function refreshIcons() {
  requestAnimationFrame(() => {
    lucide.createIcons();

    document.querySelectorAll('.apt-icon-green').forEach(el => {
      const svg = el.closest('svg');
      if (svg) {
        svg.setAttribute('stroke', '#155E43');
      }
    });
  });
}

// Almacenamiento en localStorage
function loadDB() {
  const stored = localStorage.getItem('sy_users');
  if (stored) { try { return JSON.parse(stored); } catch(e) {} }
  localStorage.setItem('sy_users', JSON.stringify(USERS_DB));
  return USERS_DB;
}
function saveUsers(users) { localStorage.setItem('sy_users', JSON.stringify(users)); }
function getUsers() { return loadDB(); }

// Citas
function getAppointments() {
  const stored = localStorage.getItem('sy_appointments');
  if (stored) { try { return JSON.parse(stored); } catch(e) {} }
  const today = new Date();
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
  const nextW = new Date(today); nextW.setDate(today.getDate()+5);
  const sample = [
    { id: 'apt-1', patientId: 1, doctorId: 3, date: fmt(tomorrow), time: '09:00', status: 'active' },
    { id: 'apt-2', patientId: 2, doctorId: 4, date: fmt(nextW), time: '10:30', status: 'active' },
    { id: 'apt-3', patientId: 1, doctorId: 4, date: fmt(today), time: '08:00', status: 'cancelled' },
  ];
  localStorage.setItem('sy_appointments', JSON.stringify(sample));
  return sample;
}
function saveAppointments(apts) { localStorage.setItem('sy_appointments', JSON.stringify(apts)); }

// Horarios médicos
function getSchedules() {
  const stored = localStorage.getItem('sy_schedules');
  if (stored) { try { return JSON.parse(stored); } catch(e) {} }
  const sample = {
    3: { Mon: ['08:00','09:00','10:00','11:00'], Tue: ['08:00','09:00'], Wed: ['08:00','09:00','10:00'], Thu: ['08:00','09:00'], Fri: ['08:00','09:00','10:00'], Sat: [], Sun: [] },
    4: { Mon: ['10:00','10:30','11:00'], Tue: ['10:00','10:30'], Wed: [], Thu: ['10:00','10:30','11:00'], Fri: ['10:00'], Sat: [], Sun: [] },
  };
  localStorage.setItem('sy_schedules', JSON.stringify(sample));
  return sample;
}
function saveSchedules(s) { localStorage.setItem('sy_schedules', JSON.stringify(s)); }

// Auth  
function tryLogin(email, password) {
  const users = getUsers();
  return users.find(u => u.email === email && u.password === password && u.status === 'active') || null;
}

function tryRegister({ name, lastName, email, phone, password }) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { ok: false, msg: 'Este correo ya está registrado.' };
  const initials = (name[0] + lastName[0]).toUpperCase();
  const newUser = { id: Date.now(), name: `${name} ${lastName}`, email, phone, password, role: 'patient', status: 'active', initials };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

// Enrutador
function navigate(pageId) {
  if (!state.currentUser && !['login','register'].includes(pageId)) { showAuth('login'); return; }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + pageId);
  if (pageEl) { pageEl.classList.add('active'); }

  const navItem = document.querySelector(`[data-nav="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  state.currentPage = pageId;

  // Iniciación de la pagina
  if (pageId === 'dashboard') initDashboard();
  if (pageId === 'appointments') initAppointments();
  if (pageId === 'schedule') initSchedule();
  if (pageId === 'book') initBookPage();
  if (pageId === 'users') initAdminUsers();
  if (pageId === 'profile') initProfile();
}

function showAuth(which) {
  document.getElementById('auth-view').style.display = 'grid';
  document.getElementById('app-view').style.display = 'none';
  document.getElementById('login-section').classList.toggle('hidden', which !== 'login');
  document.getElementById('register-section').classList.toggle('hidden', which !== 'register');
}

function enterApp() {
  document.getElementById('auth-view').style.display = 'none';
  document.getElementById('app-view').style.display = 'flex';
  buildSidebar();
  navigate('dashboard');
}

//  Sidebar
function buildSidebar() {
  const u = state.currentUser;
  document.getElementById('sb-user-name').textContent = u.name;
  document.getElementById('sb-user-role').textContent = capitalize(u.role === 'admin' ? 'Administrador' : u.role === 'doctor' ? 'Médico' : 'Paciente');
  document.getElementById('sb-user-initials').textContent = u.initials || u.name.slice(0,2).toUpperCase();

  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';

  const sections = getSidebarSections(u.role);
  sections.forEach(sec => {
    const secEl = document.createElement('div');
    secEl.className = 'nav-section';
    if (sec.label) {
      const lbl = document.createElement('div');
      lbl.className = 'nav-section-label';
      lbl.textContent = sec.label;
      secEl.appendChild(lbl);
    }
    sec.items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'nav-item';
      el.setAttribute('data-nav', item.id);
      el.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}`;
      el.addEventListener('click', () => navigate(item.id));
      secEl.appendChild(el);
    });
    nav.appendChild(secEl);
  });
  lucide.createIcons();
}

function getSidebarSections(role) {
  if (role === 'patient') return [
    { label: 'Control de Citas', items: [
      { id: 'book', icon: '<i data-lucide="calendar"></i>', label: 'Agendar cita' },
      { id: 'appointments', icon: '<i data-lucide="clock"></i>', label: 'Mis citas', badge: countActivePtApts() },
    ]},
    { label: 'Paciente', items: [
      { id: 'dashboard', icon: '<i data-lucide="home"></i>', label: 'Inicio' },
      { id: 'profile', icon: '<i data-lucide="user"></i>', label: 'Mis datos' },
    ]},
    { label: 'Sistema', items: [
      { id: 'help', icon: '<i data-lucide="info"></i>', label: 'Ayuda' },
    ]},
  ];
  if (role === 'doctor') return [
    { label: 'Agenda', items: [
      { id: 'dashboard', icon: '<i data-lucide="home"></i>', label: 'Inicio' },
      { id: 'schedule', icon: '<i data-lucide="calendar-check"></i>', label: 'Mi Agenda' },
      { id: 'appointments', icon: '<i data-lucide="clock"></i>', label: 'Citas del día' },
    ]},
    { label: 'Sistema', items: [
      { id: 'profile', icon: '<i data-lucide="user"></i>', label: 'Mi perfil' },
    ]},
  ];
  if (role === 'admin') return [
    { label: 'Administración', items: [
      { id: 'dashboard', icon: '<i data-lucide="home"></i>', label: 'Panel' },
      { id: 'users', icon: '<i data-lucide="users"></i>', label: 'Usuarios' },
      { id: 'appointments', icon: '<i data-lucide="calendar-days"></i>', label: 'Todas las citas' },
    ]},
    { label: 'Sistema', items: [
      { id: 'profile', icon: '<i data-lucide="user"></i>', label: 'Mi perfil' },
    ]},
  ];
  return [];
}

function countActivePtApts() {
  if (!state.currentUser) return 0;
  const apts = getAppointments().filter(a => a.patientId === state.currentUser.id && a.status === 'active');
  return apts.length || null;
}

// Dashboard
function initDashboard() {
  const u = state.currentUser;
  const role = u.role;

  const apts = getAppointments();
  const today = todayStr();
  const users = getUsers();

  if (role === 'patient') {
    const myApts = apts.filter(a => a.patientId === u.id && a.status === 'active');
    const upcoming = myApts.filter(a => a.date >= today).sort((a,b) => a.date.localeCompare(b.date));
    const nextApt = upcoming[0];
    const nextDoc = nextApt ? users.find(u2 => u2.id === nextApt.doctorId) : null;

    document.getElementById('dash-greeting').textContent = `¡Hola, ${u.name.split(' ')[0]}! `;
    document.getElementById('dash-subtitle').textContent = 'Bienvenido a tu portal de citas médicas.';

    document.getElementById('stat-next').innerHTML = nextApt
      ? `<div class="card-value" style="font-size:15px">${formatDate(nextApt.date)}</div>
         <div class="card-meta">${nextDoc?.name || '—'} · ${nextApt.time}</div>`
      : `<div class="card-meta">Sin citas próximas</div>`;

    document.getElementById('stat-total').innerHTML = `<div class="card-value">${myApts.length}</div><div class="card-meta">citas activas</div>`;
    document.getElementById('stat-hist').innerHTML = `<div class="card-value">${apts.filter(a=>a.patientId===u.id).length}</div><div class="card-meta">citas en total</div>`;

    const recentEl = document.getElementById('dash-recent');
    if (upcoming.length === 0) {
      recentEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No tienes citas próximas.</p></div>`;
      refreshIcons();
    } else {
      recentEl.innerHTML = upcoming.slice(0,3).map(a => {
        const doc = users.find(u2 => u2.id === a.doctorId);
        return aptCardHTML(a, doc, true);
      }).join('');
      recentEl.querySelectorAll('.btn-cancel-apt').forEach(btn => {
        btn.addEventListener('click', () => confirmCancel(btn.dataset.id));
      });
      refreshIcons();
    }
  }

  if (role === 'doctor') {
    const todayApts = apts.filter(a => a.doctorId === u.id && a.date === today && a.status === 'active');
    document.getElementById('dash-greeting').textContent = `¡Buenos días, ${u.name.split(' ')[0]}!`;
    document.getElementById('dash-subtitle').textContent = 'Resumen de tu agenda médica.';
    document.getElementById('stat-next').innerHTML = `<div class="card-value">${todayApts.length}</div><div class="card-meta">citas hoy</div>`;
    document.getElementById('stat-total').innerHTML = `<div class="card-value">${apts.filter(a=>a.doctorId===u.id&&a.status==='active').length}</div><div class="card-meta">citas activas</div>`;
    document.getElementById('stat-hist').innerHTML = `<div class="card-value">${apts.filter(a=>a.doctorId===u.id).length}</div><div class="card-meta">total historial</div>`;
    const recentEl = document.getElementById('dash-recent');
    if (todayApts.length === 0) {
      recentEl.innerHTML = `<div class="empty-state"><div class="empty-icon">🎉</div><p>Sin citas programadas para hoy.</p></div>`;
      refreshIcons();
    } else {
      recentEl.innerHTML = todayApts.map(a => {
        const pat = users.find(u2 => u2.id === a.patientId);
        return `<div class="appointment-card"><div class="apt-icon"><i data-lucide="user"></i></div><div class="apt-info"><div class="apt-doctor">${pat?.name||'Paciente'}</div><div class="apt-detail">${a.time} · ${a.date}</div></div><span class="badge badge-available">Activa</span></div>`;
      }).join('');
      refreshIcons();
    }
    
  }

  if (role === 'admin') {
    const pts = users.filter(u2=>u2.role==='patient');
    const docs = users.filter(u2=>u2.role==='doctor');
    document.getElementById('dash-greeting').textContent = 'Panel de Administración';
    document.getElementById('dash-subtitle').textContent = 'Vista general del sistema SaludYa.';
    document.getElementById('stat-next').innerHTML = `<div class="card-value">${pts.length}</div><div class="card-meta">pacientes registrados</div>`;
    document.getElementById('stat-total').innerHTML = `<div class="card-value">${docs.length}</div><div class="card-meta">médicos activos</div>`;
    document.getElementById('stat-hist').innerHTML = `<div class="card-value">${apts.length}</div><div class="card-meta">citas totales</div>`;
    document.getElementById('dash-recent').innerHTML = `<div class="alert alert-info">ℹ️ Accede a <strong>Usuarios</strong> para gestionar cuentas o a <strong>Todas las citas</strong> para ver el registro completo.</div>`;
  }
}

// Reservar cita 
function initBookPage() {
  const users = getUsers();
  const doctors = users.filter(u2 => u2.role === 'doctor');

  // Populate doctor selector
  const docSelect = document.getElementById('book-doctor-select');
  docSelect.innerHTML = '<option value="">— Selecciona un médico —</option>' +
    doctors.map(d => `<option value="${d.id}">${d.name} · ${d.specialty||'General'}</option>`).join('');

  docSelect.addEventListener('change', () => {
    renderCalendar();
    clearSlots();
  });

  state.selectedDate = null;
  state.selectedSlot = null;
  renderCalendar();
  clearSlots();
  document.getElementById('confirm-book-btn').disabled = true;
}


let calOffset = 0;
function renderCalendar() {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + calOffset, 1);
  const month = base.getMonth();
  const year = base.getFullYear();

  document.getElementById('cal-month-label').textContent =
    base.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const grid = document.getElementById('cal-days');
  grid.innerHTML = '';

  const todayDate = new Date();
  const todayStr2 = fmtDate(todayDate);

  const apts = getAppointments();
  const schedules = getSchedules();
  const docId = parseInt(document.getElementById('book-doctor-select')?.value);
  const docSchedule = docId ? schedules[docId] : null;

  // previous month padding
  for (let i = firstDay; i > 0; i--) {
    const d = prevDays - i + 1;
    const cell = document.createElement('div');
    cell.className = 'cal-day other-month';
    cell.textContent = d;
    grid.appendChild(cell);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateStr = fmtDate(dateObj);
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = d;

    if (dateStr === todayStr2) cell.classList.add('today');
    if (dateStr === state.selectedDate) cell.classList.add('selected');

    const isPast = dateStr < todayStr2;
    const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dateObj.getDay()];
    const hasDocSlots = docSchedule && docSchedule[dayName] && docSchedule[dayName].length > 0;

    if (isPast) {
      cell.classList.add('disabled');
    } else {
      if (hasDocSlots || !docId) {
        cell.classList.add('has-slots');
        cell.addEventListener('click', () => {
          state.selectedDate = dateStr;
          renderCalendar();
          renderSlots(dateStr, docId, apts, docSchedule);
          document.getElementById('confirm-book-btn').disabled = true;
          state.selectedSlot = null;
        });
      } else {
        cell.classList.add('disabled');
        cell.title = 'Sin disponibilidad';
      }
    }
    grid.appendChild(cell);
  }
}

function renderSlots(dateStr, docId, apts, docSchedule) {
  const dateObj = new Date(dateStr + 'T00:00');
  const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dateObj.getDay()];
  const slots = docSchedule ? (docSchedule[dayName] || []) : ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30'];

  const occupiedSlots = apts
    .filter(a => a.date === dateStr && (docId ? a.doctorId === docId : true) && a.status === 'active')
    .map(a => a.time);

  const container = document.getElementById('slots-container');
  document.getElementById('slots-title').textContent = `Horarios para el ${formatDate(dateStr)}`;
  document.getElementById('slots-section').classList.remove('hidden');

  if (slots.length === 0) {
    container.innerHTML = `<p class="text-muted text-sm">Sin horarios disponibles para este día.</p>`;
    refreshIcons();
    return;
  }

  container.innerHTML = slots.map(t => {
    const occupied = occupiedSlots.includes(t);
    return `<button class="slot-btn ${occupied ? 'occupied' : ''}" data-time="${t}" ${occupied ? 'disabled' : ''}>${t}</button>`;
  }).join('');
  refreshIcons();

  container.querySelectorAll('.slot-btn:not(.occupied)').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedSlot = btn.dataset.time;
      document.getElementById('confirm-book-btn').disabled = false;
    });
  });
}

function clearSlots() {
  document.getElementById('slots-section')?.classList.add('hidden');
  document.getElementById('confirm-book-btn').disabled = true;
}

/* ══ Confirm Booking Modal ════════════════════════════════════════ */
function openBookingModal() {
  const docId = parseInt(document.getElementById('book-doctor-select').value);
  if (!docId || !state.selectedDate || !state.selectedSlot) {
    toast('Selecciona médico, fecha y horario.', 'error'); return;
  }
  const doc = getUsers().find(u2 => u2.id === docId);

  document.getElementById('modal-doc').textContent = doc?.name || '—';
  document.getElementById('modal-specialty').textContent = doc?.specialty || 'General';
  document.getElementById('modal-date').textContent = formatDate(state.selectedDate);
  document.getElementById('modal-time').textContent = state.selectedSlot;
  openModal('booking-modal');
}

function confirmBooking() {
  const docId = parseInt(document.getElementById('book-doctor-select').value);
  const apts = getAppointments();

  // Double-booking check
  const conflict = apts.find(a => a.date === state.selectedDate && a.time === state.selectedSlot && a.doctorId === docId && a.status === 'active');
  if (conflict) { toast('Este horario ya fue reservado.', 'error'); closeModal('booking-modal'); return; }

  const newApt = {
    id: 'apt-' + Date.now(),
    patientId: state.currentUser.id,
    doctorId: docId,
    date: state.selectedDate,
    time: state.selectedSlot,
    status: 'active',
  };
  apts.push(newApt);
  saveAppointments(apts);
  closeModal('booking-modal');
  toast('¡Cita agendada exitosamente! 🎉', 'success');
  state.selectedDate = null; state.selectedSlot = null;
  setTimeout(() => navigate('appointments'), 800);
}

// Pagina de citas
let aptFilter = 'upcoming';
function initAppointments() {
  renderAppointments();
  document.querySelectorAll('#apt-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#apt-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      aptFilter = btn.dataset.filter;
      renderAppointments();
    });
  });
}

function renderAppointments() {
  const u = state.currentUser;
  const users = getUsers();
  const apts = getAppointments();
  const today = todayStr();

  let filtered = apts;
  if (u.role === 'patient') filtered = filtered.filter(a => a.patientId === u.id);
  if (u.role === 'doctor') filtered = filtered.filter(a => a.doctorId === u.id);

  if (aptFilter === 'upcoming') filtered = filtered.filter(a => a.date >= today && a.status === 'active').sort((a,b)=>a.date.localeCompare(b.date));
  else if (aptFilter === 'past')     filtered = filtered.filter(a => a.date < today || a.status !== 'active').sort((a,b)=>b.date.localeCompare(a.date));
  else if (aptFilter === 'cancelled') filtered = filtered.filter(a => a.status === 'cancelled');

  const container = document.getElementById('apt-list');
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon"><i data-lucide="mailbox"></i></div><p>No hay citas en esta categoría.</p></div>`;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(a => {
    const otherId = u.role === 'doctor' ? a.patientId : a.doctorId;
    const other = users.find(u2 => u2.id === otherId);
    return aptCardHTML(a, other, u.role !== 'doctor' && a.status === 'active' && a.date >= today);
  }).join('');
  setTimeout(() => lucide.createIcons(), 0);

  container.querySelectorAll('.btn-cancel-apt').forEach(btn => {
    btn.addEventListener('click', () => confirmCancel(btn.dataset.id));
  });
}

function aptCardHTML(a, person, showCancel) {
  const badgeCls = a.status === 'active' ? 'badge-available' : 'badge-cancelled';
  const badgeTxt = a.status === 'active' ? 'Activa' : 'Cancelada';

  return `<div class="appointment-card">
    <div class="apt-icon">
      <i data-lucide="calendar-days" class="apt-icon-green"></i>
    </div>

    <div class="apt-info">
      <div class="apt-doctor">${person?.name || '—'}</div>
      <div class="apt-detail">${formatDate(a.date)} · ${a.time}${person?.specialty ? ' · '+person.specialty : ''}</div>
    </div>

    <div class="apt-actions">
      <span class="badge ${badgeCls}">${badgeTxt}</span>
      ${showCancel ? `<button class="btn btn-danger btn-sm btn-cancel-apt" data-id="${a.id}">✕ Cancelar</button>` : ''}
    </div>
  </div>`;
}

function doCancelAppointment() {
  const aptId = document.getElementById('cancel-apt-id').value;
  const apts = getAppointments();
  const idx = apts.findIndex(a => a.id === aptId);
  if (idx !== -1) { apts[idx].status = 'cancelled'; saveAppointments(apts); }
  closeModal('cancel-modal');
  toast('Cita cancelada correctamente.', 'success');
  renderAppointments();
  buildSidebar();
}

// Horario médico
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_LABELS = { Mon:'Lunes',Tue:'Martes',Wed:'Miércoles',Thu:'Jueves',Fri:'Viernes',Sat:'Sábado',Sun:'Domingo' };

function initSchedule() {
  renderScheduleGrid();
  document.getElementById('save-schedule-btn').addEventListener('click', () => {
    const schedules = getSchedules();
    saveSchedules(schedules);
    toast('Horario guardado correctamente ✓', 'success');
  });
}

function renderScheduleGrid() {
  const u = state.currentUser;
  const schedules = getSchedules();
  const mySchedule = schedules[u.id] || {};
  DAYS.forEach(d => { if (!mySchedule[d]) mySchedule[d] = []; });
  schedules[u.id] = mySchedule;

  const grid = document.getElementById('schedule-grid');
  grid.innerHTML = DAYS.map(day => `
    <div class="day-column">
      <div class="day-header">${DAY_LABELS[day]}</div>
      <div class="day-slots" id="slots-${day}">
        ${mySchedule[day].map(t => slotChipHTML(day, t)).join('')}
      </div>
      <button class="add-slot-btn" data-day="${day}">+ Agregar</button>
    </div>
  `).join('');

  grid.querySelectorAll('.add-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => openAddSlotModal(btn.dataset.day));
  });
  attachRemoveSlot();
}

function slotChipHTML(day, time) {
  return `<div class="schedule-slot"><span>${time}</span><button class="remove-slot" data-day="${day}" data-time="${time}">✕</button></div>`;
}

function attachRemoveSlot() {
  document.querySelectorAll('.remove-slot').forEach(btn => {
    btn.addEventListener('click', () => {
      const { day, time } = btn.dataset;
      const schedules = getSchedules();
      const u = state.currentUser;
      schedules[u.id][day] = schedules[u.id][day].filter(t => t !== time);
      saveSchedules(schedules);
      renderScheduleGrid();
    });
  });
}

function openAddSlotModal(day) {
  document.getElementById('add-slot-day').value = day;
  document.getElementById('add-slot-day-label').textContent = DAY_LABELS[day];
  document.getElementById('slot-time-input').value = '09:00';
  openModal('add-slot-modal');
}

function doAddSlot() {
  const day = document.getElementById('add-slot-day').value;
  const time = document.getElementById('slot-time-input').value;
  if (!time) return;
  const schedules = getSchedules();
  const u = state.currentUser;
  if (!schedules[u.id]) schedules[u.id] = {};
  if (!schedules[u.id][day]) schedules[u.id][day] = [];
  if (!schedules[u.id][day].includes(time)) {
    schedules[u.id][day].push(time);
    schedules[u.id][day].sort();
  }
  saveSchedules(schedules);
  closeModal('add-slot-modal');
  renderScheduleGrid();
  toast(`Horario ${time} añadido para ${DAY_LABELS[day]}`, 'success');
}

// Admin usuarios
function initAdminUsers() {
  renderUsersTable('');
  document.getElementById('user-search').addEventListener('input', e => renderUsersTable(e.target.value));
}

function renderUsersTable(query) {
  const users = getUsers().filter(u2 => !query || u2.name.toLowerCase().includes(query.toLowerCase()) || u2.email.toLowerCase().includes(query.toLowerCase()));
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = users.map(u2 => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:10px"><div class="user-avatar" style="width:32px;height:32px;font-size:12px">${u2.initials||u2.name.slice(0,2).toUpperCase()}</div><div><div style="font-weight:500">${u2.name}</div><div style="font-size:12px;color:var(--neutral)">${u2.email}</div></div></div></td>
      <td>${capitalize(u2.role)}</td>
      <td>${u2.phone||'—'}</td>
      <td><span class="badge ${u2.status==='active'?'badge-available':'badge-cancelled'}">${u2.status==='active'?'Activo':'Bloqueado'}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-secondary toggle-status-btn" data-id="${u2.id}">${u2.status==='active'?'Bloquear':'Activar'}</button>
          ${u2.id !== state.currentUser.id ? `<button class="btn btn-sm btn-danger delete-user-btn" data-id="${u2.id}">Eliminar</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const users2 = getUsers();
      const idx = users2.findIndex(u2 => u2.id == btn.dataset.id);
      if (idx !== -1) { users2[idx].status = users2[idx].status === 'active' ? 'blocked' : 'active'; saveUsers(users2); }
      renderUsersTable(document.getElementById('user-search').value);
      toast('Estado de usuario actualizado.', 'success');
    });
  });

  tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('¿Eliminar este usuario?')) return;
      const users2 = getUsers().filter(u2 => u2.id != btn.dataset.id);
      saveUsers(users2);
      renderUsersTable(document.getElementById('user-search').value);
      toast('Usuario eliminado.', 'success');
    });
  });
}

// Perfiles 
function initProfile() {
  const u = state.currentUser;
  document.getElementById('profile-name').value = u.name;
  document.getElementById('profile-email').value = u.email;
  document.getElementById('profile-phone').value = u.phone || '';
  document.getElementById('profile-role').value = capitalize(u.role === 'admin' ? 'Administrador' : u.role === 'doctor' ? 'Médico' : 'Paciente');
  document.getElementById('profile-initials').textContent = u.initials || u.name.slice(0,2).toUpperCase();
}

// Modals 
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Toast 
function toast(msg, type='info') {
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]||'ℹ'}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// Helpers 
function todayStr() { return fmtDate(new Date()); }
function fmtDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function formatDate(str) {
  if (!str) return '—';
  const [y,m,d] = str.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${months[parseInt(m)-1]}. ${y}`;
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

// Fortaleza de contraseñas 
function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

// DOM js 
document.addEventListener('DOMContentLoaded', () => {
  // ── Login Form ──────────────────────────────────────────────────
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    const user = tryLogin(email, password);
    if (!user) {
      errEl.classList.remove('hidden');
      document.getElementById('login-email').classList.add('error');
      document.getElementById('login-password').classList.add('error');
      return;
    }
    errEl.classList.add('hidden');
    state.currentUser = user;
    enterApp();
  });

  document.getElementById('login-email').addEventListener('input', () => {
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('login-email').classList.remove('error');
    document.getElementById('login-password').classList.remove('error');
  });

  // Formulario de registro 
  document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const lastName = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    const errEl = document.getElementById('reg-error');
    if (password !== confirm) { errEl.textContent = 'Las contraseñas no coinciden.'; errEl.classList.remove('hidden'); return; }
    if (password.length < 6) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; errEl.classList.remove('hidden'); return; }

    const result = tryRegister({ name, lastName, email, phone, password });
    if (!result.ok) { errEl.textContent = result.msg; errEl.classList.remove('hidden'); return; }

    errEl.classList.add('hidden');
    toast('¡Cuenta creada! Ahora inicia sesión.', 'success');
    showAuth('login');
    document.getElementById('login-email').value = email;
  });

  // Medidor de contraseña
  document.getElementById('reg-password')?.addEventListener('input', e => {
    const score = calcStrength(e.target.value);
    const fill = document.getElementById('strength-fill');
    const colors = ['#dc2626','#d97706','#d97706','#16a34a','#16a34a'];
    if (fill) { fill.style.width = (score * 25) + '%'; fill.style.background = colors[score]; }
  });

  // Mostrar - ocultar pass
document.querySelectorAll('.password-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    const isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';

    btn.innerHTML = isHidden
      ? '<i data-lucide="eye-off"></i>'
      : '<i data-lucide="eye"></i>';

    refreshIcons();
  });
});

  // Enlaces de navegación autenticacion
  document.getElementById('go-register').addEventListener('click', (e) => {
    e.preventDefault();
    showAuth('register');
  });
  document.getElementById('go-login').addEventListener('click', (e) => {
    e.preventDefault();
    showAuth('login');
  });

  // Cerrar sesión
  document.getElementById('logout-btn').addEventListener('click', () => {
    state.currentUser = null;
    showAuth('login');
    document.getElementById('login-form').reset();
  });

  // Paginación del Calendario
  document.getElementById('cal-prev')?.addEventListener('click', () => { 
    calOffset--; 
    renderCalendar(); 
    clearSlots(); 
    state.selectedDate = null; 
  });
  
  document.getElementById('cal-next')?.addEventListener('click', () => { 
    calOffset++; 
    renderCalendar(); 
    clearSlots(); 
    state.selectedDate = null; 
  });

  // Botón Confirmar Reserva
  document.getElementById('confirm-book-btn')?.addEventListener('click', openBookingModal);

  // Botones de Ventanas Modales
  document.getElementById('do-confirm-book')?.addEventListener('click', confirmBooking);
  document.getElementById('do-cancel-apt')?.addEventListener('click', doCancelAppointment);
  document.getElementById('do-add-slot')?.addEventListener('click', doAddSlot);

  // Cerrar modales clic en superposición
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });

  // Botones para cerrar modales
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.remove('open'));
  });

  // Guardar perfil
  document.getElementById('save-profile-btn')?.addEventListener('click', () => {
    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const users = getUsers();
    const idx = users.findIndex(u2 => u2.id === state.currentUser.id);
    if (idx !== -1) {
      users[idx].name = name; users[idx].phone = phone;
      saveUsers(users);
      state.currentUser = users[idx];
      buildSidebar();
      toast('Perfil actualizado correctamente.', 'success');
    }
  });

  // Navegación pagina de ayuda
  document.getElementById('nav-help')?.addEventListener('click', () => navigate('help'));

  // Inicio: mostrar login
  showAuth('login');
});
