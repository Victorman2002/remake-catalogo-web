import { getAllProductos, fetchFirstImageName, fetchImage } from "./apiCalls.js";

//Array donde estarán cacheados los productos filtrados por la acción del usuario
let filteredProducts = [];
let pageIsShowingFilteredProducts = false;
let currentPage = 1;
let totalPages;

document.addEventListener('DOMContentLoaded', async () => {

    await chargeProductsToCache();
    await generateCards(getProductsListFromSessionLocalStorage(), 12);

    const searchButon = document.getElementById('btn-search');
    const searchEnter = document.getElementById('input-search');

    searchButon.addEventListener('click', () => handleSearch(getProductsListFromSessionLocalStorage()));

    searchEnter.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch(getProductsListFromSessionLocalStorage());
        }
    });

    //Añadir eventListners a los botones del nav de categorias que filtraran los productos
    const navbtns = document.querySelectorAll('.nav-category-btn');
    navbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            //Añadir al h3 la categoria a la cual el usuario ha hecho click
            const categoriaText = document.getElementById('categoria-actual');
            categoriaText.innerText = btn.getAttribute('data-filter');
            FilterByCategory(btn.getAttribute('data-filter'));
        });
    })

})

export async function generateCards(productsList, itemsPerPage) {
    let products = productsList;
    totalPages = Math.ceil(products.length / itemsPerPage);

    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    // Actualiza la visualización de las flechas cuando se genera la página
    updatePaginationButtons();
    await renderCurrentPage(itemsPerPage, products);

    // Maneja el clic en la flecha de retroceso
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePaginationButtons();
            renderCurrentPage(itemsPerPage, products);
        }
    });

    // Maneja el clic en la flecha de avance
    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePaginationButtons();
            if (pageIsShowingFilteredProducts) {
                products = filteredProducts;
                renderCurrentPage(itemsPerPage, products);
            } else {
                renderCurrentPage(itemsPerPage, products);
            }
        }
    });
}

async function renderCard(product) {
    // Obtener la URL de la imagen para el producto actual
    let imageName = await fetchFirstImageName(product.idProducto);
    imageName = imageName.url;
    let imageSrc = await fetchImage(imageName);

    cardsContainer.innerHTML += `
    <div class="col-lg-4 col-md-6 col-sm-6">
        <a href="./productoDetalle.html?id=${product.idProducto}" class="card-link">
            <div class="card">
            <h3 class="card-name">${product.nombre}</h3>
                <div id="image-card-container">
                <img src="${imageSrc}" class="card-img-top" alt="Image Product">
                </div>
                <div class="card-body">
                    <p class="card-price"><span class="not-price">Aqui: </span>
                        ${(product.precio && typeof product.precio === 'number') ? (product.precio).toFixed(2) : parseFloat(product.precio).toFixed(2)}&euro;<br>
                        <span class="not-price">Amazon: </span><span class="texto-tachado">${product.precioAmazon}&euro;</span></p>
                    <p class="card-description">${product.descripcion}</p>
                </div>
            </div>
        </a>
    </div>
`;
}

// Renderiza las tarjetas para la página actual
async function renderCurrentPage(itemsPerPage, products) {
    chargeAnimation(true)
    const paginationContainer = document.getElementById('page-navigation');
    paginationContainer.style.display = 'none';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);

    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    for (let i = startIndex; i < endIndex; i++) {
        const product = products[i];
        await renderCard(product);
    }

    paginationContainer.style.display = 'block';
    chargeAnimation(false)
}

// Actualiza la visualización de las flechas de acuerdo a la página actual
function updatePaginationButtons() {
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    if (currentPage === 1) {
        prevPageButton.classList.add('disabled');
        prevPageButton.style.opacity = '10%';
    } else {
        prevPageButton.classList.remove('disabled');
        prevPageButton.style.opacity = '100%';
    }

    if (currentPage === totalPages) {
        nextPageButton.classList.add('disabled');
        nextPageButton.style.opacity = '10%';
    } else {
        nextPageButton.classList.remove('disabled');
        nextPageButton.style.opacity = '100%';
    }
}

async function chargeProductsToCache() {
    try {
        let productListJSON = await getAllProductos(); // Obtener los datos en formato JSON o cadena JSON
        if (typeof productListJSON === 'string') {
            productListJSON = JSON.parse(productListJSON); // Convertir la cadena JSON en objeto JavaScript si es necesario
        }
        sessionStorage.setItem('cachedProductList', JSON.stringify(productListJSON)); // Guardar la lista de productos en sessionStorage
    } catch (error) {
        console.error('Error al cargar productos en caché:', error);
    }
}

function getProductsListFromSessionLocalStorage() {
    const cachedProductListJSON = sessionStorage.getItem('cachedProductList');
    if (cachedProductListJSON) {
        return JSON.parse(cachedProductListJSON);
    } else {
        return null;
    }
}

function handleSearch() {
    const products = getProductsListFromSessionLocalStorage();
    const searchInput = document.getElementById('input-search');
    const searchTerm = searchInput.value.toLowerCase();

    filteredProducts = products.filter((product) => {
        return product.nombre.toLowerCase().includes(searchTerm);
    });

    if (filteredProducts.length === 0) {
        alert('No se han encontrado productos que coincidan')
    } else {
        generateCards(filteredProducts, 12);
    }
}

function FilterByCategory(clickedCategory) {
    const products = getProductsListFromSessionLocalStorage();
    if (clickedCategory === 'Todos') {
        pageIsShowingFilteredProducts = false;
        generateCards(getProductsListFromSessionLocalStorage(), 12);
    } else {
        filteredProducts = products.filter((product) => {
            return product.categoria === clickedCategory;
        });
        pageIsShowingFilteredProducts = true;
        generateCards(filteredProducts, 12);
    }
}
 
function chargeAnimation(itsVisible) {
    const animation = document.getElementById('charge-animation');
    const cardsContainer = document.getElementById('cardsContainer');

    if (itsVisible) {
        animation.style.display = 'block';
        cardsContainer.classList.add('invisible');
    } else {
        animation.style.display = 'none';
        cardsContainer.classList.remove('invisible');
    }
}