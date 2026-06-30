// Variant Display Utility for PLP
// Each tile represents ONE VARIANT with related variants discoverable

/**
 * Get display data for a variant tile on PLP
 * @param {Object} variant - Variant with offers and sibling info
 * @returns {Object} - Display data for variant tile
 */
export function getVariantDisplayData(variant) {
  if (!variant || !variant.offers || variant.offers.length === 0) {
    return {
      price: "$0.00",
      priceDisplay: "$0.00",
      stock: 0,
      available: false,
      sellerName: 'Seller',
      hasRelatedVariants: false,
      relatedVariantCount: 0,
      variantAttributes: {}
    };
  }

  // Select best offer for this variant
  const bestOffer = selectBestOfferForVariant(variant.offers);
  
  if (!bestOffer) {
    return {
      price: "$0.00",
      priceDisplay: "$0.00",
      stock: 0,
      available: false,
      sellerName: 'Seller',
      hasRelatedVariants: variant.total_siblings > 1,
      relatedVariantCount: variant.total_siblings - 1,
      variantAttributes: variant.variant_attributes || {}
    };
  }

  // Calculate total stock for this variant
  const totalStock = variant.offers.reduce((sum, offer) => {
    return sum + (offer.stock_qty || 0);
  }, 0);

  // Get variant attributes for display (size, color, etc.)
  const variantAttrs = variant.variant_attributes || {};

  return {
    price: bestOffer.price,
    priceDisplay: `$${bestOffer.price.toFixed(2)}`,
    stock: totalStock,
    available: true,
    sellerId: bestOffer.seller_id,
    sellerName: 'Seller', // TODO: Join seller name from seller_info
    hasMoreOffers: variant.offers.length > 1,
    totalOffers: variant.offers.length,
    hasRelatedVariants: variant.total_siblings > 1,
    relatedVariantCount: variant.total_siblings - 1,
    variantAttributes: variantAttrs,
    siblingVariants: variant.sibling_variants || [],
    variantId: variant.variant_id
  };
}

/**
 * Select best offer for a single variant
 * Prioritizes: In stock > Lowest price > Highest stock
 */
function selectBestOfferForVariant(offers) {
  if (!offers || offers.length === 0) return null;

  // Filter to active offers with stock
  const inStockOffers = offers.filter(offer => {
    return offer.status === 'ACTIVE' && offer.stock_qty > 0;
  });

  if (inStockOffers.length === 0) return null;

  // Sort by price (lowest first), then stock (highest first)
  inStockOffers.sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    return b.stock_qty - a.stock_qty;
  });

  return inStockOffers[0];
}

/**
 * Get variant description for "Available in..." text
 * @param {Object} variant - Variant with sibling info
 * @returns {String} - E.g., "Available in 3 colors" or "Available in 5 sizes"
 */
export function getVariantAvailabilityText(variant) {
  if (!variant.sibling_variants || variant.sibling_variants.length === 0) {
    return null;
  }

  const relatedCount = variant.sibling_variants.length;
  const currentAttrs = variant.variant_attributes || {};
  
  // Determine what varies (color, size, etc.)
  const varyingAttributes = new Set();
  
  variant.sibling_variants.forEach(sibling => {
    const siblingAttrs = sibling.attributes || {};
    Object.keys(siblingAttrs).forEach(key => {
      if (siblingAttrs[key] !== currentAttrs[key]) {
        varyingAttributes.add(key);
      }
    });
  });

  // Generate text based on what varies
  const attrArray = Array.from(varyingAttributes);
  
  if (attrArray.length === 0) {
    return `+${relatedCount} more option${relatedCount > 1 ? 's' : ''}`;
  }

  // Map attribute keys to friendly names
  const attrNameMap = {
    'primary_colour': 'color',
    'color': 'color',
    'womens_size': 'size',
    'mens_size': 'size',
    'size': 'size',
    'kids_size': 'size',
    'baby_size': 'size'
  };

  const friendlyName = attrNameMap[attrArray[0].toLowerCase()] || 'option';
  return `Available in ${relatedCount + 1} ${friendlyName}${relatedCount > 0 ? 's' : ''}`;
}

/**
 * Get color swatches for related variants (for visual display)
 * @param {Object} variant - Variant with sibling info
 * @returns {Array} - Array of {variantId, color, inStock}
 */
export function getColorSwatches(variant) {
  if (!variant.sibling_variants) return [];

  const swatches = [];
  const currentAttrs = variant.variant_attributes || {};
  
  // Add current variant
  if (currentAttrs.primary_colour || currentAttrs.color) {
    swatches.push({
      variantId: variant.variant_id,
      color: currentAttrs.primary_colour || currentAttrs.color,
      isCurrent: true
    });
  }

  // Add siblings with different colors
  variant.sibling_variants.forEach(sibling => {
    const siblingAttrs = sibling.attributes || {};
    const siblingColor = siblingAttrs.primary_colour || siblingAttrs.color;
    
    if (siblingColor && siblingColor !== (currentAttrs.primary_colour || currentAttrs.color)) {
      swatches.push({
        variantId: sibling.variant_id,
        color: siblingColor,
        isCurrent: false
      });
    }
  });

  return swatches.slice(0, 5); // Limit to 5 swatches
}

/**
 * DEPRECATED - Backward compatibility
 */
export function getProductDisplayData(variant) {
  return getVariantDisplayData(variant);
}

export function getProductBestOffer(variant) {
  return getVariantDisplayData(variant);
}

// Default export
export default getVariantDisplayData;
