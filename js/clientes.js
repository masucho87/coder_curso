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
        this.listaClientes = JSON.parse(localStorage.getItem('clientes')) || [];
        this.idIncremental = this.listaClientes.length > 0 ? this.listaClientes[this.listaClientes.length - 1].id + 1 : 1;
        this.mascotaCount = 0;
        this.clienteModificadoId = null;

        document.addEventListener('DOMContentLoaded', () => {
            this.inicializarFormulario();
            this.actualizarTabla();
        });
    }

    inicializarFormulario() {
        const form = document.getElementById('formAgregarCliente');
        const addMascotaBtn = document.getElementById('addMascotaBtn');
        const botonAgregar = document.getElementById('botonAgregar');

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.procesarFormulario();
            });
        } else {
            console.error('No se encontró el formulario.');
        }

        if (addMascotaBtn) {
            addMascotaBtn.addEventListener('click', () => {
                this.agregarMascotaCampo();
            });
        } else {
            console.error('No se encontró el botón de agregar mascota.');
        }

        if (botonAgregar) {
            botonAgregar.addEventListener('click', () => {
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

    procesarFormulario() {
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
    }
    
    limpiarFormulario() {
        document.getElementById('formAgregarCliente').reset();
        document.getElementById('mascotasContainer').innerHTML = '';
        document.querySelector('#formAgregarCliente button[type="submit"]').textContent = 'Guardar';
    }

    actualizarTabla() {
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
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="misClientes.seleccionarCliente(${cliente.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="misClientes.eliminarCliente(${cliente.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    }

    seleccionarCliente(id) {
        const cliente = this.listaClientes.find(cliente => cliente.id === id);
        if (cliente) {
            document.getElementById('nombreCliente').value = cliente.nombre;
            document.getElementById('apellidoCliente').value = cliente.apellido;
            document.getElementById('telefonoCliente').value = cliente.telefono;
            document.getElementById('emailCliente').value = cliente.email;

            const mascotasContainer = document.getElementById('mascotasContainer');
            if (mascotasContainer) {
                mascotasContainer.innerHTML = '';
                cliente.mascotas.forEach(mascota => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'form-control mb-1';
                    input.name = 'mascotas';
                    input.value = mascota;
                    mascotasContainer.appendChild(input);
                });
            } else {
                console.error('No se encontró el contenedor de mascotas.');
            }

            const modal = new bootstrap.Modal(document.getElementById('agregarCliente'));
            if (modal) {
                modal.show();
            }

            document.querySelector('#formAgregarCliente button[type="submit"]').textContent = 'Guardar cambios';
            this.clienteModificadoId = cliente.id;
        }
    }

    eliminarCliente(id) {
        const confirmarEliminar = new bootstrap.Modal(document.getElementById('confirmarEliminar'));
        confirmarEliminar.show();
    
        document.getElementById('confirmarEliminarBtn').onclick = () => {
            this.listaClientes = this.listaClientes.filter(cliente => cliente.id !== id);
            localStorage.setItem('clientes', JSON.stringify(this.listaClientes));
            this.actualizarTabla();
            confirmarEliminar.hide();
        };
    }

    mostrarModalMensaje(mensaje) {
        const modalMensaje = new bootstrap.Modal(document.getElementById('modalMensaje'));
        const mensajeElemento = document.getElementById('mensajeContenido');
        mensajeElemento.textContent = mensaje;
        modalMensaje.show();
    }
}

let misClientes = new Clientes();
