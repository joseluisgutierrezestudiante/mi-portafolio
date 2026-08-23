const productForm = document.querySelector('#product-form');
const productList = document.querySelector('#product-list');
const message = document.querySelector('#message');

async function loadProducts() {
    const response = await fetch('/api/productos');
    const products = await response.json();
    productList.innerHTML = products.map(product => `
        <tr>
            <td>${escapeHtml(product.nombre)}</td>
            <td>${escapeHtml(product.categoria)}</td>
            <td>$${product.precio.toFixed(2)}</td>
            <td class="${product.stock <= 5 ? 'low' : ''}">${product.stock}</td>
        </tr>
    `).join('');
    document.querySelector('#total').textContent = products.length;
    document.querySelector('#low-total').textContent = products.filter(product => product.stock <= 5).length;
}

productForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(productForm));
    data.precio = Number(data.precio);
    data.stock = Number(data.stock);
    const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        message.textContent = 'Revisa los datos del producto.';
        return;
    }
    productForm.reset();
    message.textContent = 'Producto guardado correctamente.';
    await loadProducts();
});

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
}

loadProducts().catch(() => {
    message.textContent = 'No se pudo conectar con la API.';
});
