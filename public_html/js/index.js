document.addEventListener('DOMContentLoaded', () => {
    const productLink = document.getElementById('product-link');
    //const verProductosBtn = document.getElementById('btn-productos');
    highlightLink(productLink);
    //highlightLink(verProductosBtn);
})

function highlightLink(element) {
    setInterval(() => {
        element.classList.toggle('white'); //Toggle change the class if present, if not it add it.
        element.classList.toggle('black');
    }, 1000);
}

