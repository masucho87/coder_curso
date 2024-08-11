class Producto {
    constructor(id, marca, tipo, precio) {
        this.id = id;
        this.marca = marca;
        this.tipo = tipo;
        this.precio = precio;
    }
}

class Productos {
    constructor() {
        this.listaDeProductos = [];
    }

    agregarProducto() {
        let id = parseInt(prompt("Ingrese el ID del producto:"));
        let marca = prompt("Ingrese la marca del producto:");
        let tipo = prompt("Ingrese el tipo de producto:");
        let precio = parseFloat(prompt("Ingrese el precio del producto:"));

        let productoNuevo = new Producto(id, marca, tipo, precio);

        // Verifico si el producto ya está agregado, si no existe lo agrego
        let verfcoProducto = this.listaDeProductos.some(producto => producto.marca === marca && producto.tipo === tipo);
        if (verfcoProducto) {
            alert('El producto que quiere agregar ya existe.');
        } else {
            this.listaDeProductos.push(productoNuevo);
            // Guardo producto en JSON
            localStorage.setItem(`producto_${id}`, JSON.stringify(productoNuevo));
            alert(`Producto ${marca} agregado correctamente.`);
            this.listarProductos();
        }
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
            alert(`No se encontró un producto con el ID ${id}.`);
            return;
        }
    
        let confirmacion = confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`);
        if (confirmacion) {
            this.listaDeProductos = this.listaDeProductos.filter(producto => producto.id !== id);
            localStorage.removeItem(`producto_${id}`); // Solo necesitas la clave aquí
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


    //Deria ir al modulo de ventas?

    //Funcion para calclular si el precio es con tarjeta hay un 10% de recargo
    precioConTarjeta(){
        return this.precio * 1.0;
    };
    //funcion para precio al contado, se le descuenta el IVA
    precioAlContado(){
        const IVA = 0.21;
        return this.precio / (1 + IVA);
    };
}

let miProductos = new Productos();
