let selectedShoe = "";
let currentPage = 1; // ตัวแปรเก็บหน้าปัจจุบัน
let choices = {}; // ตัวแปรเก็บคำตอบของคำถามทั้งหมด
let formData = {}; // ตัวแปรเก็บข้อมูลที่กรอกในฟอร์ม

// จำนวนหน้าทั้งหมด (รวมหน้าแสดงผลลัพธ์)
const totalPages = 14;

function nextPage(page) {
    // ปรับตัวแปร currentPage เมื่อไปที่หน้าใหม่
    currentPage = page;

    // ลบคลาส active ออกจากทุกหน้าก่อน
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // แสดงหน้าที่กำหนด
    if (typeof page === "number") {
        document.getElementById(`page${page}`).classList.add('active');

        // คำนวณความกว้างของ progress bar
        document.getElementById('progressBar').style.width = ((page - 1) / (totalPages - 1) * 100) + "%";
    } else if (typeof page === "string" && page === "resultPage") {
        document.getElementById("resultPage").classList.add('active');

        // เซ็ต progress bar เป็น 100%
        document.getElementById('progressBar').style.width = "100%";
    }
}

function prevPage(page) {
    // ปรับตัวแปร currentPage เมื่อย้อนกลับ
    currentPage = page;

    // ลบคลาส active ออกจากทุกหน้า
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // แสดงหน้าก่อนหน้านี้
    document.getElementById(`page${page}`).classList.add('active');

    // คำนวณความกว้างของ progress bar
    document.getElementById('progressBar').style.width = ((page - 1) / (totalPages - 1) * 100) + "%";

    // ฟื้นฟูข้อมูลในฟอร์มที่กรอกไว้
    restoreFormData(page);
}

function selectShoe(el, name) {
    // ลบคลาส selected จากรองเท้าทั้งหมด
    document.querySelectorAll('.shoe').forEach(img => img.classList.remove('selected'));

    // เพิ่มคลาส selected ให้กับรองเท้าที่เลือก
    el.classList.add('selected');
    selectedShoe = name;

    // เก็บข้อมูลรองเท้าที่เลือก
    formData["shoe"] = name;
}

function showResult() {
    const nickname = formData["nickname"] || "คุณ"; // ถ้าไม่มีชื่อเล่นให้ใช้ค่า "คุณ" แทน

    // รวมคะแนนจาก formData ของคำถามที่มีจริง
    const questionIds = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13];

    let score = 0;
    questionIds.forEach(id => {
        if (formData[`q${id}`] !== undefined) {
            score += formData[`q${id}`];
        }
    });

    let message = "";
    if (score <= 10) {
        message = "คุณดูสดใสและมีพลังใจดี 💖";
    } else if (score <= 16) {
        message = "คุณอาจเหนื่อยใจบ้าง พักผ่อนให้เพียงพอนะ 🧸";
    } else {
        message = "คุณอาจเครียดมาก ลองคุยกับคนที่ไว้ใจหรือผู้เชี่ยวชาญ ❤️";
    }

    const result = `
        <p>สวัสดี ${nickname} 👋</p>
        <p>รองเท้าที่คุณเลือก: ${selectedShoe || "ไม่ระบุ"}</p>
        <p><strong>${message}</strong></p>
    `;

    document.getElementById("resultText").innerHTML = result;

    // ไปหน้าผลลัพธ์ (resultPage)
    nextPage("resultPage");
}

function selectChoice(questionId, value) {
    const page = Math.ceil(questionId / 3);
    const buttons = document.querySelectorAll(`#page${page} .choice-btn`);
    const clickedBtn = event.target;

    const currentSelectedValue = formData[`q${questionId}`];

    // ถ้ากดช้อยส์เดิมอีกครั้ง → ยกเลิก
    if (currentSelectedValue === value) {
        clickedBtn.classList.remove('selected');
        delete formData[`q${questionId}`];
        delete choices[`q${questionId}`];
        return;
    }

    // กดเลือกใหม่ → ลบ selected เดิม แล้วเพิ่มของอันใหม่
    buttons.forEach(btn => btn.classList.remove('selected'));
    clickedBtn.classList.add('selected');

    // บันทึกค่าที่เลือก
    formData[`q${questionId}`] = value;
    choices[`q${questionId}`] = value;
}

// ฟังก์ชันเพื่อคืนค่าข้อมูลที่กรอกไว้เมื่อย้อนกลับ
function restoreFormData(page) {
    // ฟื้นฟูข้อมูลในฟอร์มหน้า 2 - 7
    if (page === 2 || page === 3) {
        document.getElementById("nickname").value = formData["nickname"] || "";
        document.getElementById("gender").value = formData["gender"] || "";
        document.getElementById("age").value = formData["age"] || "";
        document.getElementById("province").value = formData["province"] || "";
    }

    // ฟื้นฟูคำตอบในคำถาม (สำหรับคำถามที่เลือกคำตอบ)
    for (let i = 1; i <= 13; i++) {
        const value = formData[`q${i}`];
        if (value !== undefined) {
            // สำหรับคำถามที่เลือกคำตอบจากปุ่ม
            const questionPage = Math.ceil(i / 3);
            const btn = document.querySelector(`#page${questionPage} .choice-btn[data-question="${i}"][data-value="${value}"]`);
            if (btn) {
                btn.classList.add('selected');
            }
        }
    }

    // ถ้ามีการเลือกรองเท้า
    if (formData["shoe"]) {
        document.querySelectorAll('.shoe').forEach(img => img.classList.remove('selected'));
        document.querySelector(`.shoe[alt="${formData["shoe"]}"]`).classList.add('selected');
    }
}

// ฟังก์ชันเพื่อหาข้อความของคำตอบ
function getChoiceText(questionId, value) {
    const choices = {
        1: ["ไม่เลย", "บ้าง", "มาก"],
        2: ["เสมอ", "บางครั้ง", "ไม่ค่อย"],
        3: ["ดีมาก", "ปานกลาง", "ไม่ค่อยดี"],
        4: ["ไม่เลย", "บ้าง", "มาก"],
        5: ["ไม่เลย", "บ้าง", "มาก"],
        6: ["มีความสุขมาก", "พอใช้", "ไม่ค่อย"],
        7: ["ไม่เลย", "บางครั้ง", "บ่อย"],
        10: ["ไม่เลย", "บ้าง", "มาก"],
        11: ["ไม่เลย", "บ้าง", "มาก"],
        12: ["ไม่เลย", "บ้าง", "มาก"],
        13: ["มีความหมายมาก", "บางครั้ง", "ไม่มีความหมาย"]
    };
    return choices[questionId] && choices[questionId][value];
}

function nextPage(page) {
    if (currentPage === 2) {
        formData["nickname"] = document.getElementById("nickname").value;
        formData["gender"] = document.getElementById("gender").value;
        formData["age"] = document.getElementById("age").value;
        formData["province"] = document.getElementById("province").value;
    }

    currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    if (typeof page === "number") {
        document.getElementById(`page${page}`).classList.add('active');

        // ✅ เพิ่มการแสดงแถบ progress เฉพาะคำถาม
        if (page >= 4 && page <= 13) {
            document.getElementById('progressBar').style.display = "block";

            const questionNumber = page - 3;
            const totalQuestions = 10;
            document.getElementById("progressText").textContent = `${questionNumber}/${totalQuestions}`;
            document.getElementById('progressFill').style.width = ((questionNumber) / totalQuestions * 100) + "%";
        } else {
            document.getElementById('progressBar').style.display = "none";
        }
    } else if (typeof page === "string" && page === "resultPage") {
        document.getElementById("resultPage").classList.add('active');
        document.getElementById('progressBar').style.display = "none"; // ซ่อนเมื่อถึงผลลัพธ์
    }
}

function prevPage(page) {
    currentPage = page;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page${page}`).classList.add('active');

    // แสดง/ซ่อน progressBar ตามหน้าคำถาม
    if (page >= 4 && page <= 13) {
        document.getElementById('progressBar').style.display = "block";

        const questionNumber = page - 3;
        const totalQuestions = 10;

        // ✨ เปลี่ยนข้อความเป็น 1/10 แบบย่อ
        document.getElementById("progressText").textContent = `${questionNumber}/${totalQuestions}`;

        // ปรับความยาว bar
        document.getElementById('progressFill').style.width = ((questionNumber) / totalQuestions * 100) + "%";
    }else {
        document.getElementById('progressBar').style.display = "none";
    }

    // คืนค่าข้อมูลเดิม
    restoreFormData(page);
}

function restartQuiz() {
    formData = {};
    choices = {};
    selectedShoe = "";
    currentPage = 1;

    // ซ่อนหน้าผลลัพธ์
    document.getElementById("resultPage").classList.remove('active');

    // กลับไปหน้าแรก (สมมติ page4 คือหน้าคำถามแรก)
    nextPage(4);

    // เคลียร์ปุ่มเลือกทั้งหมด (ถ้ามี)
    document.querySelectorAll('.choice-btn.selected').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.shoe.selected').forEach(img => img.classList.remove('selected'));

    // เคลียร์ค่า input (ถ้ามี)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.value = "");
}
