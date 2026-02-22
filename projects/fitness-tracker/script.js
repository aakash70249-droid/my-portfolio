let gender = 'male';
let history = JSON.parse(localStorage.getItem('fitnessLogs')) || [];

document.getElementById('today-date').innerText = new Date().toDateString();

function setGender(g) {
    gender = g;
    document.querySelectorAll('.tgl-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${g}`).classList.add('active');
}

function calculateAll() {
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (!age || !weight || !height) return alert("Please fill all details!");

    // 1. BMI Calculation
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    
    // 2. BMR (Mifflin-St Jeor Equation)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    // 3. Ideal Weight (Miller Formula)
    const ideal = 50 + 2.3 * ((height / 2.54) - 60);

    displayResults(bmi, bmr, ideal, weight);
    saveLog(bmi, weight);
}

function displayResults(bmi, bmr, ideal, weight) {
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('bmi-val').innerText = bmi.toFixed(1);
    document.getElementById('bmr-val').innerText = Math.round(bmr) + " kcal";
    document.getElementById('ideal-val').innerText = Math.round(ideal) + " kg";

    // Gauge Animation
    // Rotates arrow from -90deg (Underweight) to +90deg (Obese)
    let rotation = (bmi * 4.5) - 135; 
    if (rotation > 90) rotation = 90;
    if (rotation < -90) rotation = -90;
    document.getElementById('arrow').style.transform = `translateX(-50%) rotate(${rotation}deg)`;

    // Status Text
    let status = "Normal";
    if (bmi < 18.5) status = "Underweight";
    else if (bmi > 25 && bmi < 29.9) status = "Overweight";
    else if (bmi > 30) status = "Obese";
    document.getElementById('health-status').innerText = status;
}

function saveLog(bmi, weight) {
    const log = {
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        bmi: bmi.toFixed(1),
        weight: weight
    };
    history.unshift(log); // Add to top
    if (history.length > 5) history.pop(); // Keep last 5
    localStorage.setItem('fitnessLogs', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div>
                <strong>${item.date}</strong><br>
                <small>${item.weight} kg</small>
            </div>
            <div style="text-align:right">
                <span style="color:var(--accent); font-weight:600">BMI: ${item.bmi}</span>
            </div>
        </div>
    `).join('');
}

renderHistory(); // Load on start