document.addEventListener("DOMContentLoaded", function() {
  let productos = [];
  let carrito = [];
  let actual = null;

  const contenedor = document.getElementById("productos");
  const searchInput = document.getElementById("search");
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

  // Cargar productos desde JSON
  fetch("productos.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrar(productos);
    })
    .catch(err => console.error("Error cargando productos:", err));

  // Función para mostrar productos en la grilla
  function mostrar(lista) {
    contenedor.innerHTML = "";
    lista.forEach(p => {
      contenedor.innerHTML += `
        <div class="card" onclick="abrirModal('${p.codigo}')">
          <img src="img/${p.codigo}_000.jpg" alt="${p.nombre}" loading="lazy">
          <h3>${p.nombre}</h3>
          <p class="precio">$${p.precio}</p>
          <p class="${p.stock ? 'stock-ok':'stock-no'}">
            ${p.stock ? 'Disponible':'Sin stock'}
          </p>
        </div>
      `;
    });
    // Reasignar eventos porque usamos onclick dinámico
    window.abrirModal = abrirModal;
  }

  // Función para abrir modal
  function abrirModal(codigo) {
    actual = productos.find(p => p.codigo === codigo);
    if (!actual) return;

    modalNombre.innerText = actual.nombre;
    modalDescripcion.innerText = actual.descripcion;
    modalPrecio.innerText = "$" + actual.precio;
    modalStock.innerText = actual.stock ? "Disponible" : "Sin stock";
    btnAgregar.disabled = !actual.stock;
    cantidadInput.value = 1;

    // Galería
    const galeriaDiv = document.getElementById("modal-galeria");
    galeriaDiv.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const imgPath = `img/${actual.codigo}_00${i}.jpg`;
      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = actual.nombre + " " + i;
      img.onerror = () => img.style.display = "none"; // Oculta si no existe
      img.style.width = "60px";
      img.style.marginRight = "5px";
      img.style.borderRadius = "8px";
      galeriaDiv.appendChild(img);
    }

    modal.classList.remove("hidden");
  }

  // Cerrar modal
  window.cerrarModal = function() {
    modal.classList.add("hidden");
  }

  // Agregar al carrito
  window.agregarCarrito = function() {
    const cantidad = parseInt(cantidadInput.value);
    if (!actual || !cantidad) return;

    // Si ya existe en carrito, sumar cantidad
    const existente = carrito.find(p => p.codigo === actual.codigo);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({...actual, cantidad});
    }
    actualizarCarrito();
    cerrarModal();
  }

  // Actualizar panel carrito
  function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach(p => {
      total += p.precio * p.cantidad;
      listaCarrito.innerHTML += `<p>${p.nombre} x${p.cantidad} - $${p.precio*p.cantidad}</p>`;
    });
    totalSpan.innerText = "Total: $" + total;
    contador.innerText = carrito.length;
  }

  // Mostrar/Ocultar carrito
  window.toggleCarrito = function() {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    panelCarrito.classList.toggle("hidden");
  }
  
  // Enviar pedido a WhatsApp
  window.enviarWhatsApp = function() {
    if (carrito.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }
  
    let mensaje = "Hola! 👋 Quiero hacer el siguiente pedido:%0A%0A";
    let total = 0;
  
    carrito.forEach(p => {
      const sub = p.precio * p.cantidad;
      total += sub;
      mensaje += `🧀 ${p.nombre}%0ACantidad: ${p.cantidad}%0ASubtotal: $${sub}%0A%0A`;
    });
  
    mensaje += `TOTAL: $${total}%0A%0ANombre:%0ADirección:%0AMétodo de pago:`;
  
    window.open(`https://wa.me/5493404409525?text=${mensaje}`, "_blank");
  }
  // Filtrar por categoría
  window.filtrar = function(categoria) {
    if (categoria === "todos") mostrar(productos);
    else mostrar(productos.filter(p => p.categoria === categoria));
  }

  // Buscador en tiempo real
  searchInput.addEventListener("input", function() {
    const texto = this.value.toLowerCase();
    mostrar(productos.filter(p => p.nombre.toLowerCase().includes(texto)));
  });

});


