import { getAllProductos, fetchFirstImageName, fetchImage } from "./apiCalls.js";
import { handleSearch, FilterByCategory } from "./filtro.js";

//Array donde estarán cacheados los productos del servidor
let cachedProductList = [];
let cardIndexShown = 0;

document.addEventListener('DOMContentLoaded', async () => {

    chargeAnimation(true)

    await chargeProductsToChache();
    await generateCards(cachedProductList);

    const searchButon = document.getElementById('btn-search');
    const searchEnter = document.getElementById('input-search');

    searchButon.addEventListener('click', () => handleSearch(cachedProductList));

    searchEnter.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch(cachedProductList);
        }
    });

    //Añadir eventListners a los botones del nav de categorias que filtraran los productos
    const navbtns = document.querySelectorAll('.nav-category-btn');
    navbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            //Añadir al h3 la categoria a la cual el usuario ha hecho click
            const categoriaText = document.getElementById('categoria-actual');
            categoriaText.innerText = btn.getAttribute('data-filter');
            FilterByCategory(cachedProductList, btn.getAttribute('data-filter'));
        });
    })

})

async function chargeProductsToChache() {
    cachedProductList = await getAllProductos();
}

export async function generateCards(productsList) {

    chargeAnimation(true)

    cardIndexShown = 0;

    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    // Utilizamos un bucle for...of para poder utilizar await dentro del cuerpo del bucle
    for (const product of productsList) {

        cardIndexShown++;

        // Obtener la URL de la imagen para el producto actual
        let imageName = await fetchFirstImageName(product.idProducto);
        imageName = imageName.url;
        let imageSrc = await fetchImage(imageName);

        // Creamos una función asíncrona dentro del bucle que espera la resolución de getImagesFromProduct
        async function renderCard() {
            cardsContainer.innerHTML += `
                <div class="col-lg-4 col-md-6 col-sm-6">
                    <a href="./productoDetalle.html?id=${product.idProducto}" class="card-link">
                        <div class="card" id="${cardIndexShown}">
                        <h3 class="card-name">${product.nombre}</h3>
                            <div id="image-card-container">
                            <img src="../img/backGrounds/placeholder-image.jpg" data-src="${imageSrc}" class="card-img-top" alt="Image Product">
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

        // Esperamos la resolución de la función asíncrona antes de continuar con la siguiente iteración del bucle
        await renderCard();

        if (cardIndexShown % 12 == 0) {
            //Parar la animacion cuando se hayan generado las cards
            chargeAnimation(false);
        }

    }

    // Intersection Observer para que solo si las cartas estan visibles se
    // cargen sus imagenes
    observeIntersection('.card');

    //Para cuando se muestran menos de 12 cards se para tambien la animacion
    if (cardIndexShown < 12) {
        chargeAnimation(false);
    }
}

// Función para observar la intersección de las cartas y cargar las imágenes
function observeIntersection(selector) {

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Cambia este valor según tus necesidades
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                console.log('Carta ' + card.id + ' en pantalla')
                const image = card.querySelector('img');
                const imageUrl = image.getAttribute('data-src');
                image.src = imageUrl;
                //observer.unobserve(card);
            } else if (!entry.isIntersecting) {
                const card = entry.target;
                console.log('Carta ' + card.id + ' fuera de pantalla')
                const image = card.querySelector('img');
                image.src = '';
            }
        });
    }, options);

    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        observer.observe(card);
    });
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
