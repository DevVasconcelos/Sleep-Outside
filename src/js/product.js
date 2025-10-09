import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

// Fonte de dados para a categoria atual (tents). Se futuramente houver outras categorias, isso pode ser dinâmico.
const dataSource = new ProductData("tents");

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}

// Handler do botão Add to Cart
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  if (product) addProductToCart(product);
}

// Calcula e aplica o desconto no bloco de preço
async function applyDiscount() {
  const addBtn = document.getElementById("addToCart");
  if (!addBtn) return;
  const productId = addBtn.dataset.id;
  if (!productId) return;

  const product = await dataSource.findProductById(productId);
  if (!product) return;

  // Campos possíveis no JSON: SuggestedRetailPrice (preço original), FinalPrice (preço final) / ListPrice (fallback)
  const original = Number(product.SuggestedRetailPrice) || Number(product.ListPrice) || Number(product.FinalPrice);
  const final = Number(product.FinalPrice) || Number(product.ListPrice) || original;
  const priceEl = document.querySelector('.product-card__price');
  if (!priceEl) return;

  // Se não há desconto real, apenas garante formatação consistente
  if (!original || !final || final >= original) {
    priceEl.textContent = `$${final.toFixed(2)}`;
    return;
  }

  const discountPercent = Math.round((1 - final / original) * 100);
  priceEl.innerHTML = `\n    <span class="price-original">$${original.toFixed(2)}</span>\n    <span class="price-final">$${final.toFixed(2)}</span>\n    <span class="price-badge" aria-label="discount">-${discountPercent}%</span>\n  `;
}

// Inicialização após DOM pronto (garante que elementos existam)
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById("addToCart");
  if (addBtn) addBtn.addEventListener("click", addToCartHandler);
  applyDiscount();
});

export { applyDiscount };
// Export existente para eventuais testes
export { ProductData };

// Mantém compatibilidade com export anterior (se alguém importar Alert por engano)
// export { Alert };
