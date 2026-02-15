const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

async function cargarTurno() {
  try {
    const response = await fetch(URL_CSV);
    const data = await response.text();

    const filas = data.split("\n").map(f => f.split(","));

    const ahora = new Date();
    const horaActual = ahora.getHours();

    let fechaConsulta = new Date(ahora);

    // Si todavía no son las 08:00 → sigue siendo el turno de ayer
    if (horaActual < 8) {
      fechaConsulta.setDate(fechaConsulta.getDate() - 1);
    }

    const año = fechaConsulta.getFullYear();
    const mes = String(fechaConsulta.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaConsulta.getDate()).padStart(2, "0");

    const fechaFormateada = `${año}-${mes}-${dia}`;

    // Mostrar fecha bonita
    const fechaBonita = fechaConsulta.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    document.getElementById("fecha").innerText = fechaBonita;

    const filaTurno = filas.find(f => f[0] === fechaFormateada);

    if (!filaTurno) {
      document.getElementById("farmacia").innerText = "No hay turno cargado";
      return;
    }

    const nombre = filaTurno[1];
    const maps = filaTurno[2];
    const whatsapp = filaTurno[3];

    document.getElementById("farmacia").innerText = nombre;

    document.getElementById("btn-maps").href = maps;
    document.getElementById("btn-wpp").href = whatsapp;

  } catch (error) {
    console.error("Error cargando datos:", error);
  }
}

cargarTurno();
