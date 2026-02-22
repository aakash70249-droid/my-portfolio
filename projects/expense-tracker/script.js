let currentUser = null;
let isLoginMode = true;
const DAILY_LIMIT = 2000; // Warning if daily spending > 2000

// Auth Functions
function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Login" : "Register";
    document.getElementById('auth-toggle').innerText = isLoginMode ? "New user? Create an account." : "Have an account? Login.";
}

function handleAuth() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if(!user || !pass) return alert("Please fill all fields");

    if(!isLoginMode) {
        if(localStorage.getItem(user)) return alert("User already exists!");
        localStorage.setItem(user, JSON.stringify({pass, expenses: []}));
        alert("Registration Successful!");
        toggleAuth();
    } else {
        const stored = JSON.parse(localStorage.getItem(user));
        if(stored && stored.pass === pass) {
            currentUser = user;
            document.getElementById('auth-container').classList.add('hidden');
            document.getElementById('main-dashboard').classList.remove('hidden');
            document.getElementById('user-display').innerText = currentUser;
            updateUI();
        } else {
            alert("Invalid credentials");
        }
    }
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function checkCustomCategory() {
    const cat = document.getElementById('category').value;
    document.getElementById('custom-cat').classList.toggle('hidden', cat !== 'Custom');
}

// Main Logic
function saveExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const editId = document.getElementById('edit-id').value;
    let category = document.getElementById('category').value;
    if(category === 'Custom') category = document.getElementById('custom-cat').value;

    if(!amount || !category) return alert("Fill all details");

    let userData = JSON.parse(localStorage.getItem(currentUser));

    if(editId) {
        const index = userData.expenses.findIndex(e => e.id == editId);
        userData.expenses[index].amount = amount;
        userData.expenses[index].category = category;
    } else {
        const now = new Date();
        userData.expenses.push({
            id: Date.now(),
            amount,
            category,
            date: now.toLocaleDateString('en-IN'),
            time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        });
    }

    localStorage.setItem(currentUser, JSON.stringify(userData));
    alert("Success!");
    cancelEdit();
    updateUI();
}

function updateUI() {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    const list = document.getElementById('full-history-list');
    const balanceText = document.getElementById('total-balance');
    const warningText = document.getElementById('warning-msg');
    
    list.innerHTML = "";
    let total = 0;
    const today = new Date().toLocaleDateString('en-IN');
    let dailyTotal = 0;

    userData.expenses.reverse().forEach(e => {
        total += e.amount;
        if(e.date === today) dailyTotal += e.amount;

        list.innerHTML += `
            <li class="expense-item">
                <div class="info">
                    <strong>${e.category}</strong>
                    <span class="timestamp">${e.date} | ${e.time}</span>
                    <span class="amt">₹${e.amount}</span>
                </div>
                <div class="actions">
                    <button class="edit-btn" onclick="editExpense(${e.id})"><i class="fas fa-edit"></i></button>
                    <button class="del-btn" onclick="deleteExpense(${e.id})"><i class="fas fa-trash"></i></button>
                </div>
            </li>`;
    });

    balanceText.innerText = `₹${total.toFixed(2)}`;
    warningText.innerText = dailyTotal > DAILY_LIMIT ? `⚠️ High Spending Today: ₹${dailyTotal}` : "";
}

function editExpense(id) {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    const exp = userData.expenses.find(e => e.id === id);
    showSection('add-section');
    document.getElementById('form-title').innerText = "Update Expense";
    document.getElementById('amount').value = exp.amount;
    document.getElementById('edit-id').value = id;
    document.getElementById('save-btn').innerText = "Update Now";
    document.getElementById('cancel-btn').classList.remove('hidden');
}

function cancelEdit() {
    document.getElementById('edit-id').value = "";
    document.getElementById('save-btn').innerText = "Save Expense";
    document.getElementById('amount').value = "";
    document.getElementById('cancel-btn').classList.add('hidden');
    showSection('view-all-section');
}

function deleteExpense(id) {
    if(confirm("Delete this record?")) {
        let userData = JSON.parse(localStorage.getItem(currentUser));
        userData.expenses = userData.expenses.filter(e => e.id !== id);
        localStorage.setItem(currentUser, JSON.stringify(userData));
        updateUI();
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userData = JSON.parse(localStorage.getItem(currentUser));
    const total = userData.expenses.reduce((s, e) => s + e.amount, 0);

    doc.text(`Expense Report: ${currentUser}`, 14, 15);
    doc.autoTable({
        head: [['Date', 'Time', 'Category', 'Amount']],
        body: userData.expenses.map(e => [e.date, e.time, e.category, `Rs. ${e.amount}`]),
        startY: 25
    });
    doc.text(`Total Spending: Rs. ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`${currentUser}_Expenses.pdf`);
}

function logout() { location.reload(); }