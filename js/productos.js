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
        this.listaDeProductos = [];
        this.idIncremental = 1;
        this.productoModificadoId = null;

        this.cargarProductosDesdeJSON();
        this.inicializarFormulario();
        this.inicializarBusqueda();
    }

    async cargarProductosDesdeJSON() {
        try {
            const response = await fetch('../json/productos.json');
            console.log('productos cargados');
            if (!response.ok) {
                throw new Error('Error');
            }
            const productosDesdeJSON = await response.json();
            console.log('productos cargados');
            this.listaDeProductos = productosDesdeJSON;
            this.idIncremental = this.listaDeProductos.length > 0 ? this.listaDeProductos[this.listaDeProductos.length - 1].id + 1 : 1;
            this.actualizarTabla();
        } catch (error) {
            console.error('Error al cargar productos desde JSON:', error);
        }
    }

    async cargarProductosDesdeLocalStorage() {
        const productosGuardados = localStorage.getItem('productos');
        if (productosGuardados) {
            this.listaDeProductos = JSON.parse(productosGuardados);
            this.idIncremental = this.listaDeProductos.length > 0 ? this.listaDeProductos[this.listaDeProductos.length - 1].id + 1 : 1;
        }
    }

    async inicializarFormulario() {
        document.getElementById('formAgregarProducto').addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                await this.procesarFormulario();
            } catch (error) {
                console.error('Error al procesar el formulario:', error);
            }
        });
    }

    inicializarBusqueda() {
        document.getElementById('buscarProductoInput').addEventListener('input', () => {
            this.buscarProducto();
        });
    }

    async validarMarcaNombre(marca, nombre) {
        const productoExistente = this.listaDeProductos.find(producto => 
            producto.marca === marca && producto.nombre === nombre && producto.id !== this.productoModificadoId
        );
        
        if (productoExistente) {
            await Swal.fire({
                title: 'Error',
                text: 'Ya existe un producto con esta marca y nombre.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return true;
        }
        return false;
    }

    async procesarFormulario() {
        let marca = document.getElementById('marcaProducto').value.trim();
        let nombre = document.getElementById('nombreProducto').value.trim();
        let tipo = document.getElementById('tipoProducto').value.trim();
        let stock = document.getElementById('stockProducto').value.trim();
        let precioFabrica = document.getElementById('precioFabrica').value.trim();

        if (await this.validarMarcaNombre(marca, nombre)) {
            return; // Sale si la validacion de la marca y el nombre falla.
        }

        let precioConTarjeta = this.precioConTarjeta(precioFabrica);
        let precioAlContado = this.precioAlContado(precioFabrica);

        if (this.productoModificadoId) {
            
            let productoModificado = this.listaDeProductos.find(producto => producto.id === this.productoModificadoId);
            productoModificado.marca = marca;
            productoModificado.nombre = nombre;
            productoModificado.tipo = tipo;
            productoModificado.stock = stock;
            productoModificado.precioFabrica = precioFabrica;
            productoModificado.precioConTarjeta = precioConTarjeta;
            productoModificado.precioAlContado = precioAlContado;

            this.productoModificadoId = null;
        } else {
            if (!marca || !nombre || !tipo || isNaN(stock) || isNaN(precioFabrica)) {
                await Swal.fire({
                    title: 'Error',
                    text: 'Datos de formulario no válidos',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return; // Salimos si hay datos invalidos
            }
            
            let productoNuevo = new Producto(this.idIncremental, marca, nombre, tipo, stock, precioFabrica, precioAlContado, precioConTarjeta);
            this.listaDeProductos.push(productoNuevo);
            this.idIncremental++;
        }

        // guarda los productos en localStorage
        try {
            await this.guardarProductos();
            console.log("Productos guardados exitosamente.");
        } catch (error) {
            console.error("Error al guardar los productos: ", error);
        }

        
        this.limpiarFormulario();

        let modal = bootstrap.Modal.getInstance(document.getElementById('agregarProductoModal'));
        modal.hide();
        this.actualizarTabla();
    }

    limpiarFormulario() {
        document.getElementById('formAgregarProducto').reset();
    }

    async guardarProductos() {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem('productos', JSON.stringify(this.listaDeProductos));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    buscarProducto() {
        const query = document.getElementById('buscarProductoInput').value.toLowerCase();
        const filas = document.querySelectorAll('.tabla tbody tr');

        filas.forEach(fila => {
            const nombreProducto = fila.querySelector('td:nth-child(3)').textContent.toLowerCase();

            if (nombreProducto.includes(query)) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    }

    async eliminaProducto(id) {
        try {
            const resultado = await Swal.fire({
                title: 'Confirmar Eliminación',
                text: '¿Estás seguro de que deseas eliminar este producto?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            });

            if (resultado.isConfirmed) {
                // Elimina el producto de la lista y del localStorage
                this.listaDeProductos = this.listaDeProductos.filter(producto => producto.id !== id);
                await this.guardarProductos();
                this.actualizarTabla();

                Swal.fire({
                    title: 'Eliminado',
                    text: 'El producto ha sido eliminado exitosamente.',
                    icon: 'success',
                    timer: 2000
                });
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al eliminar el producto.',
                icon: 'error'
            });
        }
    }

    mostrarModalModificacion(id) {
        const productoEncontrado = this.listaDeProductos.find(producto => producto.id === id);

        if (!productoEncontrado) {
            console.error(`No se encontró un producto con el id ${id}.`);
            return;
        }

        Swal.fire({
            title: "Confirmar Modificación",
            text: "¿Estás seguro de modificar este producto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Llena el formulario con los datos del producto para poder modificarlo

                document.getElementById('marcaProducto').value = productoEncontrado.marca;
                document.getElementById('nombreProducto').value = productoEncontrado.nombre;
                document.getElementById('tipoProducto').value = productoEncontrado.tipo;
                document.getElementById('stockProducto').value = productoEncontrado.stock;
                document.getElementById('precioFabrica').value = productoEncontrado.precioFabrica;

                this.productoModificadoId = id;

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById('agregarProductoModal'));
                modal.show();
            }
        });
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

        this.inicializarBotonesEliminar();
        this.inicializarBotonesModificar();
    }

    inicializarBotonesEliminar() {
        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                this.eliminaProducto(id);
            });
        });
    }

    inicializarBotonesModificar() {
        document.querySelectorAll('.btn-modificar').forEach(boton => {
            boton.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                this.mostrarModalModificacion(id);
            });
        });
    }
}

// Inicializar productos
const productos = new Productos();
