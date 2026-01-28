// =====================================
// BASE URL (NO /api prefix)
// =====================================
const API = "http://localhost:5000";


// =====================================
// ADMIN LOGIN
// =====================================
async function adminLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");
    msg.innerText = "";

    const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    let text = await res.text();
    let data;

    // Backend sometimes returns HTML on error → parse safely
    try {
        data = JSON.parse(text);
    } catch (err) {
        msg.innerText = "Server error (not JSON)";
        return;
    }

    if (!data.success) {
        msg.innerText = data.message;
        return;
    }

    localStorage.setItem("admin_token", data.data.token);
    window.location.href = "dashboard.html";
}


// =====================================
// LOGOUT
// =====================================
function logout() {
    localStorage.removeItem("admin_token");
    window.location.href = "index.html";
}


// =====================================
// AUTH MIDDLEWARE
// =====================================
function checkAuth() {
    console.log("checkAuth() CALLED");

    const token = localStorage.getItem("admin_token");
    console.log("Token found:", token);

    if (!token) {
        console.log("No token → redirecting to login");
        window.location.href = "index.html";
    }
}



// =====================================
// LIMITS PAGE
// =====================================
if (window.location.pathname.includes("limits.html")) {
    checkAuth();
    loadLimits();
}

async function loadLimits() {
    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API}/limits`, {
        headers: { "Authorization": token }
    });

    const data = await res.json();
    if (!data.success) return alert("Failed to load limits");

    const l = data.data;

    document.getElementById("min_bid").value = l.min_bid;
    document.getElementById("max_bid").value = l.max_bid;
    document.getElementById("max_single_number").value = l.max_single_number;
    document.getElementById("max_house").value = l.max_house;
    document.getElementById("max_ending").value = l.max_ending;

    document.getElementById("round1_open").value = l.round1_open;
    document.getElementById("round1_close").value = l.round1_close;
    document.getElementById("round2_open").value = l.round2_open;
    document.getElementById("round2_close").value = l.round2_close;
}

async function saveLimits() {
    const token = localStorage.getItem("admin_token");

    const body = {
        min_bid: +document.getElementById("min_bid").value,
        max_bid: +document.getElementById("max_bid").value,
        max_single_number: +document.getElementById("max_single_number").value,
        max_house: +document.getElementById("max_house").value,
        max_ending: +document.getElementById("max_ending").value,
        round1_open: document.getElementById("round1_open").value,
        round1_close: document.getElementById("round1_close").value,
        round2_open: document.getElementById("round2_open").value,
        round2_close: document.getElementById("round2_close").value
    };

    const res = await fetch(`${API}/limits/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    document.getElementById("msg").innerText = data.message;
    document.getElementById("msg").style.color = data.success ? "green" : "red";
}


// =====================================
// RESULTS PAGE
// =====================================
if (window.location.pathname.includes("results.html")) {
    checkAuth();
    loadTodayResult();
}

async function loadTodayResult() {
    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API}/results/today`, {
        headers: { "Authorization": token }
    });

    const data = await res.json();
    if (!data.success) return alert("Failed to load result");

    const r = data.data;

    document.getElementById("round1").value = r.round1 ?? "";
    document.getElementById("round2").value = r.round2 ?? "";
}

async function saveResult() {
    const token = localStorage.getItem("admin_token");

    const body = {
        round1: document.getElementById("round1").value.trim(),
        round2: document.getElementById("round2").value.trim()
    };

    const res = await fetch(`${API}/results/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    document.getElementById("msg").innerText = data.message;
    document.getElementById("msg").style.color = data.success ? "green" : "red";
}


// =====================================
// BETS PAGE
// =====================================
if (window.location.pathname.includes("bets.html")) {
    checkAuth();
    loadBets();
}

async function loadBets() {
    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API}/bets/all`, {
        headers: { "Authorization": token }
    });

    const data = await res.json();
    if (!data.success) return alert("Failed to load bets");

    const tbody = document.querySelector("#betsTable tbody");
    tbody.innerHTML = "";

    data.data.forEach(bet => {
        const betDetails = bet.bets
            .map(b => `${b.number} (${b.points})`)
            .join("<br>");

        const row = `
            <tr>
                <td>${bet.userId}</td>
                <td>${bet.round}</td>
                <td>${bet.total_amount}</td>
                <td>${bet.date}</td>
                <td>${betDetails}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}


// =====================================
// BANKS PAGE
// =====================================
if (window.location.pathname.includes("banks.html")) {
    checkAuth();
    loadBanks();
}

async function loadBanks() {
    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API}/bank/all`, {
        headers: { "Authorization": token }
    });

    const data = await res.json();
    if (!data.success) return alert("Failed to load banks");

    const tbody = document.querySelector("#bankTable tbody");
    tbody.innerHTML = "";

    data.data.forEach(item => {
        const row = `
            <tr>
                <td>${item.userId}</td>
                <td>${item.bank_name}</td>
                <td>${item.account_no}</td>
                <td>${item.ifsc}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
