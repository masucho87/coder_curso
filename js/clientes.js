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
        let nombre = prompt("Ingrese el nombre del cliente");
        let apellido = prompt("Ingrese el apellido del cliente");
        let telefono = parseInt(prompt("Ingrese el telefono del cliente"));
        let email = prompt("Ingrese el email del cliente");
        // Crear un nuevo cliente
        let clienteNuevo = new Cliente(nombre, apellido, telefono, email);
        this.listaClientes.push(clienteNuevo);
        // Guardar en localStorage
        this.guardoCliente(clienteNuevo);
        alert(`Cliente ${nombre} agregado correctamente`);
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
    }
}


