async function createCategory() {
  try {
    const res = await fetch("http://localhost:3001/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Línea Utópica",
        slug: "linea-utopica",
        description: "Línea de maquillaje consciente y ceremonial."
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
