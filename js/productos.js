class Producto {
    constructor(id, marca, nombre, tipo, stock, precioFabrica, precioAlContado, precioConTarjeta) {
        this.id = id;
        this.marca = marca;
        this.nombre = nombre;
        this.tipo = tipo;
        this.stock = stock;
        this.precioFabrica = precioFabrica;
        this.precioAlContado = precioAlContado;
        this.precioConTarjeta = precioConTarjeta;
    }
}

class Productos {
    constructor() {
        const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
        this.listaDeProductos = productosGuardados;
        this.idIncremental = productosGuardados.length > 0 ? productosGuardados[productosGuardados.length - 1].id + 1 : 1;
        this.inicializarFormulario();
        this.inicializarBusqueda(); 
        this.productoModificadoId = null;
    }

    inicializarFormulario() {
        document.getElementById('formAgregarProducto').addEventListener('submit', (event) => {
            event.preventDefault();
            this.procesarFormulario();
        });
    }

    inicializarBusqueda() {
        document.getElementById('buscarProductoInput').addEventListener('input', () => {
            this.buscarProducto();
        });
    }

    procesarFormulario() {
        let marca = document.getElementById('marcaProducto').value;
        let nombre = document.getElementById('nombreProducto').value;
        let tipo = document.getElementById('tipoProducto').value;
        let stock = document.getElementById('stockProducto').value;
        let precioFabrica = document.getElementById('precioFabrica').value;

        let precioConTarjeta = this.precioConTarjeta(precioFabrica);
        let precioAlContado = this.precioAlContado(precioFabrica);

        if (this.productoModificadoId) {
            // Modificar producto existente
            let productoModificado = this.listaDeProductos.find(producto => producto.id === this.productoModificadoId);
            productoModificado.marca = marca;
            productoModificado.nombre = nombre;
            productoModificado.tipo = tipo;
            productoModificado.stock = stock;
            productoModificado.precioFabrica = precioFabrica;
            productoModificado.precioConTarjeta = precioConTarjeta;
            productoModificado.precioAlContado = precioAlContado;

            // Limpiar ID de producto modificado
            this.productoModificadoId = null;
        } else {
            // Agregar nuevo producto
            let productoNuevo = new Producto(this.idIncremental, marca, nombre, tipo, stock, precioFabrica, precioAlContado, precioConTarjeta);
            this.listaDeProductos.push(productoNuevo);
            this.idIncremental++;
        }

        // Actualizar el localStorage y la tabla
        localStorage.setItem('productos', JSON.stringify(this.listaDeProductos));

// Mostrar el mensaje en el modal
        const mensaje = `Producto ${marca} ${this.productoModificadoId ? 'modificado' : 'agregado'} correctamente.`;
        this.mostrarModalMensaje(mensaje);
        this.actualizarTabla();

        // Cerrar el modal
        let modal = bootstrap.Modal.getInstance(document.getElementById('agregarProductoModal'));
        modal.hide();
    }

    verificoProducto(marca, nombre, tipo) {
        return this.listaDeProductos.some(producto => producto.marca === marca && producto.nombre === nombre && producto.tipo === tipo);
    }

    buscarProducto() {
        const query = document.getElementById('buscarProductoInput').value.toLowerCase();
        const filas = document.querySelectorAll('.tabla tbody tr');

        filas.forEach(fila => {
            const nombreProducto = fila.querySelector('td:nth-child(3)').textContent.toLowerCase();

            if (nombreProducto.includes(query)) {
                fila.style.display = ''; // Muestra la fila si coincide con la búsqueda
            } else {
                fila.style.display = 'none'; // Oculta la fila si no coincide
            }
        });
    }

    eliminaProducto(id) {
        // Abre el modal de confirmacion
        const confirmarEliminar = new bootstrap.Modal(document.getElementById('confirmarEliminar'));
        confirmarEliminar.show();
    
        // Maneja la confirmación de la eliminación
        document.getElementById('confirmarEliminarBtn').onclick = () => {
            // Elimina el producto de la lista y del localStorage
            this.listaDeProductos = this.listaDeProductos.filter(producto => producto.id !== id);
            localStorage.setItem('productos', JSON.stringify(this.listaDeProductos));
            this.actualizarTabla();
    
            // Cierra el modal después de la eliminacion
            confirmarEliminar.hide();
        };
    }

    mostrarModalModificacion(id) {
        const productoEncontrado = this.listaDeProductos.find(producto => producto.id === id);

        if (!productoEncontrado) {
            console.error(`No se encontró un producto con el id ${id}.`);
            return;
        }

        // Llena el formulario con los datos del producto
        document.getElementById('marcaProducto').value = productoEncontrado.marca;
        document.getElementById('nombreProducto').value = productoEncontrado.nombre;
        document.getElementById('tipoProducto').value = productoEncontrado.tipo;
        document.getElementById('stockProducto').value = productoEncontrado.stock;
        document.getElementById('precioFabrica').value = productoEncontrado.precioFabrica;

        // Establece el ID del producto a modificar
        this.productoModificadoId = id;

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('agregarProductoModal'));
        modal.show();
    }

    actualizarTabla() {
        const tbody = document.querySelector('.tabla tbody');
        tbody.innerHTML = '';
    
        this.listaDeProductos.forEach(producto => {
            let fila = `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.marca}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.tipo}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.precioFabrica}</td>
                    <td>${producto.precioAlContado}</td>
                    <td>${producto.precioConTarjeta}</td>
                    <td><button class="btn-eliminar" data-id="${producto.id}">Eliminar</button></td>
                    <td><button class="btn-modificar" data-id="${producto.id}">Modificar</button></td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    
        // listener a todos los botones de eliminacion
        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.getAttribute('data-id'));
                this.eliminaProducto(id);
            });
        });

        // listener a todos los botones de modificacion
        document.querySelectorAll('.btn-modificar').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.getAttribute('data-id'));
                this.mostrarModalModificacion(id);
            });
        });
    }

    mostrarModalMensaje(mensaje) {
        const mensajeElemento = document.getElementById('mensajeContenido');
        mensajeElemento.textContent = mensaje;
        const modal = new bootstrap.Modal(document.getElementById('modalMensaje'));
        modal.show();
    }
    

    precioConTarjeta(precioFabrica) {
        const IVA = 0.21;
        const recargoTarjeta = 0.10;
        const precioFinal = precioFabrica * (1 + IVA) * (1 + recargoTarjeta);
        //Se redonde el precio
        return Math.round(precioFinal * 100) / 100;
    }
    

    precioAlContado(precioFabrica) {
        const IVA = 0.21;
        return precioFabrica * (1 + IVA);
    }
}

let miProductos = new Productos();
miProductos.actualizarTabla();
