let assets = JSON.parse(localStorage.getItem("assets")) || [];

function scanImage() {
  const input = document.getElementById("cameraInput");
  const file = input.files[0];

  if (!file) {
    alert("Select a photo first.");
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "Preparing image...";

  // Resize image for faster & more reliable OCR on iPhone
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const scale = 1000 / img.width; // resize large images
      canvas.width = 1000;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      runOCR(canvas);
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

function runOCR(imageCanvas) {
  const resultDiv = document.getElementById("result");

  resultDiv.innerText = "Scanning text...";

  Tesseract.recognize(
    imageCanvas,
    'eng',
    {
      logger: m => {
        if (m.status === "recognizing text") {
          resultDiv.innerText = "Scanning: " + Math.round(m.progress * 100) + "%";
        }
      }
    }
  ).then(({ data: { text } }) => {

    console.log("OCR TEXT:", text);

    const lines = text
      .replace(/[^a-zA-Z0-9\-]/g, "\n")
      .split("\n")
      .filter(t => t.length > 3);

    if (lines.length === 0) {
      resultDiv.innerText = "No serial number detected.";
      return;
    }

    resultDiv.innerHTML =
      "<strong>Detected Text:</strong><br><br>" +
      lines.join("<br>") +
      "<br><br><button onclick=\"confirmSave('" + lines[0] + "')\">Save First Result</button>";
  }).catch(err => {
    resultDiv.innerText = "Scan failed.";
    console.error(err);
  });
}

function confirmSave(serial) {
  const newAsset = {
    id: Date.now(),
    serialNumber: serial,
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
      <p>${asset.date}</p>
    `;
    container.appendChild(div);
  });
}

renderAssets();
