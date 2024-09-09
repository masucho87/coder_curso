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
        this.listaDeProductos = this.cargaDeProductos() || [];
        this.idIncremental = this.listaDeProductos.length > 0 ? this.listaDeProductos[this.listaDeProductos.length - 1].id + 1 : 1;
        this.productoModificadoId = null;

        this.inicializarFormulario();
        this.inicializarBusqueda();
        this.actualizarTabla();
    }

    cargaDeProductos() {
        const productosGuardados = localStorage.getItem('productos');
        return productosGuardados ? JSON.parse(productosGuardados) : null;
    }

    inicializarFormulario() {
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
    
    async procesarFormulario() {
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
        try {
            await this.guardarProductos();
            const mensaje = `Producto ${marca} ${this.productoModificadoId ? 'modificado' : 'agregado'} correctamente.`;
            Swal.fire({
                title: "Producto Guardado",
                text: mensaje,
                icon: "success"
            });
            this.actualizarTabla();
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }

        // Cerrar el modal
        let modal = bootstrap.Modal.getInstance(document.getElementById('agregarProductoModal'));
        modal.hide();
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

    precioConTarjeta(precioFabrica) {
        const IVA = 0.21;
        const recargoTarjeta = 0.10;
        const precioFinal = precioFabrica * (1 + IVA) * (1 + recargoTarjeta);
        return Math.round(precioFinal * 100) / 100;
    }
    

    precioAlContado(precioFabrica) {
        const IVA = 0.21;
        return precioFabrica * (1 + IVA);
    }
}

let miProductos = new Productos();
miProductos.actualizarTabla();
