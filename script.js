const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

function obtenerFechaTurno() {
  const ahora = new Date();

  // Forzar zona horaria Argentina
  const argentina = new Date(
    ahora.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })
  );

  const hora = argentina.getHours();

  // Si es antes de las 08:00, sigue siendo turno del día anterior
  if (hora < 8) {
    argentina.setDate(argentina.getDate() - 1);
  }

  return argentina.toISOString().split("T")[0];
}

async function cargarTurno() {
  try {
    const response = await fetch(url);
    const data = await response.text();

    const filas = data.split("\n").map(f => f.split(","));

    const fechaTurno = obtenerFechaTurno();

    const fechaElemento = document.getElementById("fecha");
    const farmaciaElemento = document.getElementById("farmacia");
    const btnMaps = document.getElementById("btn-maps");
    const btnWpp = document.getElementById("btn-wpp");

    const fechaFormateada = new Date(fechaTurno + "T00:00:00")
      .toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });

    fechaElemento.textContent = fechaFormateada;

    let turnoEncontrado = false;

    for (let i = 1; i < filas.length; i++) {
      const fechaCSV = filas[i][0]?.trim();

      if (fechaCSV === fechaTurno) {
        farmaciaElemento.textContent = filas[i][1];
        btnMaps.href = filas[i][2];
        btnWpp.href = filas[i][3];
        turnoEncontrado = true;
        break;
      }
    }

    if (!turnoEncontrado) {
      farmaciaElemento.textContent = "No hay turno cargado";
    }

  } catch (error) {
    console.error("Error cargando datos:", error);
    document.getElementById("farmacia").textContent = "Error al cargar datos";
  }
}

cargarTurno();
