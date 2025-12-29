document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("searchInput");
  const countInput = document.getElementById("imageCount");
  const aspectInput = document.getElementById("aspectRatio");
  const gallery = document.getElementById("imageGallery");

  function getDimensions(ratio) {
    const [w, h] = ratio.split(":").map(Number);
    const base = 512;
    const width = Math.round((base * w) / Math.max(w, h) / 8) * 8;
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
        // 🔒 CALL YOUR BACKEND (NOT HUGGING FACE DIRECTLY)
        const res = await fetch("http://localhost:3000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt,
            width,
            height
          })
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
