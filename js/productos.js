class Producto {
    constructor(marca, tipo, precio, id) {
        this.marca = marca;
        this.tipo = tipo;
        this.precio = precio;
        this.id = id;
    }
}

class Productos {
    constructor() {
        this.listaDeProductos = [];
    }

    agregarProducto() {
        let marca = prompt("Ingrese la marca del producto:");
        let tipo = prompt("Ingrese el tipo de producto:");
        let precio = parseFloat(prompt("Ingrese el precio del producto:"));
        let id = parseInt(prompt("Ingrese el ID del producto:"));

        let productoNuevo = new Producto(marca, tipo, precio, id);
        this.listaDeProductos.push(productoNuevo);
        /*Guardo producto en json*/
        let guardoProducto = JSON.stringify(productoNuevo);
        localStorage.setItem(`producto_${id}`,guardoProducto);
        alert(`Producto ${marca} agregado correctamente.`);
        this.listarProductos();
    }

    buscarProducto() {
        let id = parseInt(prompt("Ingrese el ID del producto a buscar:"));
        let productoEncontrado = this.listaDeProductos.find(producto => producto.id === id);
        if (productoEncontrado) {
            alert(`Producto encontrado: ${productoEncontrado.marca}, ${productoEncontrado.tipo}, ${productoEncontrado.precio}`);
        } else {
            alert("El producto no existe.");
        }
    }

    eliminaProducto() {
        let id = parseInt(prompt("Ingrese el ID del producto a eliminar:"));
        let productoEncontrado = this.listaDeProductos.find(producto => producto.id === id);
    
        if (!productoEncontrado) {
            alert(`No se encontro un producto con el ID ${id}.`);
            return;
        }
    
        let confirmacion = confirm(`¿Estas seguro de eliminar el producto con ID ${id}?`);
        if (confirmacion) {
            this.listaDeProductos = this.listaDeProductos.filter(producto => producto.id !== id);
            alert("Producto eliminado.");
            /*Elimino producto en json*/
            let eliminorProducto = JSON.stringify(productoEncontrado);
            localStorage.removeItem(`producto_${id}`,eliminorProducto);
            
            this.listarProductos();
        } else {
            alert("No se eliminó el producto.");
        }
    }
    

    listarProductos(){
        for (let i=0; i < this.listaDeProductos.length; i++) {
            console.table(this.listaDeProductos[i]); 
            
        }
    };
}

let miProductos = new Productos();
miProductos.agregarProducto();
miProductos.listarProductos();
miProductos.buscarProducto();
miProductos.eliminaProducto();
miProductos.listarProductos();
