document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '../json/clientes.json';
    const tableBody = document.querySelector('.tablaClientes tbody');
    const selectEliminar = document.getElementById('clienteSeleccionado');
    const formAgregar = document.getElementById('formAgregarCliente');
    const formEliminar = document.getElementById('formEliminarCliente');
    const formBuscar = document.getElementById('formBuscarCliente');
    const resultadoBusqueda = document.getElementById('resultadosBusqueda');

    let clientes = [];

    function guardarCliente() {
        console.log('Guardando clientes en localStorage:', clientes);
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }

    async function cargarClientes() {
        const clientesGuardados = localStorage.getItem('clientes');
        if (clientesGuardados) {
            console.log('Cargando clientes desde localStorage:', clientesGuardados);
            clientes = JSON.parse(clientesGuardados);
            mostrarClientes();
            llenarSelectEliminar();
        } else {
            console.log('Cargando clientes desde API');
            try {
                const response = await fetch(API_URL);
                clientes = await response.json();
                console.log('Clientes cargados desde API:', clientes);
                mostrarClientes();
                llenarSelectEliminar();
                guardarCliente();
            } catch (error) {
                console.error('Error al cargar clientes desde API:', error);
            }
        }
    }

    function eliminarClientesDeLocalStorage() {
        console.log('Eliminando clientes de localStorage');
        localStorage.removeItem('clientes');
    }

    function mostrarClientes() {
        console.log('Mostrando clientes en la tabla:', clientes);
        tableBody.innerHTML = '';
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.email}</td>
                <td>${cliente.mascotas.join(', ')}</td>
                <td><button class="btn btn-secondary btnModificar" data-id="${cliente.id}">Modificar</button></td>
            `;
            tableBody.appendChild(tr);
        });

        // Añadir evento a los botones de modificar
        document.querySelectorAll('.btnModificar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                mostrarModalModificar(id);
            });
        });
    }

    function llenarSelectEliminar() {
        console.log('Llenando select para eliminar con clientes:', clientes);
        selectEliminar.innerHTML = '<option value="">Seleccionar cliente</option>';
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = `${cliente.nombre} ${cliente.apellido}`;
            selectEliminar.appendChild(option);
        });
    }

    function agregarCliente(cliente) {
        console.log('Agregando cliente:', cliente);
        clientes.push(cliente);
        mostrarClientes();
        llenarSelectEliminar();
        guardarCliente();
    }

    async function mostrarModalModificar(id) {
        const cliente = clientes.find(c => c.id === id);
        if (cliente) {
            document.getElementById('modClienteId').value = cliente.id;
            document.getElementById('modNombreCliente').value = cliente.nombre;
            document.getElementById('modApellidoCliente').value = cliente.apellido;
            document.getElementById('modTelefonoCliente').value = cliente.telefono;
            document.getElementById('modEmailCliente').value = cliente.email;
            document.getElementById('modMascotasCliente').value = cliente.mascotas.join(', ');


            new bootstrap.Modal(document.getElementById('modificarCliente')).show();
        }
    }

    async function editarCliente(id, nombre, apellido, telefono, email, mascotas) {
        const index = clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            console.log('Cliente modificado:', { id, nombre, apellido, telefono, email, mascotas });
            clientes[index] = { id, nombre, apellido, telefono, email, mascotas };
            mostrarClientes();
            llenarSelectEliminar();
            guardarCliente(); 
            Swal.fire('Cliente modificado', '', 'success');
        }
    }

    async function eliminarCliente(id) {
        try {
            console.log('Eliminando cliente con id:', id);
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                clientes = clientes.filter(cliente => cliente.id !== id);
                mostrarClientes();
                llenarSelectEliminar();
                eliminarClientesDeLocalStorage();
                guardarCliente();  
                Swal.fire('Cliente eliminado', '', 'success');
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
        }
    }

    function buscarCliente(criterio) {
        console.log('Buscando clientes con criterio:', criterio);
        resultadoBusqueda.innerHTML = '';
        const resultado = clientes.filter(cliente => {
            return cliente.nombre.includes(criterio) ||
                cliente.apellido.includes(criterio) ||
                cliente.telefono.includes(criterio) ||
                cliente.email.includes(criterio);
        });

        if (resultado.length === 0) {
            resultadoBusqueda.innerHTML = '<p>No se encontraron resultados.</p>';
        } else {
            resultadoBusqueda.innerHTML = '<ul>' +
                resultado.map(c => `<li>${c.nombre} ${c.apellido} - ${c.telefono} - ${c.email} - Mascotas: ${c.mascotas.join(', ')}</li>`).join('') +
                '</ul>';
        }
    }

    formAgregar.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreCliente').value;
        const apellido = document.getElementById('apellidoCliente').value;
        const telefono = document.getElementById('telefonoCliente').value;
        const email = document.getElementById('emailCliente').value;
        const mascotas = Array.from(document.querySelectorAll('#mascotasContainer input[name="mascotas"]')).map(input => input.value);

        const nuevoCliente = {
            id: clientes.length ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
            nombre,
            apellido,
            telefono,
            email,
            mascotas
        };

        console.log('Formulario de agregar cliente enviado:', nuevoCliente);
        agregarCliente(nuevoCliente);
        Swal.fire('Cliente agregado', '', 'success');
        document.querySelector('#agregarCliente .btn-close').click();
    });

    formEliminar.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(selectEliminar.value);
        console.log('Formulario de eliminar cliente enviado con id:', id);
        if (id) {
            eliminarCliente(id);
        }
    });

    formBuscar.addEventListener('submit', (e) => {
        e.preventDefault();
        const criterio = document.getElementById('criterioBusqueda').value;
        console.log('Formulario de búsqueda enviado con criterio:', criterio);
        buscarCliente(criterio);
    });

    document.getElementById('agregarMascota').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control mb-1';
        input.name = 'mascotas';
        input.placeholder = 'Nombre de la mascota';
        document.getElementById('mascotasContainer').appendChild(input);
    });

    document.getElementById('formModificarCliente').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('modClienteId').value);
        const nombre = document.getElementById('modNombreCliente').value;
        const apellido = document.getElementById('modApellidoCliente').value;
        const telefono = document.getElementById('modTelefonoCliente').value;
        const email = document.getElementById('modEmailCliente').value;
        const mascotas = document.getElementById('modMascotasCliente').value.split(',').map(m => m.trim());

        console.log('Formulario de modificar cliente enviado:', { id, nombre, apellido, telefono, email, mascotas });
        editarCliente(id, nombre, apellido, telefono, email, mascotas);
        document.querySelector('#modificarCliente .btn-close').click();
    });

    cargarClientes();
});
