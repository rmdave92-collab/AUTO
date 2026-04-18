const form = document.getElementById('slipForm');
const previewSection = document.getElementById('previewSection');
const downloadBtn = document.getElementById('downloadBtn');
const slipPreview = document.getElementById('slipPreview');

const fields = {
    sr: document.getElementById('viewSr'),
    holderName: document.getElementById('viewHolderName'),
    accountNo: document.getElementById('viewAccountNo'),
    utrNo: document.getElementById('viewUtrNo'),
    amount: document.getElementById('viewAmount'),
    charge: document.getElementById('viewCharge'),
    status: document.getElementById('viewStatus'),
};

/* FORMAT AMOUNT (100000 -> 100000.00) */
function formatAmount(value) {
    if (!value) return '';
    const numeric = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    if (isNaN(numeric)) return value;

    return numeric.toFixed(2);
}

/* STATUS CLASS */
function getStatusClass(status) {
    const s = status.toLowerCase();
    if (s === 'success') return 'status-success';
    if (s === 'pending') return 'status-pending';
    return 'status-process';
}

/* FORM SUBMIT */
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    // SET VALUES
    fields.sr.textContent = values.sr;
    fields.holderName.textContent = values.holderName.toUpperCase();
    fields.accountNo.textContent = values.accountNo;
    fields.utrNo.textContent = values.utrNo;
    fields.amount.textContent = formatAmount(values.amount);
    fields.charge.textContent = formatAmount(values.charge);

    // STATUS BADGE
    const statusValue = values.status || 'Pending';
    fields.status.innerHTML = `
        <span class="status-badge ${getStatusClass(statusValue)}">
            ${statusValue}
        </span>
    `;

    previewSection.classList.remove('hidden');

    // Smooth scroll (UX improve)
    previewSection.scrollIntoView({ behavior: 'smooth' });
});

/* JPG DOWNLOAD */
async function downloadJpg() {
    const canvas = await html2canvas(slipPreview, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const link = document.createElement('a');
    link.download = 'slip.jpg';
    link.href = imgData;
    link.click();
}

/* DOWNLOAD CLICK */
downloadBtn.addEventListener('click', async () => {
    try {
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas library not loaded');
        }
        
        const canvas = await html2canvas(slipPreview, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const link = document.createElement('a');
        link.download = 'slip.jpg';
        link.href = imgData;
        link.click();
    } catch (err) {
        console.error('Error:', err);
        alert('JPG generate nahi hua: ' + err.message);
    }
});