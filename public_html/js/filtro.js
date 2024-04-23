import { generateCards } from "./products.js";

//PROBLAMENTE LA SOLUCION SEA PASAR TODO ESTE SCRIP AL PRODUCTS.JS

export function handleSearch(cachedProductList) {
    const searchInput = document.getElementById('input-search');
    const searchTerm = searchInput.value.toLowerCase();
    let filteredProducts = [];

    filteredProducts = cachedProductList.filter((product) => {
        return product.nombre.toLowerCase().includes(searchTerm)
    });

    if (filteredProducts.length === 0) {
        alert('No se han encontrado productos que coincidan')
    } else {
        generateCards(filteredProducts, 12);
    }
}

export function FilterByCategory(cachedProductList, clickedCategory) {
    let filteredProducts = [];

    if (clickedCategory === 'Todos') {
        generateCards(cachedProductList, 12);
    } else {
        filteredProducts = cachedProductList.filter((product) => {
            return product.categoria === clickedCategory;
        });
        generateCards(filteredProducts, 12);
    }
}
