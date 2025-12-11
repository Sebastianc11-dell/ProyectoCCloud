"use client"

import { useState, useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import Modal from "../components/Modal"
import { Search, Filter } from "lucide-react"
import { api } from "../services/api"

export default function Products() {
  const { register, watch, reset } = useForm({
    defaultValues: {
      search: "",
      category: "all",
      priceMin: "",
      priceMax: "",
      condition: "all",
      sortBy: "relevance",
    },
  })

  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [targetPrice, setTargetPrice] = useState("")
  const [trackingError, setTrackingError] = useState(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [importUrl, setImportUrl] = useState("")
  const [importStatus, setImportStatus] = useState(null)
  const [importLoading, setImportLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const formValues = watch()

  // Fetch products from API (debounced on search)
  useEffect(() => {
    const controller = new AbortController()
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await api.get("/api/products", {
          params: formValues.search ? { query: formValues.search } : {},
          signal: controller.signal,
        })
        setProducts(data || [])
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return
        setError("No pudimos cargar los productos")
      } finally {
        setLoading(false)
      }
    }
    const timeout = setTimeout(fetchProducts, 250)
    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [formValues.search, refreshKey])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (formValues.search) {
      result = result.filter((p) => p.title?.toLowerCase().includes(formValues.search.toLowerCase()))
    }

    // Category filter
    if (formValues.category !== "all") {
      result = result.filter((p) => p.category === formValues.category)
    }

    // Price filter
    if (formValues.priceMin) {
      result = result.filter((p) => Number(p.price) >= Number.parseInt(formValues.priceMin))
    }
    if (formValues.priceMax) {
      result = result.filter((p) => Number(p.price) <= Number.parseInt(formValues.priceMax))
    }

    // Condition filter
    if (formValues.condition !== "all") {
      result = result.filter((p) => p.condition === formValues.condition)
    }

    // Sort
    switch (formValues.sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        break
      case "price-desc":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
        break
      case "rating":
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
        break
      default:
        break
    }

    return result
  }, [formValues, products])

  const handleAddToTracking = (product) => {
    setSelectedProduct(product)
    setTargetPrice(product.price ?? "")
    setTrackingError(null)
    setIsModalOpen(true)
  }

  const handleConfirmTracking = async () => {
    if (!selectedProduct) return
    const priceValue = Number(targetPrice)
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setTrackingError("Ingresa un precio objetivo valido")
      return
    }
    try {
      setTrackingLoading(true)
      setTrackingError(null)
      await api.post("/api/tracking", {
        productId: selectedProduct.id,
        externalId: selectedProduct.externalId,
        targetPrice: priceValue,
      })
      setIsModalOpen(false)
      setSelectedProduct(null)
    } catch (err) {
      const message = err.response?.data?.message || "No pudimos agregar el producto al tracking"
      setTrackingError(message)
    } finally {
      setTrackingLoading(false)
    }
  }

  const handleImportProduct = async (e) => {
    e.preventDefault()
    if (!importUrl.trim()) return
    try {
      setImportLoading(true)
      setImportStatus(null)
      await api.post("/api/products/import", { url: importUrl.trim() })
      setImportStatus("Producto importado correctamente.")
      setImportUrl("")
      setRefreshKey((key) => key + 1)
    } catch (err) {
      const message = err.response?.data?.message || "No pudimos importar el producto"
      setImportStatus(message)
    } finally {
      setImportLoading(false)
    }
  }

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Buscar productos</h1>
            <p className="text-foreground-muted">Descubre productos para monitorear sus precios</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-3 text-foreground-muted" />
              <input
                type="text"
                {...register("search")}
                placeholder="Buscar productos..."
                className="input-base pl-12 py-3 text-base"
              />
            </div>
          </div>

          {/* Import Product */}
          <div className="mb-8 card-base">
            <form onSubmit={handleImportProduct} className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Importar producto desde Amazon</label>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="input-base flex-1"
                  placeholder="https://www.amazon.com/dp/..."
                  required
                />
                <button type="submit" className="btn-primary" disabled={importLoading}>
                  {importLoading ? "Importando..." : "Importar"}
                </button>
              </div>
              {importStatus && <p className="text-sm text-foreground-muted">{importStatus}</p>}
            </form>
          </div>

          {/* Filters and Products */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block">
              <FilterPanel register={register} formValues={formValues} />
            </div>

            {/* Products Section */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 btn-secondary w-full justify-center"
                >
                  <Filter size={20} />
                  {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                </button>
              </div>

              {/* Mobile Filter Panel */}
              {showFilters && (
                <div className="lg:hidden mb-6 card-base">
                  <FilterPanel register={register} formValues={formValues} />
                </div>
              )}

              {/* Sort Bar */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-foreground-muted">
                  Mostrando {filteredProducts.length} producto{filteredProducts.length === 1 ? "" : "s"}
                </p>
                <select {...register("sortBy")} className="input-base py-2 text-sm max-w-xs">
                  <option value="relevance">Relevancia</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="rating">Mejor valorados</option>
                </select>
              </div>

              {error && <p className="text-danger mb-4">{error}</p>}
              {loading && <p className="text-foreground-muted mb-4">Cargando productos...</p>}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToTracking={handleAddToTracking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-foreground-muted mb-4">No encontramos productos</p>
                  <button onClick={() => reset()} className="btn-primary">
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add to Tracking Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar a Tracking">
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={selectedProduct.image || selectedProduct.thumbnail || "/placeholder.svg"}
                alt={selectedProduct.title}
                className="w-24 h-24 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div>
                <h3 className="font-semibold text-foreground mb-2">{selectedProduct.title}</h3>
                <p className="text-2xl font-bold text-primary">
                  {selectedProduct.price != null ? `$${selectedProduct.price}` : "Precio no disponible"}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary bg-opacity-10 border border-primary">
              <p className="text-sm text-foreground">
                Vamos a monitorear este producto y te avisaremos cuando baje del monto objetivo.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Precio objetivo</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="input-base"
                placeholder="Ingresa el monto para recibir alerta"
              />
              {trackingError && <p className="text-danger text-sm mt-2">{trackingError}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                Cancelar
              </button>
              <button onClick={handleConfirmTracking} className="btn-primary flex-1" disabled={trackingLoading}>
                {trackingLoading ? "Guardando..." : "Agregar a seguimiento"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
}

// Filter Panel Component
function FilterPanel({ register, formValues }) {
  const [expandedCategory, setExpandedCategory] = useState(null)

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "electronics", label: "Electrónica" },
    { value: "cameras", label: "Cámaras" },
    { value: "accessories", label: "Accesorios" },
    { value: "storage", label: "Almacenamiento" },
  ]

  const conditions = [
    { value: "all", label: "Cualquier estado" },
    { value: "new", label: "Nuevo" },
    { value: "refurbished", label: "Reacondicionado" },
    { value: "used", label: "Usado" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Filter size={18} />
          Filtros
        </h3>
      </div>

      {/* Category Filter */}
      <div>
        <button
          onClick={() => setExpandedCategory(expandedCategory === "category" ? null : "category")}
          className="w-full text-left font-semibold text-foreground mb-3 flex items-center justify-between"
        >
          Categoría
          <span className={`transform transition ${expandedCategory === "category" ? "rotate-180" : ""}`}>v</span>
        </button>
        {expandedCategory === "category" && (
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.value} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" value={cat.value} {...register("category")} className="w-4 h-4 rounded" />
                <span className="text-foreground-muted text-sm">{cat.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => setExpandedCategory(expandedCategory === "price" ? null : "price")}
          className="w-full text-left font-semibold text-foreground mb-3 flex items-center justify-between"
        >
          Rango de precio
          <span className={`transform transition ${expandedCategory === "price" ? "rotate-180" : ""}`}>v</span>
        </button>
        {expandedCategory === "price" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-foreground-muted mb-1 block">Precio mínimo</label>
              <input type="number" {...register("priceMin")} placeholder="$0" className="input-base text-sm" />
            </div>
            <div>
              <label className="text-sm text-foreground-muted mb-1 block">Precio máximo</label>
              <input type="number" {...register("priceMax")} placeholder="$5000" className="input-base text-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Condition Filter */}
      <div>
        <button
          onClick={() => setExpandedCategory(expandedCategory === "condition" ? null : "condition")}
          className="w-full text-left font-semibold text-foreground mb-3 flex items-center justify-between"
        >
          Estado
          <span className={`transform transition ${expandedCategory === "condition" ? "rotate-180" : ""}`}>v</span>
        </button>
        {expandedCategory === "condition" && (
          <div className="space-y-2">
            {conditions.map((cond) => (
              <label key={cond.value} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" value={cond.value} {...register("condition")} className="w-4 h-4 rounded" />
                <span className="text-foreground-muted text-sm">{cond.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
