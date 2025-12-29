document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("searchInput");
  const countInput = document.getElementById("imageCount");
  const aspectInput = document.getElementById("aspectRatio");
  const gallery = document.getElementById("imageGallery");

  const HF_TOKEN = "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";
  const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

  function getDimensions(ratio) {
    const [w, h] = ratio.split(":").map(Number);
    const base = 512;
    const width = Math.round((base * w) / Math.max(w, h) / 8) * 8;  // ensure multiple of 8
    const height = Math.round((base * h) / Math.max(w, h) / 8) * 8;
    return [width, height];
  }

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    const count = parseInt(countInput.value) || 1;
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
          body: JSON.stringify({
            inputs: prompt,
            options: { wait_for_model: true },
            parameters: { width, height, guidance_scale: 7.5 }
          })
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const result = await res.json();

        // Hugging Face returns an array of images in base64
        const imageBase64 = result[0].image;
        const img = document.createElement("img");
        img.src = `data:image/png;base64,${imageBase64}`;
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
