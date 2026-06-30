import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategorySelector = ({ value, onChange, required = false }) => {
  const [categories, setCategories] = useState({
    l1: [],
    l2: [],
    l3: [],
    l4: []
  });
  const [selected, setSelected] = useState({
    l1: '',
    l2: '',
    l3: '',
    l4: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchL1Categories();
  }, []);

  useEffect(() => {
    // Parse existing value if provided
    if (value && typeof value === 'string') {
      const parts = value.split('/');
      setSelected({
        l1: parts[0] || '',
        l2: parts[1] || '',
        l3: parts[2] || '',
        l4: parts[3] || ''
      });
    }
  }, [value]);

  const fetchL1Categories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/constants/all`, { withCredentials: true });
      setCategories(prev => ({ ...prev, l1: response.data.category_l1 || [] }));
    } catch (error) {
      console.error('Error fetching L1 categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleL1Change = (value) => {
    setSelected({ l1: value, l2: '', l3: '', l4: '' });
    setCategories(prev => ({ ...prev, l2: [], l3: [], l4: [] }));
    
    // Fetch L2 categories based on L1
    fetchL2Categories(value);
    
    // Notify parent
    if (onChange) {
      onChange(value);
    }
  };

  const handleL2Change = (value) => {
    const newSelected = { ...selected, l2: value, l3: '', l4: '' };
    setSelected(newSelected);
    setCategories(prev => ({ ...prev, l3: [], l4: [] }));
    
    // Fetch L3 categories
    fetchL3Categories(selected.l1, value);
    
    // Notify parent with path
    if (onChange) {
      onChange(`${selected.l1}/${value}`);
    }
  };

  const handleL3Change = (value) => {
    const newSelected = { ...selected, l3: value, l4: '' };
    setSelected(newSelected);
    setCategories(prev => ({ ...prev, l4: [] }));
    
    // Fetch L4 categories
    fetchL4Categories(selected.l1, selected.l2, value);
    
    // Notify parent with path
    if (onChange) {
      onChange(`${selected.l1}/${selected.l2}/${value}`);
    }
  };

  const handleL4Change = (value) => {
    const newSelected = { ...selected, l4: value };
    setSelected(newSelected);
    
    // Notify parent with full path
    if (onChange) {
      onChange(`${selected.l1}/${selected.l2}/${selected.l3}/${value}`);
    }
  };

  // These would normally fetch from backend based on parent selection
  // For now using static data matching the constants
  const fetchL2Categories = (l1) => {
    const l2Options = {
      'Fashion': ['Women', 'Men', 'Kids & Baby'],
      'Health & Beauty': ['Skincare', 'Makeup', 'Haircare', 'Appliances & Tools', 'Fragrance'],
      'Home & Living': ['Furniture', 'Kitchen & Dining', 'Décor', 'Bedding & Bath'],
      'Electronics & Tech': ['Phones & Accessories', 'Computers & Tablets', 'Audio', 'Gaming'],
      'Watches': ['Smartwatches', 'Dress Watches'],
      'Jewellery & Accessories': ['Jewellery', 'Accessories'],
      'Sports & Outdoors': ['Fitness', 'Camping & Hiking', 'Cycling', 'Water Sports', 'Team Sports']
    };
    setCategories(prev => ({ ...prev, l2: l2Options[l1] || [] }));
  };

  const fetchL3Categories = (l1, l2) => {
    const l3Options = {
      'Fashion/Women': ['Clothing', 'Shoes', 'Accessories'],
      'Fashion/Men': ['Clothing', 'Shoes', 'Accessories'],
      'Fashion/Kids & Baby': ['Babywear', 'Girlswear', 'Boyswear', 'Schoolwear'],
      'Health & Beauty/Skincare': ['Cleansers', 'Serums', 'Moisturisers'],
      'Health & Beauty/Makeup': ['Face', 'Eyes', 'Lips'],
      'Health & Beauty/Haircare': ['Shampoo & Conditioner', 'Styling'],
      'Health & Beauty/Fragrance': ['Perfume', 'EDT'],
      'Home & Living/Furniture': ['Living Room', 'Bedroom', 'Dining'],
      'Home & Living/Kitchen & Dining': ['Cookware', 'Dinnerware', 'Glassware'],
      'Home & Living/Décor': ['Lighting', 'Rugs', 'Wall Art'],
      'Home & Living/Bedding & Bath': ['Bedding', 'Towels'],
    };
    const key = `${l1}/${l2}`;
    setCategories(prev => ({ ...prev, l3: l3Options[key] || [] }));
  };

  const fetchL4Categories = (l1, l2, l3) => {
    const l4Options = {
      'Fashion/Women/Clothing': ['Dresses', 'Tops', 'Jeans & Pants', 'Jackets & Coats'],
      'Fashion/Women/Shoes': ['Sneakers', 'Boots', 'Sandals', 'Heels'],
      'Fashion/Women/Accessories': ['Bags', 'Belts', 'Hats & Scarves'],
      'Fashion/Men/Clothing': ['T-Shirts & Polos', 'Shirts', 'Jeans & Pants', 'Jackets & Coats'],
      'Fashion/Men/Shoes': ['Sneakers', 'Boots', 'Dress Shoes'],
      'Fashion/Men/Accessories': ['Wallets', 'Belts', 'Hats'],
    };
    const key = `${l1}/${l2}/${l3}`;
    setCategories(prev => ({ ...prev, l4: l4Options[key] || [] }));
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Loading categories...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          Category Level 1
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Select value={selected.l1} onValueChange={handleL1Change}>
          <SelectTrigger>
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent>
            {categories.l1.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selected.l1 && categories.l2.length > 0 && (
        <div className="space-y-2">
          <Label>
            Category Level 2
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select value={selected.l2} onValueChange={handleL2Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {categories.l2.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selected.l2 && categories.l3.length > 0 && (
        <div className="space-y-2">
          <Label>Category Level 3</Label>
          <Select value={selected.l3} onValueChange={handleL3Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.l3.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selected.l3 && categories.l4.length > 0 && (
        <div className="space-y-2">
          <Label>Category Level 4</Label>
          <Select value={selected.l4} onValueChange={handleL4Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select specific category" />
            </SelectTrigger>
            <SelectContent>
              {categories.l4.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selected.l1 && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <p className="text-gray-600">Selected Path:</p>
          <p className="font-medium text-gray-900 mt-1">
            {[selected.l1, selected.l2, selected.l3, selected.l4].filter(Boolean).join(' > ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
