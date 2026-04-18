export default function ProductCard({ product, actionLabel = "Add to cart", onAction, secondaryActionLabel, onSecondaryAction }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.title} /> : <span>{product.title.charAt(0)}</span>}
      </div>
      <div className="product-body">
        <div className="product-title-row">
          <h3>{product.title}</h3>
          <span className="price">{product.formattedPrice}</span>
        </div>
        <p>{product.description || "No style description provided."}</p>
        <div className="meta-row">
          <span>{product.categoryName}</span>
          <span>Tax {product.taxPercent}%</span>
          <span>Stock {product.stock}</span>
        </div>
        <div className="product-actions">
          <button type="button" className="primary-btn full-width" onClick={() => onAction(product)}>
            {actionLabel}
          </button>
          {onSecondaryAction ? (
            <button type="button" className="secondary-btn full-width" onClick={() => onSecondaryAction(product)}>
              {secondaryActionLabel || "Buy now"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
