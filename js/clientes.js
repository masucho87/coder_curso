class Cliente {
    constructor(id, nombre, apellido, telefono, email, mascotas) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.mascotas = mascotas;
    }
}

class Clientes {
    constructor() {
        this.listaClientes = [];
        this.idIncremental = 1;
        this.mascotaCount = 0;
        this.clienteModificadoId = null;

        document.addEventListener('DOMContentLoaded', () => {
            this.inicializarFormulario();
            this.cargarClientes();
            this.actualizarTabla();
            this.inicializarBusqueda();
        });
    }

    async cargarClientes() {
        try {
            const response = await fetch('../json/clientes.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            const clientesJSON = await response.json();
            console.log('Datos cargados:', clientesJSON);
            this.listaClientes = clientesJSON.map(cliente => new Cliente(
                cliente.id,
                cliente.nombre,
                cliente.apellido,
                cliente.telefono,
                cliente.email,
                cliente.mascotas || []
            ));
            console.log('Lista de clientes:', this.listaClientes);
            this.idIncremental = this.listaClientes.length > 0 ? this.listaClientes[this.listaClientes.length - 1].id + 1 : 1;
            this.actualizarTabla(); //Actualizo la tabla para las llamadas
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    }
    

    inicializarFormulario() {
        const form = document.getElementById('formAgregarCliente');
        const agregarMascota = document.getElementById('agregarMascota');
        const botonAgregar = document.getElementById('botonAgregar');

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.procesarFormulario();
            });
        } else {
            console.error('No se encontró el formulario.');
        }

        if (agregarMascota) {
            agregarMascota.addEventListener('click', () => {
                this.agregarMascotaCampo();
            });
        } else {
            console.error('No se encontró el botón de agregar mascota.');
        }

        if (botonAgregar) {
            botonAgregar.addEventListener('click', () => {
                this.limpiarFormulario();
                this.abrirModalAgregar();
            });            
        } else {
            console.error('No se encontró el botón de agregar cliente.');
        }
    }

    abrirModalAgregar() {
        this.limpiarFormulario();
        const modal = new bootstrap.Modal(document.getElementById('agregarCliente'));
        modal.show();
    }

    agregarMascotaCampo() {
        this.mascotaCount++;
        const container = document.getElementById('mascotasContainer');
        if (container) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control mb-1';
            input.name = 'mascotas';
            input.placeholder = 'Nombre de la mascota';
            input.required = true;
            container.appendChild(input);
        } else {
            console.error('No se encontró el contenedor de mascotas.');
        }
    }

    async procesarFormulario() {
        try {
            let nombre = document.getElementById('nombreCliente').value.trim();
            let apellido = document.getElementById('apellidoCliente').value.trim();
            let telefono = document.getElementById('telefonoCliente').value.trim();
            let email = document.getElementById('emailCliente').value.trim();
        
            let mascotas = Array.from(document.querySelectorAll('#mascotasContainer input[name="mascotas"]'))
                .map(input => input.value.trim());
        
            const clienteExistente = this.listaClientes.find(cliente => 
                cliente.nombre === nombre && cliente.apellido === apellido && cliente.id !== this.clienteModificadoId);
        
            const mensajeError = document.getElementById('mensajeError');
        
            if (mensajeError) {
                if (clienteExistente) {
                    mensajeError.textContent = 'El cliente con el mismo nombre y apellido ya existe. Por favor, ingresa datos diferentes.';
                    mensajeError.classList.remove('d-none');
                    return;
                } else {
                    mensajeError.classList.add('d-none');
                }
            } else {
                console.error('No se encontró el elemento mensajeError.');
            }
        
            if (this.clienteModificadoId) {
                let clienteModificado = this.listaClientes.find(cliente => cliente.id === this.clienteModificadoId);
        
                if (clienteModificado) {
                    clienteModificado.nombre = nombre;
                    clienteModificado.apellido = apellido;
                    clienteModificado.telefono = telefono;
                    clienteModificado.email = email;
                    clienteModificado.mascotas = mascotas;
                }
        
                this.clienteModificadoId = null;
            } else {
                let clienteNuevo = new Cliente(this.idIncremental, nombre, apellido, telefono, email, mascotas);
                this.listaClientes.push(clienteNuevo);
                this.idIncremental++;
            }
        
            localStorage.setItem('clientes', JSON.stringify(this.listaClientes));
            this.actualizarTabla();
        
            const modal = bootstrap.Modal.getInstance(document.getElementById('agregarCliente'));
            if (modal) {
                modal.hide();
            }
        
            this.limpiarFormulario();
        } catch (error) {
            console.error('Error al procesar el formulario:', error);
            this.mostrarMensaje(`Error al procesar el formulario: ${error.message}`);
        }
    }
    
    limpiarFormulario() {
        document.getElementById('formAgregarCliente').reset();
        document.getElementById('mascotasContainer').innerHTML = '';
        document.querySelector('#formAgregarCliente button[type="submit"]').textContent = 'Guardar';
    }

    actualizarTabla() {
        console.log('Actualizando tabla...');
        const tbody = document.querySelector('.tablaClientes .table tbody');
        if (!tbody) {
            console.error('No se encontró el tbody.');
            return;
        }
        tbody.innerHTML = '';
    
        this.listaClientes.forEach(cliente => {
            let fila = `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.mascotas.join(', ')}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    
        this.agregarEventosBotones();
    }
    agregarEventosBotones() {
        document.querySelectorAll('.btn-modificar').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const id = parseInt(event.target.getAttribute('data-id'));
                this.abrirModalModificar(id);
            });
        });
    
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const id = parseInt(event.target.getAttribute('data-id'));
                this.confirmarEliminacion(id);
            });
        });
    }

    abrirModalModificar(id) {
        const cliente = this.listaClientes.find(cliente => cliente.id === id);
        if (!cliente) {
            console.error('Cliente no encontrado.');
            return;
        }
    
        this.clienteModificadoId = id;
    
        document.getElementById('nombreCliente').value = cliente.nombre;
        document.getElementById('apellidoCliente').value = cliente.apellido;
        document.getElementById('telefonoCliente').value = cliente.telefono;
        document.getElementById('emailCliente').value = cliente.email;
    
        const mascotasContainer = document.getElementById('mascotasContainer');
        mascotasContainer.innerHTML = '';
        cliente.mascotas.forEach(mascota => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control mb-1';
            input.name = 'mascotas';
            input.value = mascota;
            input.placeholder = 'Nombre de la mascota';
            input.required = true;
            mascotasContainer.appendChild(input);
        });
    
        document.querySelector('#formAgregarCliente button[type="submit"]').textContent = 'Modificar';
    
        const modal = new bootstrap.Modal(document.getElementById('agregarCliente'));
        modal.show();
    }

    confirmarEliminacion(id) {
        const confirmarModal = new bootstrap.Modal(document.getElementById('confirmarEliminar'));
        confirmarModal.show();
    
        document.getElementById('confirmarEliminarBtn').onclick = () => {
            this.eliminarCliente(id);
            confirmarModal.hide();
        };
    }

    inicializarBusqueda() {
        const formBuscar = document.getElementById('formBuscarCliente');
        const resultadosBusqueda = document.getElementById('resultadosBusqueda');

        if (formBuscar) {
            formBuscar.addEventListener('submit', (event) => {
                event.preventDefault();
                const criterio = document.getElementById('criterioBusqueda').value.trim().toLowerCase();
                this.buscarCliente(criterio, resultadosBusqueda);
            });
        } else {
            console.error('No se encontró el formulario de búsqueda.');
        }
    }

    buscarCliente(criterio, resultadosBusqueda) {
        resultadosBusqueda.innerHTML = '';

        if (criterio === '') {
            resultadosBusqueda.textContent = 'Por favor, ingrese un criterio de búsqueda.';
            return;
        }

        const resultados = this.listaClientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(criterio) ||
            cliente.apellido.toLowerCase().includes(criterio) ||
            cliente.telefono.includes(criterio) ||
            cliente.email.toLowerCase().includes(criterio)
        );

        if (resultados.length > 0) {
            resultados.forEach(cliente => {
                const div = document.createElement('div');
                div.textContent = `ID: ${cliente.id}, Nombre: ${cliente.nombre}, Apellido: ${cliente.apellido}, Teléfono: ${cliente.telefono}, Email: ${cliente.email}, Mascotas: ${cliente.mascotas.join(', ')}`;
                resultadosBusqueda.appendChild(div);
            });
        } else {
            resultadosBusqueda.textContent = 'No se encontraron clientes que coincidan con el criterio de búsqueda.';
        }
    }
    
    eliminarCliente(id) {
        this.listaClientes = this.listaClientes.filter(cliente => cliente.id !== id);
        localStorage.setItem('clientes', JSON.stringify(this.listaClientes));
        this.actualizarTabla();
    }
    
    mostrarMensaje(mensaje) {
        const modalMensaje = new bootstrap.Modal(document.getElementById('modalMensaje'));
        document.getElementById('mensajeContenido').textContent = mensaje;
        modalMensaje.show();
    }
}

let misClientes = new Clientes();