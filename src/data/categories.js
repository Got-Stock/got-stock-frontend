export const categoryData = {
  "Fashion": {
    "Women": {
      "Clothing": ["Dresses", "Tops", "Jeans & Pants", "Jackets & Coats"],
      "Shoes": ["Sneakers", "Boots", "Sandals", "Heels"],
      "Accessories": ["Bags", "Belts", "Hats & Scarves"]
    },
    "Men": {
      "Clothing": ["T-Shirts & Polos", "Shirts", "Jeans & Pants", "Jackets & Coats"],
      "Shoes": ["Sneakers", "Boots"],
      "Accessories": ["Wallets", "Belts", "Hats"]
    },
    "Kids & Baby": {
      "Clothing": ["Babywear", "Girlswear", "Boyswear", "Schoolwear"],
      "Shoes": ["Sneakers", "Boots", "Sandals", "Dress"],
      "Accessories": ["Hats", "Socks", "Bags & wallets", "Ties"]
    }
  },
  "Health & Beauty": {
    "Skincare": {
      "Cleansers": [],
      "Serums": [],
      "Moisturisers": []
    },
    "Makeup": {
      "Face": [],
      "Eyes": [],
      "Lips": []
    },
    "Haircare": {
      "Shampoo & Conditioner": [],
      "Styling": []
    },
    "Appliances & Tools": {},
    "Fragrance": {
      "Perfume": [],
      "EDT": []
    }
  },
  "Home & Living": {
    "Furniture": {
      "Living Room": [],
      "Bedroom": [],
      "Dining": []
    },
    "Kitchen & Dining": {
      "Cookware": [],
      "Dinnerware": [],
      "Glassware": []
    },
    "Décor": {
      "Lighting": [],
      "Rugs": [],
      "Wall Art": []
    },
    "Bedding & Bath": {
      "Bedding": [],
      "Towels": []
    }
  },
  "Electronics & Tech": {
    "Phones & Accessories": {
      "Smartphones": [],
      "Cases & Chargers": []
    },
    "Computers & Tablets": {
      "Laptops": [],
      "Tablets": []
    },
    "Audio": {
      "Headphones": [],
      "Speakers": []
    },
    "Gaming": {
      "Consoles": [],
      "Games": []
    }
  },
  "Watches": {
    "Jewellery & Accessories": {
      "Watches": ["Smart", "Dress"],
      "Jewellery": ["Necklaces", "Earrings", "Bracelets", "Rings"],
      "Accessories": ["Sunglasses", "Handbags & Wallets"]
    }
  },
  "Sports & Outdoors": {
    "Fitness": {
      "Activewear": [],
      "Equipment": []
    },
    "Camping & Hiking": {
      "Shelters": [],
      "Backpacks": []
    },
    "Cycling": {
      "Bikes": [],
      "Helmets": []
    },
    "Water Sports": {
      "Swimwear": [],
      "Surf": []
    },
    "Team Sports": {
      "Football": [],
      "Basketball": [],
      "Netball": []
    }
  }
};

// Helper function to get Level 1 categories
export const getLevel1Categories = () => {
  return Object.keys(categoryData);
};

// Helper function to get Level 2 categories based on Level 1
export const getLevel2Categories = (level1) => {
  if (!level1 || !categoryData[level1]) return [];
  return Object.keys(categoryData[level1]);
};

// Helper function to get Level 3 categories based on Level 1 and 2
export const getLevel3Categories = (level1, level2) => {
  if (!level1 || !level2 || !categoryData[level1] || !categoryData[level1][level2]) return [];
  return Object.keys(categoryData[level1][level2]);
};

// Helper function to get Level 4 categories based on Level 1, 2, and 3
export const getLevel4Categories = (level1, level2, level3) => {
  if (!level1 || !level2 || !level3 || 
      !categoryData[level1] || 
      !categoryData[level1][level2] || 
      !categoryData[level1][level2][level3]) return [];
  return categoryData[level1][level2][level3];
};
