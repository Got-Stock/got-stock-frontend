// Comprehensive category-specific attributes for all product types
// Data extracted from dependencies main.xlsx

export const categoryAttributes = {
  "Fashion": {
    "Women": {
      "Clothing": {
        "Tops": {
          "Details": {
            "Sleeve_Length": ["sleeveless", "short sleeve", "long sleeve", "3 quarter"],
            "Neckline": ["crew neck", "v-neck", "halter", "boat neck"],
            "Fit": ["regular", "oversized", "slim"],
            "Length": ["cropped", "standard", "longline"],
            "Fastening": ["button", "zip", "slip on"],
            "Fabric_Weight": ["lightweight", "midweight", "heavy"]
          },
          "Variant": {
            "Pattern": ["solid", "floral", "striped", "geometric", "polka dot"],
            "Occasion": ["casual", "workwear", "evening"],
            "Transparency": ["opaque", "semi sheer", "sheer"]
          }
        },
        "Jackets & Coats": {
          "Details": {
            "Fit": ["regular", "oversized", "slim"],
            "Sleeve_Length": ["long sleeve", "3 quarter"],
            "Length": ["hip length", "knee length", "longline"],
            "Fastening": ["zip", "button", "tie belt"],
            "Fabric_Weight": ["lightweight", "midweight", "heavy"],
            "Features_Benefits": ["water-resistant", "insulated", "windproof"]
          },
          "Variant": {
            "Pattern": ["solid", "check", "floral", "striped"],
            "Occasion": ["casual", "workwear", "evening"]
          }
        }
      },
      "Shoes": {
        "Sneakers": {
          "Details": {
            "Fastening": ["laces", "slip on", "velcro"],
            "Toe_Shape": ["round", "almond"],
            "Sole_Material": ["rubber", "synthetic"],
            "Features_Benefits": ["comfort", "breathable", "lightweight"],
            "Fit": ["true to size", "wide fit"],
            "Season": ["all-season", "winter", "summer"],
            "Style": ["streetwear", "athleisure", "classic"]
          },
          "Variant": {
            "Pattern": ["solid", "colour block", "printed"],
            "Occasion": ["casual", "sport"]
          }
        },
        "Boots": {
          "Details": {
            "Fastening": ["zip", "lace up", "slip on"],
            "Toe_Shape": ["round", "pointed"],
            "Heel_Height": ["flat", "mid heel", "high heel"],
            "Sole_Material": ["rubber", "synthetic"],
            "Length": ["ankle", "mid calf", "knee high"],
            "Season": ["winter", "all-season"],
            "Style": ["classic", "edgy", "western"]
          },
          "Variant": {
            "Pattern": ["solid", "textured"],
            "Occasion": ["casual", "workwear"]
          }
        },
        "Sandals": {
          "Details": {
            "Strap_Type": ["ankle strap", "slide", "t-bar"],
            "Fastening": ["buckle", "slip on"],
            "Toe_Shape": ["open", "round"],
            "Heel_Height": ["flat", "low heel", "mid heel"],
            "Sole_Material": ["rubber", "synthetic"],
            "Season": ["summer", "all-season"],
            "Style": ["minimalist", "boho", "classic"]
          },
          "Variant": {
            "Occasion": ["casual", "resort"]
          }
        },
        "Heels": {
          "Details": {
            "Heel_Height": ["kitten", "mid heel", "high heel", "block heel"],
            "Toe_Shape": ["pointed", "round", "open"],
            "Fastening": ["strap", "slip on"],
            "Season": ["all-season"],
            "Style": ["classic", "glam", "minimalist"]
          },
          "Variant": {
            "Occasion": ["evening", "formal"]
          }
        }
      },
      "Accessories": {
        "Bags": {
          "Details": {
            "Material": ["leather", "canvas", "nylon"],
            "Closure_Type": ["zip", "magnetic", "drawstring"],
            "Strap_Type": ["crossbody", "shoulder", "tote handles"],
            "Pocket_Count": ["1", "2", "3+"],
            "Capacity": ["small", "medium", "large"],
            "Style": ["classic", "minimalist", "modern"]
          },
          "Variant": {
            "Pattern": ["solid", "quilted", "printed"],
            "Occasion": ["casual", "work", "evening"]
          }
        },
        "Hats & Scarves": {
          "Details": {
            "Material": ["wool", "cotton", "acrylic"],
            "Style": ["beanie", "wide brim", "scarf wrap"],
            "Season": ["winter", "all-season"],
            "Fit": ["one size", "adjustable"],
            "Length": ["short (scarf)", "long (scarf)"]
          },
          "Variant": {
            "Pattern": ["solid", "striped", "knit weave"]
          }
        }
      }
    },
    "Men": {
      "Clothing": {
        "T-Shirts & Polos": {
          "Details": {
            "Material": ["cotton", "polyester", "blend"],
            "Sleeve_Length": ["short", "long", "3/4"],
            "Neckline": ["crew neck", "v-neck", "polo"],
            "Fit": ["true to size", "slim", "loose"],
            "Season": ["summer", "all-season"],
            "Features_Benefits": ["breathable", "quick dry"],
            "Fabric_Weight": ["lightweight", "midweight", "heavy"]
          },
          "Variant": {
            "Pattern": ["solid", "striped", "printed"],
            "Occasion": ["casual", "sport"],
            "Transparency": ["opaque"]
          }
        },
        "Shirts": {
          "Details": {
            "Material": ["cotton", "linen", "blend"],
            "Sleeve_Length": ["long", "short"],
            "Collar_Type": ["point collar", "button-down", "spread"],
            "Fit": ["slim", "true to size", "loose"],
            "Season": ["all-season", "summer", "winter"],
            "Features_Benefits": ["breathable", "moisture wicking"]
          },
          "Variant": {
            "Pattern": ["solid", "striped", "checked"],
            "Occasion": ["formal", "work", "casual"]
          }
        },
        "Jackets & Coats": {
          "Details": {
            "Material": ["leather", "polyester", "wool"],
            "Fit": ["slim", "regular", "loose"],
            "Closure_Type": ["zip", "button", "magnetic"],
            "Length": ["hip-length", "knee-length", "long"],
            "Season": ["winter", "all-season"],
            "Features_Benefits": ["waterproof", "insulated", "windproof"]
          },
          "Variant": {
            "Pattern": ["solid", "checked", "striped"],
            "Occasion": ["casual", "work", "formal"]
          }
        }
      },
      "Shoes": {
        "Sneakers": {
          "Details": {
            "Material": ["leather", "canvas", "synthetic"],
            "Closure_Type": ["lace-up", "slip-on", "velcro"],
            "Sole_Type": ["rubber", "foam", "synthetic"],
            "Lining": ["textile", "leather"],
            "Insole_Type": ["cushioned", "orthopedic"],
            "Style": ["casual", "sport"],
            "Features_Benefits": ["breathable", "lightweight", "shock absorbent"],
            "Fit": ["true to size", "wide", "narrow"]
          },
          "Variant": {
            "Occasion": ["casual", "sport"]
          }
        },
        "Boots": {
          "Details": {
            "Material": ["leather", "suede", "synthetic"],
            "Closure_Type": ["lace-up", "zip", "slip-on"],
            "Sole_Type": ["rubber", "synthetic"],
            "Lining": ["leather", "textile"],
            "Height": ["ankle", "mid-calf", "knee-high"],
            "Style": ["casual", "work", "military"],
            "Features_Benefits": ["waterproof", "insulated", "non-slip"],
            "Fit": ["true to size", "wide", "narrow"]
          },
          "Variant": {
            "Occasion": ["casual", "work", "hiking"]
          }
        }
      },
      "Accessories": {
        "Wallets": {
          "Details": {
            "Material": ["leather", "synthetic", "canvas"],
            "Style": ["bi-fold", "tri-fold", "card holder"],
            "Closure_Type": ["zip", "button", "none"],
            "Compartments": ["1-3 card slots", "4-6 card slots", "7+ card slots"],
            "Features_Benefits": ["RFID protection", "slim profile"],
            "Size": ["small", "medium", "large"]
          },
          "Variant": {}
        },
        "Belts": {
          "Details": {
            "Material": ["leather", "synthetic", "canvas"],
            "Style": ["casual", "formal", "braided"],
            "Buckle_Type": ["pin", "frame", "automatic"],
            "Length": ["80-90 cm", "91-100 cm", "101-110 cm"],
            "Width": ["2-3 cm", "3-4 cm"],
            "Features_Benefits": ["adjustable", "elastic"]
          },
          "Variant": {}
        },
        "Hats": {
          "Details": {
            "Material": ["cotton", "wool", "synthetic"],
            "Style": ["baseball", "beanie", "fedora"],
            "Fit": ["one size", "S", "M", "L"],
            "Features_Benefits": ["adjustable", "breathable"]
          },
          "Variant": {}
        }
      }
    },
    "Kids & Baby": {
      "Clothing": {
        "Babywear": {
          "Details": {
            "Material": ["cotton", "organic cotton", "polyester blend"],
            "Sleeve_Length": ["short", "long", "sleeveless"],
            "Neckline": ["crew", "v-neck", "round"],
            "Closure_Type": ["zip", "buttons", "none"],
            "Features_Benefits": ["soft", "breathable", "durable"],
            "Care_Instructions": ["machine washable", "hand wash", "dry clean"],
            "Age_Range": ["0-6 months", "6-12 months", "12-24 months"],
            "Size": ["XS", "S", "M", "L", "XL"]
          },
          "Variant": {
            "Pattern": ["solid", "striped", "printed"],
            "Occasion": ["casual", "formal", "school"]
          }
        }
      },
      "Shoes": {
        "Sneakers": {
          "Details": {
            "Material": ["leather", "canvas", "synthetic"],
            "Closure_Type": ["lace-up", "velcro", "slip-on"],
            "Sole_Type": ["rubber", "foam"],
            "Lining": ["textile", "leather"],
            "Insole_Type": ["cushioned", "orthopedic"],
            "Style": ["casual", "sport"],
            "Features_Benefits": ["breathable", "lightweight", "shock absorbent"],
            "Fit": ["true to size", "wide", "narrow"],
            "Age_Range": ["0-6 months", "6-12 months", "1-2 years", "3-5 years"]
          },
          "Variant": {
            "Occasion": ["casual", "sport"]
          }
        },
        "Boots": {
          "Details": {
            "Material": ["leather", "suede", "synthetic"],
            "Closure_Type": ["lace-up", "zip", "slip-on"],
            "Sole_Type": ["rubber", "synthetic"],
            "Lining": ["leather", "textile"],
            "Height": ["ankle", "mid-calf"],
            "Style": ["casual", "work"],
            "Features_Benefits": ["waterproof", "insulated"],
            "Fit": ["true to size", "wide"],
            "Age_Range": ["0-6 months", "6-12 months", "1-2 years", "3-5 years"]
          },
          "Variant": {
            "Occasion": ["casual", "school"]
          }
        },
        "Sandals": {
          "Details": {
            "Material": ["leather", "synthetic", "textile"],
            "Closure_Type": ["velcro", "buckle", "slip-on"],
            "Sole_Type": ["rubber", "foam"],
            "Lining": ["textile", "leather"],
            "Style": ["casual", "beach"],
            "Features_Benefits": ["breathable", "lightweight"],
            "Fit": ["true to size", "wide"],
            "Age_Range": ["0-6 months", "6-12 months", "1-2 years", "3-5 years"]
          },
          "Variant": {
            "Occasion": ["casual", "beach"]
          }
        }
      },
      "Accessories": {
        "Hats": {
          "Details": {
            "Material": ["cotton", "wool", "synthetic"],
            "Style": ["beanie", "cap", "sun"],
            "Closure_Type": ["none", "adjustable"],
            "Size": ["XS", "S", "M", "L"],
            "Features_Benefits": ["breathable", "lightweight"],
            "Age_Range": ["0-6 months", "6-12 months", "1-2 years", "3-5 years"]
          },
          "Variant": {
            "Occasion": ["casual", "school"]
          }
        },
        "Bags & Wallets": {
          "Details": {
            "Material": ["leather", "canvas", "synthetic"],
            "Style": ["backpack", "crossbody", "wallet"],
            "Closure_Type": ["zip", "buckle", "velcro"],
            "Size": ["small", "medium", "large"],
            "Features_Benefits": ["lightweight", "durable"],
            "Age_Range": ["0-6 months", "6-12 months", "1-2 years", "3-5 years"]
          },
          "Variant": {
            "Occasion": ["school", "casual"]
          }
        }
      }
    }
  },
  "Health & Beauty": {
    "Skincare": {
      "Cleansers": {
        "Details": {
          "Product_Type": ["gel", "foam", "cream"],
          "Skin_Type": ["normal", "dry", "oily", "combination"],
          "Size": ["50ml", "100ml", "200ml"],
          "Key_Ingredients": ["aloe vera", "salicylic acid", "vitamin C"],
          "Features_Benefits": ["hydrating", "exfoliating", "soothing"],
          "Packaging_Type": ["tube", "jar"],
          "Usage_Instructions": ["daily", "nightly"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"],
          "Fragrance": ["scented", "unscented"]
        },
        "Variant": {}
      },
      "Serums": {
        "Details": {
          "Product_Type": ["hydrating", "brightening", "anti-aging"],
          "Skin_Type": ["normal", "dry", "oily", "combination"],
          "Key_Ingredients": ["vitamin C", "hyaluronic acid", "peptides"],
          "Features_Benefits": ["hydrating", "brightening", "anti-aging"],
          "Packaging_Type": ["dropper", "airless pump"],
          "Usage_Instructions": ["daily", "nightly"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"],
          "Fragrance": ["scented", "unscented"]
        },
        "Variant": {}
      },
      "Moisturisers": {
        "Details": {
          "Product_Type": ["hydrating", "anti-aging", "oil-free"],
          "Skin_Type": ["normal", "dry", "oily", "combination"],
          "Key_Ingredients": ["hyaluronic acid", "vitamin E", "ceramides"],
          "Features_Benefits": ["hydrating", "anti-aging", "oil-control"],
          "Packaging_Type": ["jar", "tube"],
          "Usage_Instructions": ["daily", "nightly"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"],
          "Fragrance": ["scented", "unscented"]
        },
        "Variant": {}
      }
    },
    "Makeup": {
      "Face": {
        "Details": {
          "Product_Type": ["foundation", "concealer", "blush", "highlighter"],
          "Shade": ["light", "medium", "dark"],
          "Coverage": ["light", "medium", "full"],
          "Finish": ["matte", "dewy", "satin"],
          "Skin_Type": ["normal", "dry", "oily", "combination"],
          "Features_Benefits": ["long-lasting", "hydrating", "oil-control"],
          "Packaging_Type": ["compact", "bottle"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"]
        },
        "Variant": {}
      },
      "Eyes": {
        "Details": {
          "Product_Type": ["mascara", "eyeshadow", "eyeliner", "brow"],
          "Shade": ["black", "brown", "neutral", "colorful"],
          "Finish": ["matte", "shimmer"],
          "Features_Benefits": ["long-lasting", "smudge-proof"],
          "Packaging_Type": ["compact", "tube"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"]
        },
        "Variant": {}
      },
      "Lips": {
        "Details": {
          "Product_Type": ["lipstick", "lipgloss", "lipliner"],
          "Shade": ["red", "pink", "nude", "bold"],
          "Finish": ["matte", "glossy", "satin"],
          "Features_Benefits": ["long-lasting", "hydrating", "smudge-proof"],
          "Packaging_Type": ["bullet", "tube"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"]
        },
        "Variant": {}
      }
    },
    "Haircare": {
      "Shampoo & Conditioner": {
        "Details": {
          "Product_Type": ["shampoo", "conditioner"],
          "Hair_Type": ["normal", "dry", "oily", "curly", "coloured"],
          "Key_Ingredients": ["argan oil", "coconut oil", "keratin"],
          "Features_Benefits": ["hydrating", "volumizing", "repairing"],
          "Packaging_Type": ["bottle", "tube"],
          "Usage_Instructions": ["daily", "weekly"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"],
          "Fragrance": ["scented", "unscented"]
        },
        "Variant": {}
      },
      "Styling": {
        "Details": {
          "Product_Type": ["hair gel", "hair spray", "mousse", "cream"],
          "Hair_Type": ["normal", "dry", "oily", "curly", "coloured"],
          "Key_Ingredients": ["argan oil", "coconut oil", "shea butter"],
          "Features_Benefits": ["volume", "hold", "shine"],
          "Packaging_Type": ["tube", "spray"],
          "Usage_Instructions": ["daily", "as needed"],
          "Cruelty_Free": ["yes", "no"],
          "Vegan": ["yes", "no"],
          "Fragrance": ["scented", "unscented"]
        },
        "Variant": {}
      }
    }
  }
};

// Helper function to get attributes for any category path
// This function searches through the nested structure to find the product type
export const getCategoryAttributes = (level1, level2, level3, level4) => {
  console.log('getCategoryAttributes called with:', { level1, level2, level3, level4 });
  
  if (!level1 || !level2) {
    console.log('Missing level1 or level2');
    return { Details: {}, Variant: {} };
  }

  try {
    // Get the level1 category (e.g., "Fashion")
    const level1Data = categoryAttributes[level1];
    if (!level1Data) {
      console.log('No data for level1:', level1);
      return { Details: {}, Variant: {} };
    }

    // Get the level2 category (e.g., "Women")
    const level2Data = level1Data[level2];
    if (!level2Data) {
      console.log('No data for level2:', level2);
      return { Details: {}, Variant: {} };
    }

    // Now search for the product type (level4) anywhere in the nested structure
    // The structure is: Fashion > Women > Clothing > Tops
    // But level4 contains "Tops", and we need to find it regardless of level3
    
    function searchForProduct(obj, productName) {
      for (const [key, value] of Object.entries(obj)) {
        // Check if this key matches the product name directly
        if (key === productName && value.Details !== undefined) {
          console.log('Found product directly:', key);
          return value;
        }
        // Check if this is a nested category (has objects as values)
        if (typeof value === 'object' && !Array.isArray(value) && value.Details === undefined) {
          // This is a category container, search within it
          const result = searchForProduct(value, productName);
          if (result) {
            return result;
          }
        }
      }
      return null;
    }

    const productData = searchForProduct(level2Data, level4 || level3);
    
    if (productData) {
      console.log('Found product data:', productData);
      return {
        Details: productData.Details || {},
        Variant: productData.Variant || {}
      };
    }

    console.log('No product data found for:', level4 || level3);
    return { Details: {}, Variant: {} };
  } catch (error) {
    console.error('Error getting category attributes:', error);
    return { Details: {}, Variant: {} };
  }
};
