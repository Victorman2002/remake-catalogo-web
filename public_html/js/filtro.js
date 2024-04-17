import { generateCards } from "./products.js";

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
        generateCards(filteredProducts);
    }
}

export function FilterByCategory(cachedProductList, clickedCategory) {
    let filteredProducts = [];

    if (clickedCategory === 'Todos') {
        generateCards(cachedProductList);
    } else {
        filteredProducts = cachedProductList.filter((product) => {
            return product.categoria === clickedCategory;
        });
        generateCards(filteredProducts);
    }
}
