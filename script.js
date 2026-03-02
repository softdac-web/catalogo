document.addEventListener("DOMContentLoaded", function () {

  let productos = [];
  let carrito = [];
  let actual = null;

  const contenedor = document.getElementById("productos");
  const searchInput = document.getElementById("search");
  const ordenarSelect = document.getElementById("ordenar");
  const modal = document.getElementById("modal");
  const modalNombre = document.getElementById("modal-nombre");
  const modalDescripcion = document.getElementById("modal-descripcion");
  const modalPrecio = document.getElementById("modal-precio");
  const modalStock = document.getElementById("modal-stock");
  const cantidadInput = document.getElementById("cantidad");
  const btnAgregar = document.getElementById("btn-agregar");
  const panelCarrito = document.getElementById("panel-carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");
  const contador = document.getElementById("contador");

  /* =========================
     CARGAR PRODUCTOS
  ========================== */

  fetch("productos.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrar(productos);
    })
    .catch(err => console.error("Error cargando productos:", err));

  /* =========================
     MOSTRAR PRODUCTOS
  ========================== */

  function mostrar(lista) {

    contenedor.innerHTML = "";

    // Destacados primero
    lista.sort((a, b) => (b.destacado === true) - (a.destacado === true));

    lista.forEach(p => {

      contenedor.innerHTML += `
        <div class="card" onclick="abrirModal('${p.codigo}')">
          ${p.destacado ? '<div class="badge">⭐ Destacado</div>' : ''}
          ${p.precioAnterior ? '<div class="badge-oferta">OFERTA</div>' : ''}
          
          <img src="img/${p.codigo}_000.jpg" alt="${p.nombre}" loading="lazy">
          
          <h3>${p.nombre}</h3>
          
          ${p.precioAnterior ? `<p class="precio-anterior">$${p.precioAnterior}</p>` : ''}
          <p class="precio">$${p.precio}</p>

          <p class="${p.stock ? 'stock-ok':'stock-no'}">
            ${p.stock ? 'Disponible':'Sin stock'}
          </p>
        </div>
      `;
    });

    window.abrirModal = abrirModal;
  }

  /* =========================
     ABRIR MODAL
  ========================== */

  function abrirModal(codigo) {

    actual = productos.find(p => p.codigo === codigo);
    if (!actual) return;

    modalNombre.innerText = actual.nombre;
    modalDescripcion.innerText = actual.descripcion;
    modalPrecio.innerText = "$" + actual.precio;
    modalStock.innerText = actual.stock ? "Disponible" : "Sin stock";
    btnAgregar.disabled = !actual.stock;
    cantidadInput.value = 1;

    const galeriaDiv = document.getElementById("modal-galeria");
    galeriaDiv.innerHTML = "";

    // Imagen principal
    let imagenPrincipal = document.createElement("img");
    imagenPrincipal.src = `img/${actual.codigo}_000.jpg`;
    imagenPrincipal.style.width = "80%";
    imagenPrincipal.style.borderRadius = "12px";
    imagenPrincipal.style.marginBottom = "10px";
    galeriaDiv.appendChild(imagenPrincipal);

    // Miniaturas
    let thumbs = document.createElement("div");
    thumbs.style.display = "flex";
    thumbs.style.gap = "5px";

    for (let i = 0; i < 5; i++) {
      const imgPath = `img/${actual.codigo}_00${i}.jpg`;

      let thumb = document.createElement("img");
      thumb.src = imgPath;
      thumb.style.width = "60px";
      thumb.style.height = "60px";
      thumb.style.objectFit = "cover";
      thumb.style.borderRadius = "8px";
      thumb.style.cursor = "pointer";

      thumb.onerror = () => thumb.style.display = "none";

      thumb.onclick = () => {
        imagenPrincipal.src = imgPath;
      };

      thumbs.appendChild(thumb);
    }

    galeriaDiv.appendChild(thumbs);

    modal.classList.remove("hidden");
  }

  window.cerrarModal = function () {
    modal.classList.add("hidden");
  };

  /* =========================
     CARRITO
  ========================== */

  window.agregarCarrito = function () {

    const cantidad = parseInt(cantidadInput.value);
    if (!actual || !cantidad) return;

    const existente = carrito.find(p => p.codigo === actual.codigo);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ ...actual, cantidad });
    }

    actualizarCarrito();
    cerrarModal();
  };

  function actualizarCarrito() {

    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(p => {
      const subtotal = p.precio * p.cantidad;
      total += subtotal;

      listaCarrito.innerHTML += `
        <p>${p.nombre} x${p.cantidad} - $${subtotal}</p>
      `;
    });

    totalSpan.innerText = "Total: $" + total;
    contador.innerText = carrito.length;
  }

  window.toggleCarrito = function () {

    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    panelCarrito.classList.toggle("hidden");
  };

  window.vaciarCarrito = function () {
    carrito = [];
    actualizarCarrito();
    panelCarrito.classList.add("hidden");
  };

  window.enviarWhatsApp = function () {

    if (carrito.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    let mensaje = "Hola! 👋 Quiero hacer el siguiente pedido:%0A%0A";
    let total = 0;

    carrito.forEach(p => {
      const subtotal = p.precio * p.cantidad;
      total += subtotal;

      mensaje += `🧀 ${p.nombre}%0A`;
      mensaje += `Cantidad: ${p.cantidad}%0A`;
      mensaje += `Subtotal: $${subtotal}%0A%0A`;
    });

    mensaje += `TOTAL: $${total}%0A%0A`;
    mensaje += "Nombre:%0ADirección:%0AMétodo de pago:";

    window.open(`https://wa.me/5493404409525?text=${mensaje}`, "_blank");
  };

  /* =========================
     FILTROS
  ========================== */

  window.filtrar = function (categoria) {
    if (categoria === "todos") {
      mostrar(productos);
    } else {
      mostrar(productos.filter(p => p.categoria === categoria));
    }
  };

  /* =========================
     BUSCADOR
  ========================== */

  searchInput.addEventListener("input", function () {
    const texto = this.value.toLowerCase();
    mostrar(productos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    ));
  });

  /* =========================
     ORDENAR POR PRECIO
  ========================== */

  ordenarSelect.addEventListener("change", function () {

    let copia = [...productos];

    if (this.value === "menor") {
      copia.sort((a, b) => a.precio - b.precio);
    }

    if (this.value === "mayor") {
      copia.sort((a, b) => b.precio - a.precio);
    }

    mostrar(copia);
  });

});

