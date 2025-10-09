async function fetchCategoryProducts(category) {
  // Attempt API first (placeholder base URL). If fails, fallback to local JSON
  const searchTerm = encodeURIComponent(category);
  const apiUrl = `/products/search/${searchTerm}`; // would need proxy/backend in real scenario
  try {
    const apiRes = await fetch(apiUrl, { headers: { 'Accept': 'application/json' }});
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (Array.isArray(data) && data.length) return normalizeApiData(data);
    }
    throw new Error('Falling back to local data');
  } catch (e) {
    return fetchLocalJson(category);
  }
}

function normalizeApiData(items) {
  // Map external API shape to internal simplified fields
  return items.map(it => ({
    id: it.Id || it.id || it.sku || crypto.randomUUID(),
    name: it.NameWithoutBrand || it.title || it.name,
    brand: it.Brand?.Name || it.brand || 'Brand',
    image: it.Image || it.image || it.thumbnail || '/images/noun_Tent_2517.svg',
    price: it.FinalPrice || it.price || it.ListPrice || 0,
    original: it.SuggestedRetailPrice || it.ListPrice || it.price || null
  }));
}

async function fetchLocalJson(category) {
  const map = {
    'tents': '../json/tents.json',
    'backpacks': '../json/backpacks.json',
    'sleeping-bags': '../json/sleeping-bags.json',
    'hammocks': '../json/hammocks.json'
  };
  const path = map[category];
  if (!path) return [];
  const res = await fetch(path);
  if (!res.ok) return [];
  const data = await res.json();
  return data.map(p => ({
    id: p.Id,
    name: p.NameWithoutBrand || p.Name,
    brand: p.Brand?.Name || 'Brand',
    image: p.Image,
    price: p.FinalPrice || p.ListPrice,
    original: p.SuggestedRetailPrice || null
  }));
}

function renderProducts(products) {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  if (!products.length) {
    list.innerHTML = '<li>No products found.</li>';
    return;
  }
  products.forEach(prod => {
    const li = document.createElement('li');
    li.className = 'product-card';
    li.innerHTML = `
      <a href="/product_pages/${buildProductFile(prod.name)}">
        <img src="${prod.image}" alt="${prod.name}" />
        <h3 class="card__brand">${prod.brand}</h3>
        <h2 class="card__name">${prod.name}</h2>
        ${priceMarkup(prod)}
      </a>
    `;
    list.appendChild(li);
  });
}

function buildProductFile(name) {
  // naive slug mapping for existing static pages (tents only). Could be improved.
  return slugify(name) + '.html';
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function priceMarkup(p) {
  if (p.original && p.original > p.price) {
    const disc = Math.round((1 - p.price / p.original) * 100);
    return `<p class="product-card__price"><span class="price-original">$${p.original.toFixed(2)}</span><span class="price-final">$${p.price.toFixed(2)}</span><span class="price-badge">-${disc}%</span></p>`;
  }
  return `<p class="product-card__price">$${p.price.toFixed(2)}</p>`;
}

async function init() {
  const main = document.querySelector('main');
  const category = main?.dataset.category;
  const statusEl = document.getElementById('category-status');
  if (!category) return;
  statusEl.textContent = 'Loading products...';
  const products = await fetchCategoryProducts(category);
  renderProducts(products);
  statusEl.textContent = `${products.length} product(s)`;
}

document.addEventListener('DOMContentLoaded', init);
