document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("searchInput");
  const countInput = document.getElementById("imageCount");
  const aspectInput = document.getElementById("aspectRatio");
  const gallery = document.getElementById("imageGallery");
  const HF_TOKEN = "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"; // replace with your token
  const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

  function getDimensions(ratio) {
    const [w, h] = ratio.split(":").map(Number);
    const base = 512;
    const width = base * w / Math.max(w,h);
    const height = base * h / Math.max(w,h);
    return [Math.round(width), Math.round(height)];
  }

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    const count = parseInt(countInput.value);
    const aspect = aspectInput.value;
    if (!prompt) return alert("Please enter a prompt.");
    const [width, height] = getDimensions(aspect);
    generateBtn.disabled = true;
    gallery.innerHTML = "";

    for (let i = 0; i < count; i++) {
      try {
        const res = await fetch(MODEL_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt, parameters: { width, height } })
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }
        const blob = await res.blob();
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        img.alt = prompt;
        img.className = "generated-image";
        gallery.appendChild(img);
      } catch (err) {
        console.error("Generation error:", err);
        alert("Failed to generate image: " + err.message);
        break;
      }
    }

    generateBtn.disabled = false;
  });
});
