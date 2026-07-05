import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Heart, ArrowLeft, Package, Truck, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Banner from "../components/Banner";
import CartBadge from "../components/CartBadge";
import CategoryNav from "../components/CategoryNav";
import Breadcrumbs from "../components/Breadcrumbs";
import WishlistButton from "../components/WishlistButton";
import Header from "../components/Header";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ProductDetail() {
  const { productId, variantId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (variantId) {
      fetchProductByVariant();
    } else if (productId) {
      fetchProduct();
    }
  }, [productId, variantId]);

  const fetchProductByVariant = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/public/variant/${variantId}`);
      const data = response.data;
      
      // Set product and current variant
      setProduct(data);
      setCurrentVariant(data.selected_variant);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/public/${productId}`);
      const data = response.data;
      
      setProduct(data);
      
      // Select first variant with stock
      if (data.variants && data.variants.length > 0) {
        const variantWithStock = data.variants.find(v => 
          v.offers && v.offers.some(o => o.stock_qty > 0)
        ) || data.variants[0];
        setCurrentVariant(variantWithStock);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variant) => {
    // Navigate to the variant's URL
    navigate(`/product/variant/${variant.variant_id}`);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const addToCart = () => {
    if (!currentVariant) {
      toast.error("Please select a variant");
      return;
    }

    const bestOffer = currentVariant.offers?.[0];
    if (!bestOffer) {
      toast.error("This product is not available");
      return;
    }

    const availableStock = bestOffer.stock_qty || 0;

    if (availableStock < quantity) {
      toast.error("Not enough stock available");
      return;
    }

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if this variant already exists in cart
    const existingItemIndex = cart.findIndex(item => item.variant_id === currentVariant.variant_id);
    
    // Get the image - use first product image (variants don't have images yet)
    const productImage = product.images?.[0] || "https://placehold.co/100x100?text=No+Image";
    
    // Get color from variant attributes
    const colour = currentVariant.variant_attributes?.primary_colour || '';
    const size = currentVariant.variant_attributes?.pack_size || '';
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item with correct data structure
      cart.push({
        product_id: product.id,
        product_name: product.name,
        product_image: productImage,
        brand: product.brand,
        variant_id: currentVariant.variant_id,
        size: size,
        colour: colour,
        price: bestOffer.price,
        quantity: quantity,
        stock_qty: availableStock
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));

    // Trigger cart update event + slide the cart drawer open
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('openCart'));

    toast.success("Added to cart!");
  };

  const getUniqueVariantOptions = (field) => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v[field]).filter(Boolean))];
  };

  const selectVariant = (field, value) => {
    if (!product?.variants) return;
    
    // Find a variant matching the selected option
    let matchingVariant;
    
    if (field === 'size') {
      matchingVariant = product.variants.find(v => 
        v.size === value && v.colour === currentVariant?.colour
      ) || product.variants.find(v => v.size === value);
    } else if (field === 'colour') {
      matchingVariant = product.variants.find(v => 
        v.colour === value && v.size === currentVariant?.size
      ) || product.variants.find(v => v.colour === value);
    }
    
    if (matchingVariant) {
      setCurrentVariant(matchingVariant);
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const images = product.images || product.media?.images || ["https://placehold.co/600x600?text=No+Image"];

  const handleImageError = (e) => {
    if (e.target.src !== "https://placehold.co/600x600?text=No+Image") {
      e.target.src = "https://placehold.co/600x600?text=No+Image";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            ...(product.categories?.level_1 ? [{ 
              label: product.categories.level_1, 
              href: `/category/${product.categories.level_1}` 
            }] : []),
            { label: product.name }
          ]} 
        />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1, { state: { preserveScroll: true } })}
          className="mb-6 text-gray-700 hover:text-gray-900 hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm p-8">
          {/* Images */}
          <div>
            <div 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative cursor-zoom-in"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={images[mainImage]}
                alt={product.name}
                width="600"
                height="600"
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  showZoom ? 'scale-150' : 'scale-100'
                }`}
                style={
                  showZoom
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : {}
                }
                onError={handleImageError}
              />
              {showZoom && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Zoom Active
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(idx)}
                    aria-label={`View image ${idx + 1} of ${images.length}`}
                    aria-pressed={mainImage === idx}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      mainImage === idx ? 'border-brand-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      width="150"
                      height="150"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-brand-600">
                  ${currentVariant?.offers?.[0]?.price?.toFixed(2) || '0.00'}
                </p>
                {currentVariant?.offers?.[0]?.stock_qty > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selection */}
            <div className="space-y-4 mb-6">
              {getUniqueVariantOptions('colour').length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color: <span className="font-normal text-gray-600">{currentVariant?.colour}</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {getUniqueVariantOptions('colour').map(colour => (
                      <button
                        key={colour}
                        onClick={() => selectVariant('colour', colour)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          currentVariant?.colour === colour
                            ? 'border-brand-600 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {colour}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {getUniqueVariantOptions('size').length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Size: <span className="font-normal text-gray-600">{currentVariant?.size}</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {getUniqueVariantOptions('size').map(size => (
                      <button
                        key={size}
                        onClick={() => selectVariant('size', size)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          currentVariant?.size === size
                            ? 'border-brand-600 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Select value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(Math.min(10, currentVariant?.offers?.[0]?.stock_qty || 0))].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentVariant && currentVariant.offers?.[0] && (
                  <p className="text-xs text-gray-500 mt-1">
                    {currentVariant.offers[0].stock_qty} available
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={addToCart}
                disabled={!currentVariant || !currentVariant.offers?.[0] || currentVariant.offers[0].stock_qty === 0}
                className="flex-1 bg-brand-600 hover:bg-brand-700"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <div className="border border-gray-200 rounded-md flex items-center justify-center w-14 hover:bg-gray-50 transition">
                <WishlistButton product={product} />
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-brand-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-brand-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Fast Delivery</p>
                  <p className="text-xs text-gray-500">2-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-brand-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure transactions</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {product.material && (
              <div className="border-t mt-6 pt-6">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  {product.material && <p><span className="font-medium">Material:</span> {product.material}</p>}
                  {product.brand && <p><span className="font-medium">Brand:</span> {product.brand}</p>}
                  {product.model && <p><span className="font-medium">Model:</span> {product.model}</p>}
                  {product.country_of_origin && <p><span className="font-medium">Origin:</span> {product.country_of_origin}</p>}
                  {product.care_instructions && <p><span className="font-medium">Care:</span> {product.care_instructions}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
