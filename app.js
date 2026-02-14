let assets = JSON.parse(localStorage.getItem("assets")) || [];

function scanImage() {
  const input = document.getElementById("cameraInput");
  const file = input.files[0];

  if (!file) {
    alert("Select a photo first.");
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "Scanning image...";

  Tesseract.recognize(file, 'eng')
    .then(({ data: { text } }) => {

      console.log("Raw OCR:", text);

      const cleaned = text
        .replace(/[^a-zA-Z0-9\-]/g, " ")
        .split(" ")
        .filter(t => t.length > 3);

      if (cleaned.length === 0) {
        resultDiv.innerText = "No valid serial number detected.";
        return;
      }

      const detectedSerial = cleaned[0];

      resultDiv.innerHTML = `
        <strong>Detected Serial:</strong><br>
        ${detectedSerial}
        <br><br>
        <button onclick="confirmSave('${detectedSerial}')">Save Asset</button>
      `;
    })
    .catch(err => {
      resultDiv.innerText = "Error scanning image.";
      console.error(err);
    });
}

function confirmSave(serial) {
  const newAsset = {
    id: Date.now(),
    serialNumber: serial,
    notes: "",
    date: new Date().toLocaleString()
  };

  assets.push(newAsset);
  localStorage.setItem("assets", JSON.stringify(assets));

  document.getElementById("result").innerText = "Asset Saved ✔";
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
