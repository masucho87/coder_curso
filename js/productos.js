class Producto {
    constructor(id, marca, nombre, tipo, precio) {
        this.id = id;
        this.marca = marca;
        this.nombre = nombre;
        this.tipo = tipo;
        this.precio = precio;
    }
}

class Productos {
    constructor() {
        this.listaDeProductos = [];
        this.idIncremental = 1;
    }

    agregarProducto() {
        let marca = prompt("Ingrese la marca del producto:");
        let nombre = prompt("Ingrese el nombre del producto:");
        let tipo = prompt("Ingrese el tipo de producto:");
        let precio = parseFloat(prompt("Ingrese el precio del producto:"));

        let productoNuevo = new Producto(this.idIncremental, marca, nombre, tipo, precio);

        let verfcoProducto = this.listaDeProductos.some(producto => 
            producto.marca === marca && producto.nombre === nombre && producto.tipo === tipo);
        
        if (verfcoProducto) {
            alert('El producto que quiere agregar ya existe.');
        } else {
            this.listaDeProductos.push(productoNuevo);
            localStorage.setItem(`producto_${nombre}`, JSON.stringify(productoNuevo));
            alert(`Producto ${marca} agregado correctamente.`);
            this.idIncremental++;
            this.actualizarTabla();
        }
    }

    buscarProducto() {
        let nombre = prompt("Ingrese el nombre del producto a buscar:");
        let productoEncontrado = this.listaDeProductos.find(producto => producto.nombre === nombre);
        if (productoEncontrado) {
            alert(`Producto encontrado: ${productoEncontrado.marca}, ${productoEncontrado.nombre}, ${productoEncontrado.tipo}, ${productoEncontrado.precio}`);
        } else {
            alert("El producto no existe.");
        }
    }

    eliminaProducto() {
        let nombre = prompt("Ingrese el nombre del producto a eliminar:");
        let productoEncontrado = this.listaDeProductos.find(producto => producto.nombre === nombre);
    
        if (!productoEncontrado) {
            alert(`No se encontró un producto con el nombre ${nombre}.`);
            return;
        }
    
        let confirmacion = confirm(`¿Estás seguro de eliminar el producto con el nombre ${nombre}?`);
        if (confirmacion) {
            this.listaDeProductos = this.listaDeProductos.filter(producto => producto.nombre !== nombre);
            localStorage.removeItem(`producto_${nombre}`);
            alert("Producto eliminado.");
            this.listarProductos();
        } else {
            alert("No se eliminó el producto.");
        }
    }

    listarProductos() {
        if (this.listaDeProductos.length > 0) {
            console.table(this.listaDeProductos);
        } else {
            console.log("No hay productos para listar.");
        }
    }

    actualizarTabla() {
        //Accedo a clase tabla con tbody
        const tbody = document.querySelector('.tabla tbody');
        tbody.innerHTML = '';
    
        this.listaDeProductos.forEach(producto => {
            let fila = `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.marca}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.tipo}</td>
                    <td>${producto.precio}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    }

    precioConTarjeta(precio){
        return precio * 1.10;
    }

    precioAlContado(precio){
        const IVA = 0.21;
        return precio / (1 + IVA);
    }
}

let miProductos = new Productos();
