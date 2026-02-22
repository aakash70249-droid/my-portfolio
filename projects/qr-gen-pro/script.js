let qrcode = null;

// Initialize QR Code on load
window.onload = () => {
    qrcode = new QRCode(document.getElementById("qrcode-container"), {
        width: 160,
        height: 160,
        colorDark : "#0f172a",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    generateQR(); // Generate default
};

function generateQR() {
    const text = document.getElementById('qr-text').value || "https://github.com";
    const fg = document.getElementById('fg-color').value;
    const bg = document.getElementById('bg-color').value;

    // Clear previous QR and generate new with colors
    document.getElementById("qrcode-container").innerHTML = "";
    
    qrcode = new QRCode(document.getElementById("qrcode-container"), {
        text: text,
        width: 160,
        height: 160,
        colorDark : fg,
        colorLight : bg,
        correctLevel : QRCode.CorrectLevel.H
    });

    // Reset Animation
    const line = document.getElementById('scan-anim');
    line.style.animation = 'none';
    setTimeout(() => line.style.animation = 'scan 2s linear infinite', 10);
}

function downloadQR() {
    const img = document.querySelector('#qrcode-container img');
    if (!img) return alert("Generate QR first!");

    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'QR-Gen-Pro.png';
    link.click();
    
    saveToHistory(document.getElementById('qr-text').value);
}

function copyQR() {
    const text = document.getElementById('qr-text').value;
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
}

function saveToHistory(text) {
    if(!text) return;
    let history = JSON.parse(localStorage.getItem('qr_history')) || [];
    if(!history.includes(text)) {
        history.unshift(text);
        if(history.length > 5) history.pop();
        localStorage.setItem('qr_history', JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('qr_history')) || [];
    const container = document.getElementById('qr-history');
    container.innerHTML = history.map(item => `<span class="chip">${item}</span>`).join('');
}

renderHistory();