// =====================================================================
// FUNCIÓN AUXILIAR: mostrar resultados en un visor
// =====================================================================

// esError (opcional) marca el mensaje visualmente como un error
function mostrarResultado(idVisor, mensaje, esError) {
  var visor = document.getElementById(idVisor);

  visor.innerHTML = mensaje;

  if (esError) {
    visor.classList.add("error");
  } else {
    visor.classList.remove("error");
  }

  // Reiniciar la animación de "destello" cada vez que se actualiza
  visor.classList.remove("actualizado");
  void visor.offsetWidth; // fuerza el reinicio de la animación
  visor.classList.add("actualizado");
}

// =====================================================================
// CONTENEDOR 1: CALCULADORA DE PROPINA
// =====================================================================

// Mantiene sincronizados el deslizador (range) y el campo numérico
function actualizarPorcentaje(origen) {
  var rango = document.getElementById("porcentajeRange");
  var numero = document.getElementById("porcentajeNumero");
  var etiqueta = document.getElementById("etiquetaPorcentaje");

  var valor;

  if (origen === "range") {
    valor = parseInt(rango.value, 10);
  } else {
    valor = parseInt(numero.value, 10);

    if (isNaN(valor)) {
      valor = 0;
    }
    if (valor < 0) {
      valor = 0;
    }
    if (valor > 100) {
      valor = 100;
    }
  }

  rango.value = valor;
  numero.value = valor;
  etiqueta.textContent = valor;
}

function calcularPropina() {
  var montoTexto = document.getElementById("montoPropina").value;
  var porcentajeTexto = document.getElementById("porcentajeNumero").value;

  var monto = parseFloat(montoTexto);
  var porcentaje = parseFloat(porcentajeTexto);

  // Validaciones
  if (montoTexto.trim() === "" || isNaN(monto)) {
    mostrarResultado("visorPropina", "Ingresa un monto de cuenta válido.", true);
    return;
  }

  if (monto < 0) {
    mostrarResultado("visorPropina", "El monto no puede ser negativo.", true);
    return;
  }

  if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
    mostrarResultado("visorPropina", "El porcentaje debe estar entre 0 y 100.", true);
    return;
  }

  var propina = monto * (porcentaje / 100);
  var total = monto + propina;

  var mensaje =
    "Monto de la cuenta: <strong>$" + monto.toFixed(2) + "</strong><br>" +
    "Porcentaje de propina: <strong>" + porcentaje + "%</strong><br>" +
    "Propina: <strong>$" + propina.toFixed(2) + "</strong><br>" +
    "Total: <strong>$" + total.toFixed(2) + "</strong>";

  mostrarResultado("visorPropina", mensaje);
}

// Permite calcular presionando Enter en los campos de propina
function inicializarEnterPropina() {
  var monto = document.getElementById("montoPropina");
  var porcentajeNumero = document.getElementById("porcentajeNumero");

  function manejarEnter(evento) {
    if (evento.key === "Enter") {
      calcularPropina();
    }
  }

  monto.addEventListener("keydown", manejarEnter);
  porcentajeNumero.addEventListener("keydown", manejarEnter);
}

// =====================================================================
// CONTENEDOR 2: CALCULADORA DE IMC
// =====================================================================

function calcularIMC() {
  var pesoTexto = document.getElementById("pesoIMC").value;
  var alturaTexto = document.getElementById("alturaIMC").value;

  var peso = parseFloat(pesoTexto);
  var altura = parseFloat(alturaTexto);

  if (pesoTexto.trim() === "" || alturaTexto.trim() === "" || isNaN(peso) || isNaN(altura)) {
    mostrarResultado("visorIMC", "Ingresa tu peso y tu altura con valores numéricos.", true);
    return;
  }

  if (peso <= 0 || altura <= 0) {
    mostrarResultado("visorIMC", "El peso y la altura deben ser mayores que cero.", true);
    return;
  }

  var imc = peso / (altura ** 2);

  if (!isFinite(imc)) {
    mostrarResultado("visorIMC", "No se pudo calcular el IMC con esos valores.", true);
    return;
  }

  var categoria = "";

  if (imc < 18.5) {
    categoria = "Bajo peso";
  } else if (imc < 25) {
    categoria = "Normal";
  } else if (imc < 30) {
    categoria = "Sobrepeso";
  } else {
    categoria = "Obesidad";
  }

  var mensaje =
    "Peso: <strong>" + peso.toFixed(1) + " kg</strong><br>" +
    "Altura: <strong>" + altura.toFixed(2) + " m</strong><br>" +
    "IMC: <strong>" + imc.toFixed(2) + "</strong><br>" +
    "Categoría: <strong>" + categoria + "</strong>";

  mostrarResultado("visorIMC", mensaje);
  actualizarGraficaIMC(imc, categoria);
}

// Mueve el indicador sobre la barra de categorías según el IMC calculado
function actualizarGraficaIMC(imc, categoria) {
  var indicador = document.getElementById("indicadorIMC");
  var etiqueta = document.getElementById("etiquetaIndicadorIMC");

  // Escala visual: de 10 (extremo izquierdo) a 40 (extremo derecho)
  var imcMinimo = 10;
  var imcMaximo = 40;

  var imcAcotado = imc;
  if (imcAcotado < imcMinimo) {
    imcAcotado = imcMinimo;
  }
  if (imcAcotado > imcMaximo) {
    imcAcotado = imcMaximo;
  }

  var porcentaje = ((imcAcotado - imcMinimo) / (imcMaximo - imcMinimo)) * 100;

  indicador.style.left = porcentaje + "%";
  etiqueta.textContent = "Tu IMC: " + imc.toFixed(1);
}

// =====================================================================
// CONTENEDOR 3: MENÚ DE UTILIDADES (con switch)
// =====================================================================

// Muestra solo los campos correspondientes a la opción elegida
function mostrarCamposUtilidad() {
  var opcion = document.getElementById("opcionUtilidad").value;

  document.getElementById("camposOpcion1").classList.add("oculto");
  document.getElementById("camposOpcion2").classList.add("oculto");
  document.getElementById("camposOpcion3").classList.add("oculto");

  document.getElementById("camposOpcion" + opcion).classList.remove("oculto");

  // Limpiar el visor al cambiar de opción
  mostrarResultado("visorUtilidades", "Los resultados aparecerán aquí.");
}

function calcularUtilidad() {
  var opcion = parseInt(document.getElementById("opcionUtilidad").value, 10);

  switch (opcion) {

    case 1: {
      var celsiusTexto = document.getElementById("celsiusInput").value;
      var celsius = parseFloat(celsiusTexto);

      if (celsiusTexto.trim() === "" || isNaN(celsius)) {
        mostrarResultado("visorUtilidades", "Ingresa un valor válido de grados Celsius.", true);
        return;
      }

      var fahrenheit = celsius * 9 / 5 + 32;

      var mensaje1 =
        "Celsius: <strong>" + celsius.toFixed(2) + " °C</strong><br>" +
        "Fahrenheit: <strong>" + fahrenheit.toFixed(2) + " °F</strong>";

      mostrarResultado("visorUtilidades", mensaje1);
      break;
    }

    case 2: {
      var precioTexto = document.getElementById("precioInput").value;
      var ivaTexto = document.getElementById("ivaInput").value;

      var precio = parseFloat(precioTexto);
      var iva = parseFloat(ivaTexto);

      if (precioTexto.trim() === "" || ivaTexto.trim() === "" || isNaN(precio) || isNaN(iva)) {
        mostrarResultado("visorUtilidades", "Ingresa el precio y el porcentaje de IVA.", true);
        return;
      }

      if (precio < 0 || iva < 0) {
        mostrarResultado("visorUtilidades", "El precio y el IVA no pueden ser negativos.", true);
        return;
      }

      var valorIVA = precio * (iva / 100);
      var precioFinal = precio + valorIVA;

      var mensaje2 =
        "Precio: <strong>$" + precio.toFixed(2) + "</strong><br>" +
        "IVA: <strong>" + iva + "%</strong><br>" +
        "Valor IVA: <strong>$" + valorIVA.toFixed(2) + "</strong><br>" +
        "Precio final: <strong>$" + precioFinal.toFixed(2) + "</strong>";

      mostrarResultado("visorUtilidades", mensaje2);
      break;
    }

    case 3: {
      var notaTexto = document.getElementById("notaInput").value;
      var nota = parseFloat(notaTexto);

      if (notaTexto.trim() === "" || isNaN(nota)) {
        mostrarResultado("visorUtilidades", "Ingresa una nota válida.", true);
        return;
      }

      if (nota < 0 || nota > 100) {
        mostrarResultado("visorUtilidades", "La nota debe estar entre 0 y 100.", true);
        return;
      }

      var calificacion = "";

      if (nota >= 90) {
        calificacion = "A";
      } else if (nota >= 80) {
        calificacion = "B";
      } else if (nota >= 70) {
        calificacion = "C";
      } else if (nota >= 60) {
        calificacion = "D";
      } else {
        calificacion = "F";
      }

      var mensaje3 =
        "Nota: <strong>" + nota + "</strong><br>" +
        "Calificación: <strong>" + calificacion + "</strong>";

      if (nota < 60) {
        mensaje3 += "<br><strong>No aprobó.</strong>";
      }

      mostrarResultado("visorUtilidades", mensaje3);
      break;
    }

    default:
      mostrarResultado("visorUtilidades", "Opción no reconocida.", true);
  }
}

// =====================================================================
// INICIALIZACIÓN
// =====================================================================

document.addEventListener("DOMContentLoaded", function () {
  inicializarEnterPropina();
  mostrarCamposUtilidad();
});
