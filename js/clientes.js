class Cliente {
    constructor(nombre, apellido, telefono, email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }
}

class Clientes {
    constructor() {
        // Carga los clientes desde localStorage
        this.listaClientes = this.cargoClientes();
    }

    agregarCliente() {
        let nombre = prompt("Ingrese el nombre del cliente").toUpperCase();
        let apellido = prompt("Ingrese el apellido del cliente").toUpperCase();
        let telefono = parseInt(prompt("Ingrese el telefono del cliente"));
        let email = prompt("Ingrese el email del cliente");
        
        // Crear un nuevo cliente
        let clienteNuevo = new Cliente(nombre, apellido, telefono, email);
        
        // Verificar si el cliente ya existe
        let verificoCliente = this.listaClientes.some(cliente => cliente.nombre === nombre && cliente.apellido === apellido);
        
        if (verificoCliente) {
            console.log(`El cliente ${nombre} ${apellido} ya existe`);
            alert(`El cliente ${nombre} ${apellido} ya existe`);
        } else {
            // Agregar el cliente si no existe
            this.listaClientes.push(clienteNuevo);
            // Guardar en localStorage
            this.guardoCliente(clienteNuevo);
            this.actualizarTabla();
            alert(`Cliente ${nombre} ${apellido} agregado correctamente`);
        }
    }
    
    eliminaCliente() {
        let nombre = prompt("Ingrese el nombre del cliente que quiere eliminar");
        let buscoCliente = this.listaClientes.find(cliente => cliente.nombre === nombre);

        if (!buscoCliente) {
            alert(`No se encontró el cliente ${nombre}`);
            return;
        }
        let confirma = confirm(`¿Estás seguro de eliminar el cliente ${nombre}?`);
        if (confirma) {
            this.listaClientes = this.listaClientes.filter(cliente => cliente.nombre !== nombre);
            this.eliminaClienteStorage(nombre);
            alert("Cliente eliminado.");
        }
    }

    buscarCliente(){
        let nombre = prompt("Ingrese el nombre del cliente a buscar");
        let buscar = this.listaClientes.find(cliente => cliente.nombre === nombre);

        if(!buscar) {
            alert(`No se encontró el cliente ${nombre}`);
        } else {
            alert(`Cliente encontrado: ${buscar.nombre}, ${buscar.apellido}, ${buscar.telefono}, ${buscar.email}`);
        }
    }

    // Funcion para guardar un cliente en localStorage.
    guardoCliente(cliente) {
        let clienteJson = JSON.stringify(cliente);
        localStorage.setItem(`Cliente_${cliente.nombre}`, clienteJson);
    }

    // Funcion para eliminar un cliente de localStorage.
    eliminaClienteStorage(nombre) {
        localStorage.removeItem(`Cliente_${nombre}`);
    }

    // Funcion para cargar clientes desde localStorage.
    cargoClientes() {
        let clientes = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith('Cliente_')) {
                let clienteJson = localStorage.getItem(key);
                let cliente = JSON.parse(clienteJson);
                clientes.push(cliente);
            }
        }
        return clientes;
    };

    listarClientes(){
        this.listaClientes.forEach(cliente => {
            console.table(cliente)
        })
    }

    actualizarTabla() {
        //Accedo a clase tabla con tbody
        const tbody = document.querySelector('.tablaClientes tbody');
        tbody.innerHTML = '';
    
        this.listaClientes.forEach(cliente => {
            let fila = `
                <tr>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.email}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    }
}

let miCliente = new Clientes();
