const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

async function cargarTurno() {
  try {
    const response = await fetch(csvURL);
    const data = await response.text();

    const filas = data.split("\n").slice(1);

    const ahora = new Date();
    const hora = ahora.getHours();

    // Cambio de turno a las 08:00
    if (hora < 8) {
      ahora.setDate(ahora.getDate() - 1);
    }

    const fechaHoy = ahora.toISOString().split("T")[0];

    let farmaciaHoy = null;

    filas.forEach(fila => {
      const columnas = fila.split(",");
      const fecha = columnas[0]?.trim();
      const farmacia = columnas[1];
      const maps = columnas[2];
      const whatsapp = columnas[3];

      if (fecha === fechaHoy) {
        farmaciaHoy = { farmacia, maps, whatsapp };
      }
    });

    const fechaElemento = document.getElementById("fecha");
    const contenidoElemento = document.getElementById("contenido");

    fechaElemento.innerText = ahora.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    if (farmaciaHoy) {
      contenidoElemento.innerHTML = `
        <div class="nombre-farmacia">${farmaciaHoy.farmacia}</div>

        <button id="btnMaps" class="btn-maps">📍 Cómo llegar</button>
        <button id="btnWhats" class="btn-whats">💬 WhatsApp</button>
      `;

      document.getElementById("btnMaps").onclick = () => {
        window.open(farmaciaHoy.maps, "_blank");
      };

      document.getElementById("btnWhats").onclick = () => {
        window.open(farmaciaHoy.whatsapp, "_blank");
      };

    } else {
      contenidoElemento.innerText = "No hay turno cargado.";
    }

  } catch (error) {
    console.error("Error cargando el turno:", error);
    document.getElementById("contenido").innerText = "Error cargando datos.";
  }
}

cargarTurno();
