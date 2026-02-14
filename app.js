let assets = JSON.parse(localStorage.getItem("assets")) || [];

function scanImage() {
  const input = document.getElementById("cameraInput");
  const file = input.files[0];

  if (!file) {
    alert("Take a photo first.");
    return;
  }

  document.getElementById("result").innerText = "Scanning...";

  Tesseract.recognize(file, 'eng')
    .then(({ data: { text } }) => {

      const cleaned = text
        .replace(/[^a-zA-Z0-9\-]/g, " ")
        .split(" ")
        .filter(t => t.length > 3)[0] || "UNKNOWN";

      createAsset(cleaned);
      document.getElementById("result").innerText = "Detected: " + cleaned;
    });
}

function createAsset(serial) {
  const newAsset = {
    id: Date.now(),
    serialNumber: serial,
    notes: "",
    date: new Date().toLocaleString()
  };

  assets.push(newAsset);
  localStorage.setItem("assets", JSON.stringify(assets));
  renderAssets();
}

function renderAssets() {
  const container = document.getElementById("assetList");
  container.innerHTML = "";

  assets.forEach(asset => {
    const div = document.createElement("div");
    div.className = "assetCard";
    div.innerHTML = `
      <strong>${asset.serialNumber}</strong>
      <p>Created: ${asset.date}</p>
    `;
    container.appendChild(div);
  });
}

renderAssets();
