"use client"

import { Plus, Star } from "lucide-react"

export default function ProductCard({ product, onAddToTracking }) {
  const imageSrc = product.image || product.thumbnail || "/placeholder.svg"

  return (
    <div className="card-base flex flex-col h-full hover:border-primary transition">
      {/* Product Image */}
      <div className="w-full h-48 bg-surface-light rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
      </div>

      {/* Product Info */}
      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{product.title}</h3>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-foreground-muted"}
              />
            ))}
          </div>
          <span className="text-xs text-foreground-muted">({product.reviews} reviews)</span>
        </div>
      )}

      <p className="text-sm text-foreground-muted mb-4 flex-grow">{product.seller || "Unknown Seller"}</p>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-primary">
          {product.price != null ? `$${product.price}` : "Precio no disponible"}
        </p>
        {product.originalPrice && (
          <p className="text-sm text-foreground-muted line-through">${product.originalPrice}</p>
        )}
      </div>

      {/* Add to Tracking Button */}
      <button
        onClick={() => onAddToTracking(product)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add to Tracking
      </button>
    </div>
  )
}
