// Dynamic attributes for Fashion > Women categories
export const fashionWomenAttributes = {
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
};

// Helper function to get attributes for a specific category path
export const getCategoryAttributes = (level1, level2, level3) => {
  console.log('getCategoryAttributes called with:', { level1, level2, level3 });
  
  if (level1 !== "Fashion" || level2 !== "Women" || !level3) {
    console.log('Returning empty - not Fashion > Women or no level3');
    return { Details: {}, Variant: {} };
  }

  // Level 3 format is like "Clothing", "Tops", "Sneakers", etc.
  // Find which main category it belongs to
  let mainCategory = null;
  let subCategory = level3;

  console.log('Searching for category:', level3);
  console.log('Available categories:', Object.keys(fashionWomenAttributes));

  // Try to find the category in our structure
  for (const [mainCat, subCats] of Object.entries(fashionWomenAttributes)) {
    console.log(`Checking ${mainCat}, subcategories:`, Object.keys(subCats));
    if (subCats[level3]) {
      mainCategory = mainCat;
      subCategory = level3;
      console.log('Found match!', mainCat, level3);
      break;
    }
  }

  if (!mainCategory) {
    console.log('No main category found for:', level3);
    return { Details: {}, Variant: {} };
  }

  const categoryData = fashionWomenAttributes[mainCategory][subCategory];
  if (!categoryData) {
    console.log('No category data found');
    return { Details: {}, Variant: {} };
  }

  console.log('Returning attributes:', categoryData);
  return {
    Details: categoryData.Details || {},
    Variant: categoryData.Variant || {}
  };
};
