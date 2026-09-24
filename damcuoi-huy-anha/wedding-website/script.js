// Khởi tạo hiệu ứng cuộn trang AOS
AOS.init({
    once: true, // Hiệu ứng chỉ chạy 1 lần khi cuộn xuống
    offset: 100,
});

// CẤU HÌNH API
const SANITY_PROJECT_ID = 'q601itdr'; 
const SANITY_DATASET = 'production';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5m-Fpkz1c13mSSOc3VgntnThuK2AZzPaEDd2-JPr2gPvqhU1by2b7tI6ev2GU0RBsOQ/exec
';

// 1. TẢI ẢNH TỪ SANITY CMS
async function loadGallery() {
    // Câu lệnh GROQ lấy ảnh
    const query = encodeURIComponent('*[_type == "gallery"]{ "url": image.asset->url }');
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${query}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const galleryContainer = document.getElementById('gallery-container');
        
        data.result.forEach((item, index) => {
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = "Ảnh cưới";
            // Thêm hiệu ứng aos lần lượt cho từng ảnh
            img.setAttribute('data-aos', 'fade-up');
            img.setAttribute('data-aos-delay', index * 100);
            galleryContainer.appendChild(img);
        });
    } catch (error) {
        console.error("Lỗi tải ảnh:", error);
    }
}

// 2. TẢI NHẠC VÀ ÂM LƯỢNG TỪ SANITY
async function loadAudio() {
    const query = encodeURIComponent('*[_type == "audioConfig"][0]{ "url": musicFile.asset->url, volume }');
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${query}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if(data.result && data.result.url) {
            const audioEl = document.getElementById('bg-music');
            audioEl.src = data.result.url;
            audioEl.volume = data.result.volume || 0.5; // Đặt volume mặc định
        }
    } catch (error) {
        console.error("Lỗi tải nhạc:", error);
    }
}

// Chức năng bật/tắt nhạc
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerText = "🎵 Bật nhạc";
    } else {
        bgMusic.play();
        musicBtn.innerText = "⏸ Tắt nhạc";
    }
    isPlaying = !isPlaying;
});

// 3. XỬ LÝ FORM RSVP GỬI VỀ GOOGLE SHEETS
const form = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.innerText = "Đang gửi...";
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        form.style.display = 'none';
        formMessage.style.display = 'block';
    })
    .catch(error => {
        console.error('Error!', error.message);
        submitBtn.innerText = "Lỗi! Thử lại";
        submitBtn.disabled = false;
    });
});

// Khởi chạy khi load trang
document.addEventListener("DOMContentLoaded", () => {
    loadGallery();
    loadAudio();
});