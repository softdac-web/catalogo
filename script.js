let productos = [];
let categoriaActual = "Todos";

fetch('productos.json')
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductos();
    });

function mostrarProductos() {
    const contenedor = document.getElementById("contenedorProductos");
    const textoBusqueda = document.getElementById("buscador").value.toLowerCase();
    
    contenedor.innerHTML = ""; // Limpiar contenedor antes de mostrar nuevos productos

    productos
        .filter(p => 
            (categoriaActual === "Todos" || p.categoria === categoriaActual) &&
            p.nombre.toLowerCase().includes(textoBusqueda)
        )
        .forEach(p => {
            // Cambié p.imagen por p.imagenes[0] para mostrar la primera imagen del array
            contenedor.innerHTML += `
                <div class="card" onclick='abrirModal(${JSON.stringify(p)})'>
                    <img src="${p.imagenes[0]}" alt="${p.nombre}"> <!-- Ahora mostramos la primera imagen -->
                    <h3>${p.nombre}</h3>
                </div>
            `;
        });
}

function filtrar(categoria) {
    categoriaActual = categoria;
    mostrarProductos();
}

document.getElementById("buscador").addEventListener("input", mostrarProductos);

function abrirModal(producto) {
    document.getElementById("modal").style.display = "block";
    document.getElementById("modalNombre").innerText = producto.nombre;
    document.getElementById("modalDescripcion").innerText = producto.descripcion;

    // Crear la galería de imágenes
    let galeriaHTML = '';
    producto.imagenes.forEach(imagen => {
        galeriaHTML += `<img src="${imagen}" alt="${producto.nombre}" class="modal-imagen">`;
    });
    document.getElementById("modalGaleria").innerHTML = galeriaHTML;

    // Campo para cantidad
    document.getElementById("cantidad").value = 1; // Resetea el valor de la cantidad al abrir el modal

    // Configurar WhatsApp
    const cantidad = document.getElementById("cantidad").value || 1; // Si no hay cantidad, toma "1" por defecto.
    const mensaje = `Hola, quiero consultar por el producto: ${producto.nombre}. Cantidad: ${cantidad}`;

    document.getElementById("whatsappBtn").href = `https://wa.me/5493404409525?text=${encodeURIComponent(mensaje)}`;
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";

}





