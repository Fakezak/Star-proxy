// ===== Frontend JS for VIP Proxy =====

// Elements
const uidInput = document.getElementById("uid");
const saveBtn = document.getElementById("saveBtn");
const proxyBtn = document.getElementById("proxyBtn");
const proxyInfo = document.getElementById("proxyInfo");

// Backend API (your Railway URL)
const API_BASE = "https://star-proxy-production.up.railway.app";

// Save UID
saveBtn.addEventListener("click", async () => {
  const uid = uidInput.value.trim();
  if (!uid) {
    alert("Please enter your Free Fire UID");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });

    const data = await res.json();
    if (data.success) {
      alert(`UID saved! Session expires in 2 hours.`);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to connect to backend.");
  }
});

// Show Proxy IP
proxyBtn.addEventListener("click", async () => {
  const uid = uidInput.value.trim();
  if (!uid) {
    alert("Enter UID first.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/proxy/${uid}`);
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // Example fake IP + Port (backend could randomize)
    const fakeIP = "192.168.1.77";
    const fakePort = "8080";

    proxyInfo.style.display = "block";
    proxyInfo.innerHTML = `
      Proxy IP: <span>${fakeIP}</span><br>
      Port: <span>${fakePort}</span>
    `;
  } catch (err) {
    console.error(err);
    alert("Failed to fetch proxy info.");
  }
});
