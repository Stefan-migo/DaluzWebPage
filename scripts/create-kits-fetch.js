async function createCategory() {
  try {
    const res = await fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Kits y Experiencia",
        slug: "linea-kits-experiencia",
        description: "Nuestra colección especial de Kits y Experiencias."
      })
    });
    const json = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", json);
  } catch(e) {
    console.error("Error connecting to server:", e);
  }
}
createCategory();
