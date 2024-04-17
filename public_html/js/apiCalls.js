
async function getAllProductos() {
    try {
        const response = await fetch('http://91.108.102.81:8080/productos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('No se han podido obtener los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

async function getProducto(productoId) {
    try {
        const response = await fetch(`http://91.108.102.81:8080/productos/${productoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('No se han podido obtener los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

async function getImagesFromProduct(productoId) {
    try {
        const response = await fetch(`http://91.108.102.81:8080/images/${productoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No se han podido obtener los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

async function fetchFirstImageName(productoId) {
    try {
        const response = await fetch(`http://91.108.102.81:8080/firstImage/${productoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener la imagen');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
    }
}

async function fetchImage(imageName) {
    try {
        const response = await fetch(`http://91.108.102.81:3000/images/${imageName}`);
        if (!response.ok) {
            throw new Error('Error al obtener la imagen');
        }
        const imageBlob = await response.blob(); // Obtener la imagen como un Blob
        // Crear una URL para visualizar la imagen
        const imageObjectURL = URL.createObjectURL(imageBlob);
        return imageObjectURL;
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
    }
}


export { getAllProductos, getProducto, getImagesFromProduct, fetchFirstImageName, fetchImage };