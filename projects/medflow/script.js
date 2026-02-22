let currentMeds = [];
let prescriptions = JSON.parse(localStorage.getItem('medflow_db')) || [];

function switchView(view) {
    const docPanel = document.getElementById('doctor-panel');
    const pharmPanel = document.getElementById('pharmacy-panel');
    const docBtn = document.getElementById('doc-view-btn');
    const pharmBtn = document.getElementById('pharm-view-btn');

    if (view === 'doctor') {
        docPanel.classList.remove('hidden');
        pharmPanel.classList.add('hidden');
        docBtn.classList.add('active');
        pharmBtn.classList.remove('active');
    } else {
        docPanel.classList.add('hidden');
        pharmPanel.classList.remove('hidden');
        docBtn.classList.remove('active');
        pharmBtn.classList.add('active');
        renderPharmacyOrders();
        updateBadge(0);
    }
}

function toggleCustomInput() {
    const isCustom = document.getElementById('custom-check').checked;
    const dropdown = document.getElementById('med-select');
    const customInput = document.getElementById('custom-med-name');

    if (isCustom) {
        dropdown.classList.add('hidden');
        customInput.classList.remove('hidden');
    } else {
        dropdown.classList.remove('hidden');
        customInput.classList.add('hidden');
    }
}

function addToList() {
    const isCustom = document.getElementById('custom-check').checked;
    const medName = isCustom ? document.getElementById('custom-med-name').value : document.getElementById('med-select').value;
    const dose = document.getElementById('med-dose').value;

    if (!medName || !dose) return alert("Enter medicine name and dose!");

    currentMeds.push({ med: medName, dose: dose });
    renderDoctorList();

    // Reset fields
    document.getElementById('custom-med-name').value = "";
    document.getElementById('med-dose').value = "";
    document.getElementById('med-select').selectedIndex = 0;
}

function renderDoctorList() {
    const list = document.getElementById('current-list');
    list.innerHTML = currentMeds.map((m, i) => `
        <li>
            <span><strong>${m.med}</strong> <small>(${m.dose})</small></span>
            <i class="fas fa-trash-alt" style="color:#ef4444; cursor:pointer" onclick="removeMed(${i})"></i>
        </li>
    `).join('');
}

function removeMed(i) {
    currentMeds.splice(i, 1);
    renderDoctorList();
}

function generateToken() {
    const patientName = document.getElementById('p-name').value;
    if (!patientName || currentMeds.length === 0) return alert("Fill patient name and add medicines!");

    const token = Math.floor(1000 + Math.random() * 9000);
    const order = {
        token,
        patientName,
        medicines: [...currentMeds],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Ready'
    };

    prescriptions.unshift(order);
    localStorage.setItem('medflow_db', JSON.stringify(prescriptions));

    document.getElementById('token-number').innerText = `#${token}`;
    document.getElementById('token-modal').classList.remove('hidden');

    // Reset Doctor Screen
    currentMeds = [];
    document.getElementById('p-name').value = "";
    renderDoctorList();
    updateBadge(1);
}

function renderPharmacyOrders() {
    const container = document.getElementById('order-container');
    if (prescriptions.length === 0) {
        container.innerHTML = "<div style='text-align:center; padding:40px; opacity:0.5'>No orders found.</div>";
        return;
    }

    container.innerHTML = prescriptions.map(order => `
        <div class="order-card">
            <div style="display:flex; justify-content:space-between; align-items:center">
                <span class="status-tag">${order.status}</span>
                <small style="color:#94a3b8">${order.time}</small>
            </div>
            <h3 style="margin:10px 0 5px 0">#${order.token}</h3>
            <p style="font-weight:600; margin-bottom:10px">${order.patientName}</p>
            <div style="background:#f8fafc; padding:10px; border-radius:10px">
                <ul style="list-style:none; font-size:13px">
                    ${order.medicines.map(m => `<li>• ${m.med} <span style="color:var(--primary)">(${m.dose})</span></li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function updateBadge(n) {
    const badge = document.getElementById('notif-badge');
    if (n > 0) {
        badge.innerText = n;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function closeModal() {
    document.getElementById('token-modal').classList.add('hidden');
}