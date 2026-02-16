const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

function obtenerFechaTurno() {
  const ahora = new Date();
  const hora = ahora.getHours();

  // Si es antes de las 08:00 sigue siendo el turno del día anterior
  if (hora < 8) {
    ahora.setDate(ahora.getDate() - 1);
  }

  return ahora.toISOString().split("T")[0];
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO + "T00:00:00");
  return fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

async function cargarTurno() {
  try {
    const response = await fetch(CSV_URL);
    const data = await response.text();

    const filas = data.split("\n").map(f => f.split(","));

    const fechaTurno = obtenerFechaTurno();

    document.getElementById("fecha").textContent = formatearFecha(fechaTurno);

    const turno = filas.find(f => f[0] === fechaTurno);

    if (turno) {
      document.getElementById("farmacia").textContent = turno[1];
      document.getElementById("btn-maps").href = turno[2];
      document.getElementById("btn-wpp").href = turno[3];
    } else {
      document.getElementById("farmacia").textContent = "No hay turno cargado";
    }

  } catch (error) {
    document.getElementById("farmacia").textContent = "Error cargando datos";
  }
}

cargarTurno();
