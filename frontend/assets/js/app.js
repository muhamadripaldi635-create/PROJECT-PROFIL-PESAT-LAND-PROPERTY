/**
 * Pesat Land Property - Frontend Application Logic
 * Integrates PHP REST API with dynamic fallback mock data
 */

const API_BASE_URL = '../backend/api';
const INITIAL_PROPERTY_LIMIT = 6;
const ADMIN_WHATSAPP_NUMBERS = [
  '6281952960471',
  '6289694268666',
  '628132313332',
  '6282114169417',
  '6281214933418',
  '6282129969599',
  '6285642208401',
  '6283879025319'
];
const ADMIN_EMAIL = 'muhamadripaldi635@gmail.com';

// Fallback Mock Data for Static Demo Preview
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Kavling Strategis Pesat Eco Green Park',
    description: 'Kavling siap bangun di kawasan perumahan bernuansa asri dan bebas banjir. Lokasi sangat dekat dengan gerbang tol dan pusat perbelanjaan. Cocok untuk hunian maupun investasi jangka panjang.',
    price: 350000000,
    location: 'Sentul, Bogor',
    property_type: 'Tanah',
    land_area: 120,
    building_area: 0,
    bedrooms: 0,
    bathrooms: 0,
    status: 'Tersedia',
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    title: 'Rumah Modern Minimalis Pesat Hills Cluster',
    description: 'Hunian 2 lantai berkonsep tropis modern. Dilengkapi smart home system, keamanan 24 jam, clubhouse, dan area hijau yang luas. Siap huni dengan garasi 2 mobil.',
    price: 1250000000,
    location: 'BSD City, Tangerang Selatan',
    property_type: 'Rumah',
    land_area: 90,
    building_area: 110,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Tersedia',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    title: 'Ruko Komersial 3 Lantai Pesat Boulevard',
    description: 'Ruko premium di jalan utama ramai pengunjung. Ideal untuk restoran, kantor cabang, bank, atau showroom. Parkir sangat luas dan keamanan 24 jam.',
    price: 2800000000,
    location: 'Cibubur, Depok',
    property_type: 'Ruko',
    land_area: 75,
    building_area: 210,
    bedrooms: 0,
    bathrooms: 3,
    status: 'Tersedia',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    title: 'Luxury Villa Pesat Mountain Resort',
    description: 'Villa mewah dengan pemandangan gunung spektakuler dan udara sejuk. Dilengkapi private pool, infinity garden, serta fasilitas resort bintang lima.',
    price: 3450000000,
    location: 'Puncak, Bogor',
    property_type: 'Villa',
    land_area: 500,
    building_area: 320,
    bedrooms: 4,
    bathrooms: 4,
    status: 'Tersedia',
    image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 5,
    title: 'Tanah Kavling Komersial Hook Pesat Grand City',
    description: 'Kavling sudut hook sangat potensial untuk pembangunan ruko atau gedung perkantoran 4 lantai. Akses jalan lebar 12 meter.',
    price: 850000000,
    location: 'Bandung Kota, Jawa Barat',
    property_type: 'Tanah',
    land_area: 250,
    building_area: 0,
    bedrooms: 0,
    bathrooms: 0,
    status: 'Tersedia',
    image_url: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 6,
    title: 'Rumah Asri Minimalis Type 45 Pesat Residence',
    description: 'Rumah tinggal nyaman 1 lantai tipe 45 dengan halaman depan dan belakang yang cukup luas. Cocok untuk keluarga muda.',
    price: 620000000,
    location: 'Cikarang, Bekasi',
    property_type: 'Rumah',
    land_area: 72,
    building_area: 45,
    bedrooms: 2,
    bathrooms: 1,
    status: 'Booking',
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80'
  }
];

// App State
let state = {
  properties: [],
  filteredProperties: [],
  searchQuery: '',
  usingApi: false,
  editingPropertyId: null
};

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  setupEventListeners();
  await loadProperties();
}

// Fetch properties from PHP backend with localStorage/mock fallback
async function loadProperties() {
  showLoader();
  try {
    const res = await fetch(`${API_BASE_URL}/properties/index.php`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        state.properties = json.data;
        state.usingApi = true;
        showToast('Terhubung ke API Backend Pesat Land');
        updateDbStatus(true);
      } else {
        throw new Error('Format response invalid');
      }
    } else {
      throw new Error('API server tidak merespons');
    }
  } catch (err) {
    console.warn('Backend API tidak dapat dijangkau. Menggunakan data simulasi lokal.', err.message);
    state.usingApi = false;
    updateDbStatus(false);
    
    // Load local storage or default mock data
    const localData = localStorage.getItem('pesat_properties');
    if (localData) {
      try {
        state.properties = JSON.parse(localData);
      } catch (e) {
        state.properties = [...MOCK_PROPERTIES];
      }
    } else {
      state.properties = [...MOCK_PROPERTIES];
      localStorage.setItem('pesat_properties', JSON.stringify(state.properties));
    }
  }

  applyFilters();
}

// Filter Logic
function applyFilters() {
  let result = [...state.properties];
  const hasSearchQuery = state.searchQuery.trim() !== '';

  // Filter Search Keyword
  if (hasSearchQuery) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.location.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  state.filteredProperties = hasSearchQuery ? result : result.slice(0, INITIAL_PROPERTY_LIMIT);
  renderPropertyGrid();
}

// Render Property Grid Cards
function renderPropertyGrid() {
  const gridContainer = document.getElementById('propertyGrid');

  if (!gridContainer) return;

  if (state.filteredProperties.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border);">
        <svg style="width: 64px; height: 64px; fill: var(--text-light); margin-bottom: 1rem;" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Tidak Ada Properti Ditemukan</h3>
        <p style="color: var(--text-muted);">Coba ubah kata kunci pencarian atau sesuaikan filter kriteria Anda.</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = state.filteredProperties.map(property => {
    const formattedPrice = formatRupiah(property.price);
    const statusClass = `status-${property.status.toLowerCase()}`;

    return `
      <div class="property-card">
        <div class="card-image-wrap">
          <img src="${escapeHtml(property.image_url)}" alt="${escapeHtml(property.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'" />
          <span class="card-badge-type">${escapeHtml(property.property_type)}</span>
          <span class="card-badge-status ${statusClass}">${escapeHtml(property.status)}</span>
        </div>
        <div class="card-content">
          <div class="card-price">${formattedPrice}</div>
          <h3 class="card-title">${escapeHtml(property.title)}</h3>
          <div class="card-location" style="display: none;">
            <svg style="width:16px;height:16px;fill:var(--accent)" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            ${escapeHtml(property.location)}
          </div>
          <div class="card-specs">
            <div class="spec-item">
              <strong>${property.land_area} m²</strong>
              <span>Luas Tanah</span>
            </div>
            <div class="spec-item">
              <strong>${property.building_area > 0 ? property.building_area + ' m²' : '-'}</strong>
              <span>Luas Bangunan</span>
            </div>
            <div class="spec-item">
              <strong>${property.bedrooms > 0 ? property.bedrooms + ' KT' : '-'}</strong>
              <span>Kamar Tidur</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-card-primary" onclick="openDetailModal(${property.id})">Detail Properti</button>
            <button class="btn-card-outline" onclick="openInquiryModal(${property.id})">Hubungi</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Modal Handlers
function openDetailModal(id) {
  const property = state.properties.find(p => Number(p.id) === Number(id));
  if (!property) return;

  const modalBody = document.getElementById('detailModalBody');
  modalBody.innerHTML = `
    <div style="border-radius: var(--radius-md); overflow: hidden; height: 260px; margin-bottom: 1.5rem;">
      <img src="${escapeHtml(property.image_url)}" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
      <div>
        <span class="card-badge-type" style="position: static; display: inline-block; margin-bottom: 0.5rem;">${escapeHtml(property.property_type)}</span>
        <h2 style="font-size: 1.6rem; color: var(--primary);">${escapeHtml(property.title)}</h2>
        <p style="display: none;">
          <svg style="width:16px;height:16px;fill:var(--accent)" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          ${escapeHtml(property.location)}
        </p>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent); font-family: 'Outfit';">${formatRupiah(property.price)}</div>
        <span class="card-badge-status status-${property.status.toLowerCase()}" style="position: static;">${escapeHtml(property.status)}</span>
      </div>
    </div>

    <div style="background: #f8fafc; padding: 1.25rem; border-radius: var(--radius-md); display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; border: 1px solid var(--border);">
      <div>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">LUAS TANAH</div>
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${property.land_area} m²</div>
      </div>
      <div>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">BANGUNAN</div>
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${property.building_area > 0 ? property.building_area + ' m²' : 'N/A'}</div>
      </div>
      <div>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">KAMAR TIDUR</div>
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${property.bedrooms > 0 ? property.bedrooms : 'N/A'}</div>
      </div>
      <div>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">KAMAR MANDI</div>
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${property.bathrooms > 0 ? property.bathrooms : 'N/A'}</div>
      </div>
    </div>

    <div>
      <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--primary);">Deskripsi Properti</h4>
      <p style="color: var(--text-muted); line-height: 1.6;">${escapeHtml(property.description)}</p>
    </div>
  `;

  showModal('detailModal');
}

// Hubungi dari setiap kartu perumahan / properti
function openPropertyContact(id) {
  const property = state.properties.find(p => Number(p.id) === Number(id));
  if (!property) return;

  const contactMessage = [
    'Halo Sales Executive Pesat Land Property,',
    '',
    `Saya tertarik dengan unit properti / perumahan berikut:`,
    `🏠 *Properti:* ${property.title}`,
    `📍 *Lokasi:* ${property.location}`,
    `💰 *Harga:* ${formatRupiah(property.price)}`,
    `📐 *Spesifikasi:* LT ${property.land_area} m² / LB ${property.building_area > 0 ? property.building_area + ' m²' : '-'} | ${property.bedrooms > 0 ? property.bedrooms + ' KT' : '-'}`,
    '',
    'Mohon informasi ketersediaan unit dan jadwal survey ke lokasi. Terima kasih.'
  ].join('\n');

  const adminNumber = getAdminWhatsapp(property.id);
  window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(contactMessage)}`, '_blank', 'noopener,noreferrer');
}

// Backward-compatible alias for property cards
function openInquiryModal(id) {
  openPropertyContact(id);
}

// Hubungi Sales Executive (Form Kehadiran & Konsultasi)
function openSalesExecutiveModal() {
  const form = document.getElementById('salesExecutiveForm');
  if (form) form.reset();
  showModal('salesExecutiveModal');
}

function getAdminWhatsapp(propertyId) {
  const index = Math.abs(Number(propertyId) || 0) % ADMIN_WHATSAPP_NUMBERS.length;
  return ADMIN_WHATSAPP_NUMBERS[index];
}

function openAddPropertyModal() {
  state.editingPropertyId = null;
  document.getElementById('propertyFormTitle').textContent = 'Tambah Properti Baru';
  document.getElementById('propertyForm').reset();
  showModal('propertyFormModal');
}

function openEditPropertyModal(id) {
  const property = state.properties.find(p => Number(p.id) === Number(id));
  if (!property) return;

  state.editingPropertyId = property.id;
  document.getElementById('propertyFormTitle').textContent = 'Edit Data Properti';
  
  document.getElementById('propTitle').value = property.title;
  document.getElementById('propPrice').value = property.price;
  document.getElementById('propLocation').value = property.location;
  document.getElementById('propType').value = property.property_type;
  document.getElementById('propLandArea').value = property.land_area;
  document.getElementById('propBuildingArea').value = property.building_area;
  document.getElementById('propBedrooms').value = property.bedrooms;
  document.getElementById('propBathrooms').value = property.bathrooms;
  document.getElementById('propStatus').value = property.status;
  document.getElementById('propImageUrl').value = property.image_url;
  document.getElementById('propDescription').value = property.description;

  showModal('propertyFormModal');
}

// Modal UI Control
function showModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Form Submissions
async function handleInquirySubmit(e) {
  e.preventDefault();
  const propertyId = document.getElementById('inquiryPropertyId').value;
  const property = state.properties.find(p => Number(p.id) === Number(propertyId));
  const name = document.getElementById('inquiryName').value;
  const email = document.getElementById('inquiryEmail').value;
  const phone = document.getElementById('inquiryPhone').value;
  const message = document.getElementById('inquiryMessage').value;

  const payload = { property_id: propertyId, customer_name: name, email, phone, message };
  const propertyTitle = property ? property.title : 'Properti Pesat Land';
  const contactMessage = [
    'Halo Admin Pesat Land Property,',
    '',
    `Saya ingin konsultasi/survey untuk: ${propertyTitle}`,
    `Nama: ${name}`,
    `WhatsApp/HP: ${phone}`,
    `Email: ${email || '-'}`,
    `Pesan: ${message}`
  ].join('\n');
  const whatsappUrl = `https://wa.me/${getAdminWhatsapp(propertyId)}?text=${encodeURIComponent(contactMessage)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ADMIN_EMAIL)}&su=${encodeURIComponent(`Konsultasi Properti - ${propertyTitle}`)}&body=${encodeURIComponent(contactMessage)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  window.open(gmailUrl, '_blank', 'noopener,noreferrer');

  if (state.usingApi) {
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries/index.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      showToast('Gagal mengirim ke API: ' + err.message, 'error');
    }
  } else {
    showToast('Terima kasih! Pesan Anda telah terkirim.');
  }

  closeModal('inquiryModal');
  document.getElementById('inquiryForm').reset();
}

async function handlePropertySubmit(e) {
  e.preventDefault();

  const payload = {
    title: document.getElementById('propTitle').value,
    price: parseFloat(document.getElementById('propPrice').value),
    location: document.getElementById('propLocation').value,
    property_type: document.getElementById('propType').value,
    land_area: parseInt(document.getElementById('propLandArea').value) || 0,
    building_area: parseInt(document.getElementById('propBuildingArea').value) || 0,
    bedrooms: parseInt(document.getElementById('propBedrooms').value) || 0,
    bathrooms: parseInt(document.getElementById('propBathrooms').value) || 0,
    status: document.getElementById('propStatus').value,
    image_url: document.getElementById('propImageUrl').value || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    description: document.getElementById('propDescription').value
  };

  if (state.editingPropertyId) {
    // Edit existing
    payload.id = state.editingPropertyId;
    if (state.usingApi) {
      try {
        const res = await fetch(`${API_BASE_URL}/properties/update.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') showToast('Properti berhasil diperbarui!');
      } catch (err) {
        showToast('Gagal memperbarui properti via API', 'error');
      }
    } else {
      const idx = state.properties.findIndex(p => p.id === state.editingPropertyId);
      if (idx !== -1) {
        state.properties[idx] = { ...state.properties[idx], ...payload };
        saveLocalData();
        showToast('Properti berhasil diperbarui!');
      }
    }
  } else {
    // Add new
    if (state.usingApi) {
      try {
        const res = await fetch(`${API_BASE_URL}/properties/index.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') showToast('Properti baru berhasil ditambahkan!');
      } catch (err) {
        showToast('Gagal menambahkan properti via API', 'error');
      }
    } else {
      const newProp = { id: Date.now(), ...payload };
      state.properties.unshift(newProp);
      saveLocalData();
      showToast('Properti baru berhasil ditambahkan!');
    }
  }

  closeModal('propertyFormModal');
  await loadProperties();
}

function saveLocalData() {
  localStorage.setItem('pesat_properties', JSON.stringify(state.properties));
}

async function handleSalesExecutiveSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('salesExecName').value.trim();
  const phone = document.getElementById('salesExecPhone').value.trim();
  const email = document.getElementById('salesExecEmail').value.trim();
  const purpose = document.getElementById('salesExecPurpose').value;
  const scheduleInput = document.getElementById('salesExecSchedule').value;
  const message = document.getElementById('salesExecMessage').value.trim();

  let formattedSchedule = 'Fleksibel / Sesuai Kesepakatan';
  if (scheduleInput) {
    const dateObj = new Date(scheduleInput);
    if (!isNaN(dateObj.getTime())) {
      formattedSchedule = dateObj.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    }
  }

  const contactMessage = [
    'Halo Sales Executive Pesat Land Property,',
    '',
    'Saya ingin mengajukan permohonan kehadiran & konsultasi:',
    `👤 *Nama Lengkap:* ${name}`,
    `📱 *Kontak / WhatsApp:* ${phone}`,
    `📧 *Email:* ${email || '-'}`,
    `📌 *Keperluan:* ${purpose}`,
    `📅 *Rencana Waktu Kehadiran:* ${formattedSchedule}`,
    '',
    `💬 *Pesan / Catatan:*`,
    `${message}`
  ].join('\n');

  const adminNumber = ADMIN_WHATSAPP_NUMBERS[0] || '6281952960471';
  const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(contactMessage)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  showToast('Formulir kehadiran telah dikirim ke Sales Executive!');
  closeModal('salesExecutiveModal');
  document.getElementById('salesExecutiveForm').reset();
}

// Mobile Navigation Drawer Toggle
function toggleMobileNav() {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  if (navLinks && navToggle) {
    navLinks.classList.toggle('mobile-active');
    navToggle.classList.toggle('active');
  }
}

function closeMobileNav() {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  if (navLinks) navLinks.classList.remove('mobile-active');
  if (navToggle) navToggle.classList.remove('active');
}

// Event Listeners Setup
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();
    });
  }

  // Forms
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) inquiryForm.addEventListener('submit', handleInquirySubmit);

  const salesExecForm = document.getElementById('salesExecutiveForm');
  if (salesExecForm) salesExecForm.addEventListener('submit', handleSalesExecutiveSubmit);

  const propertyForm = document.getElementById('propertyForm');
  if (propertyForm) propertyForm.addEventListener('submit', handlePropertySubmit);

  // Close mobile nav on click outside
  document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    if (navLinks && navToggle && navLinks.classList.contains('mobile-active')) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileNav();
      }
    }
  });
}

function updateDbStatus(isConnected) {
  const badge = document.getElementById('dbStatusBadge');
  if (!badge) return;
  
  if (isConnected) {
    badge.className = 'db-status-badge connected';
    badge.innerHTML = '<span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%; margin-right:3px"></span> Database Aktif';
  } else {
    badge.className = 'db-status-badge offline';
    badge.innerHTML = '<span style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%; margin-right:3px"></span> Offline / Simulasi';
  }
}

// Utilities
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg style="width:20px;height:20px;fill:currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function showLoader() {
  const gridContainer = document.getElementById('propertyGrid');
  if (gridContainer) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="margin-top: 1rem; color: var(--text-muted); font-weight: 500;">Memuat Data Properti Pesat Land...</p>
      </div>
      <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
    `;
  }
}
