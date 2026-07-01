import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Package, 
  FileText, 
  FolderTree, 
  ListChecks,
  Grid3x3,
  Image as ImageIcon,
  Search,
  Info
} from 'lucide-react';
import { MultiSelect } from 'react-multi-select-component';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Visual attributes that change product appearance
const VISUAL_ATTRIBUTES = [
  'color', 'colour', 'primary_colour', 'secondary_colour',
  'pattern', 'style', 'finish', 'texture', 'design'
];

const ProductSubmissionV3 = () => {
  // Tab state
  const [currentTab, setCurrentTab] = useState('gtin');
  const [completedTabs, setCompletedTabs] = useState([]);
  
  // Tab 1: GTIN
  const [gtin, setGtin] = useState('');
  const [gtinValidated, setGtinValidated] = useState(false);
  const [gtinExists, setGtinExists] = useState(false);
  const [gtinData, setGtinData] = useState(null);
  const [noGtin, setNoGtin] = useState(false);
  const [existingVariants, setExistingVariants] = useState([]);
  const [existingProductId, setExistingProductId] = useState(null);
  const [submissionFlow, setSubmissionFlow] = useState('new_product'); // 'new_product', 'offer', 'new_variant'
  const [selectedExistingVariant, setSelectedExistingVariant] = useState(null);
  
  // Tab 2: Basics
  const [basics, setBasics] = useState({
    title: '',
    brand: '',
    condition: '',
    short_description: '',
    warranty: ''
  });
  
  // Pre-fill basics when entering new_variant flow
  useEffect(() => {
    if (submissionFlow === 'new_variant' && gtinExists && gtinData) {
      console.log('[PREFILL] useEffect triggered:', { submissionFlow, gtinExists, currentTab });
      console.log('[PREFILL] gtinData:', gtinData);
      console.log('[PREFILL] Current basics state:', basics);
      
      const prefilledBasics = {
        title: gtinData.title || gtinData.name || '',
        brand: gtinData.brand || '',
        condition: 'new',
        short_description: gtinData.short_description || gtinData.description || '',
        warranty: ''
      };
      
      console.log('[PREFILL] Setting basics to:', prefilledBasics);
      setBasics(prefilledBasics);
    }
  }, [submissionFlow, gtinExists, gtinData]);
  const [brands, setBrands] = useState([]);
  const [conditions, setConditions] = useState([]);
  
  // Tab 3: Category & Product Type (Cascading Selection)
  const [categoryLevels, setCategoryLevels] = useState([]);  // Array of selected categories per level
  const [availableCategories, setAvailableCategories] = useState({});  // Map of level -> categories
  const [selectedCategoryId, setSelectedCategoryId] = useState('');  // Final leaf category
  const [isLeafCategory, setIsLeafCategory] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState('');
  const [noProductTypeMappings, setNoProductTypeMappings] = useState(false);
  
  // Tab 4: Product Attributes
  const [productAttributes, setProductAttributes] = useState({});
  const [requiredAttributes, setRequiredAttributes] = useState([]);
  const [optionalAttributes, setOptionalAttributes] = useState([]);
  const [showOptionalAttrs, setShowOptionalAttrs] = useState(false);
  
  // Tab 5: Variants
  const [variantSchema, setVariantSchema] = useState([]);
  const [selectedDimensions, setSelectedDimensions] = useState([]);
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({});
  const [variantImages, setVariantImages] = useState([]);
  const [applyImagesToAllVariants, setApplyImagesToAllVariants] = useState(false);
  const [sharedVariantImages, setSharedVariantImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  
  // Tab 6: SEO
  
  // Tab 7: SEO
  const [seo, setSeo] = useState({
    seo_title: '',
    seo_description: '',
    url_slug: ''
  });
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ==================== TAB 1: GTIN VALIDATION ====================
  
  const validateGtin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/v3/submissions/tab1/gtin-validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gtin })
      });
      
      const data = await response.json();
      
      if (!data.is_valid) {
        setError('Invalid GTIN format. Must be 8, 12, 13, or 14 digits.');
        return;
      }
      
      setGtinValidated(true);
      setGtinExists(data.exists_in_catalog);
      
      if (data.exists_in_catalog) {
        // Store existing product data
        setGtinData(data.product_data);
        setExistingProductId(data.product_id);
        setExistingVariants(data.existing_variants || []);
        
        console.log('✅ Product found in catalog:', data.product_data);
        console.log('✅ Existing variants:', data.existing_variants);
        
        // DON'T auto-advance - let user see what exists first
        // They can click "Continue" button to proceed
      } else {
        // New product - continue as normal
        markTabComplete('gtin');
        setCurrentTab('basics');
      }
      
    } catch (err) {
      setError('Error validating GTIN: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const skipGtin = () => {
    setNoGtin(true);
    setGtinValidated(true);
    markTabComplete('gtin');
    setCurrentTab('basics');
  };

  // ==================== TAB 2: PRODUCT BASICS ====================
  
  useEffect(() => {
    if (currentTab === 'basics') {
      fetchBrandsAndConditions();
    }
  }, [currentTab]);
  
  const fetchBrandsAndConditions = async () => {
    try {
      const [brandsRes, conditionsRes] = await Promise.all([
        fetch(`${API_URL}/api/v3/submissions/tab2/brands`),
        fetch(`${API_URL}/api/v3/submissions/tab2/conditions`)
      ]);
      
      const brandsData = await brandsRes.json();
      const conditionsData = await conditionsRes.json();
      
      setBrands(brandsData.brands || []);
      setConditions(conditionsData.conditions || []);
    } catch (err) {
      console.error('Error fetching basics data:', err);
    }
  };
  
  const validateBasics = () => {
    if (!basics.title || !basics.brand || !basics.condition || !basics.short_description) {
      setError('Please fill all required fields in Product Basics');
      return false;
    }
    markTabComplete('basics');
    setCurrentTab('category');
    return true;
  };

  // ==================== TAB 3: CATEGORY & PRODUCT TYPE ====================
  
  useEffect(() => {
    console.log('[DEBUG] useEffect triggered, currentTab:', currentTab);
    if (currentTab === 'category') {
      console.log('[DEBUG] Calling loadRootCategories');
      loadRootCategories();
    }
  }, [currentTab]);
  
  const loadRootCategories = async () => {
    console.log('[DEBUG] loadRootCategories called');
    try {
      const response = await fetch(`${API_URL}/api/v3/submissions/tab3/categories/root`);
      const data = await response.json();
      console.log('[DEBUG] Root categories response:', data);
      setAvailableCategories({ 0: data.categories || [] });
      console.log('[DEBUG] Set availableCategories:', { 0: data.categories || [] });
      setCategoryLevels([]);
      setSelectedCategoryId('');
      setIsLeafCategory(false);
    } catch (err) {
      console.error('[ERROR] Error fetching root categories:', err);
    }
  };
  
  const handleCategoryLevelChange = async (level, categoryId) => {
    console.log('[DEBUG] handleCategoryLevelChange called:', { level, categoryId });
    
    // If product type was already selected, confirm reset
    if (selectedProductTypeId && completedTabs.includes('category')) {
      const confirmed = window.confirm(
        'Changing the category will reset your product type, attributes, and variants. Continue?'
      );
      if (!confirmed) {
        return;
      }
    }
    
    // Update category selection for this level
    const newLevels = categoryLevels.slice(0, level);
    newLevels[level] = categoryId;
    setCategoryLevels(newLevels);
    console.log('[DEBUG] Updated categoryLevels:', newLevels);
    
    // Clear downstream levels from available categories
    const newAvailableCategories = { ...availableCategories };
    Object.keys(newAvailableCategories).forEach(key => {
      if (parseInt(key) > level) {
        delete newAvailableCategories[key];
      }
    });
    
    // Reset downstream state
    setSelectedCategoryId('');
    setIsLeafCategory(false);
    setSelectedProductType('');
    setSelectedProductTypeId('');
    setProductTypes([]);
    setNoProductTypeMappings(false);
    setProductAttributes({});
    setVariants([]);
    setError('');
    
    // Remove completion status for downstream tabs
    setCompletedTabs(prev => prev.filter(t => 
      !['category', 'attributes', 'variants', 'seo'].includes(t)
    ));
    
    // Check if this is a leaf category
    try {
      console.log('[DEBUG] Checking if leaf category:', categoryId);
      const leafResponse = await fetch(`${API_URL}/api/v3/submissions/tab3/categories/${categoryId}/is-leaf`);
      const leafData = await leafResponse.json();
      console.log('[DEBUG] Leaf check response:', leafData);
      
      if (leafData.is_leaf) {
        // This is a leaf category
        console.log('[DEBUG] Category is leaf - loading product types');
        setIsLeafCategory(true);
        setSelectedCategoryId(categoryId);
        setAvailableCategories(newAvailableCategories);
        
        // Load product types for this leaf category
        await loadProductTypesForCategory(categoryId);
      } else {
        // Not a leaf - load children for next level
        console.log('[DEBUG] Category is NOT leaf - loading children');
        const childResponse = await fetch(`${API_URL}/api/v3/submissions/tab3/categories/${categoryId}/children`);
        const childData = await childResponse.json();
        console.log('[DEBUG] Children response:', childData);
        
        newAvailableCategories[level + 1] = childData.categories || [];
        console.log('[DEBUG] Updated availableCategories:', newAvailableCategories);
        setAvailableCategories(newAvailableCategories);
        setIsLeafCategory(false);
      }
    } catch (err) {
      console.error('[ERROR] Error checking category:', err);
      setError('Error loading category information');
    }
  };
  
  const loadProductTypesForCategory = async (categoryId) => {
    console.log('[DEBUG] loadProductTypesForCategory called with:', categoryId);
    try {
      const url = `${API_URL}/api/v3/submissions/tab3/product-types/${categoryId}`;
      console.log('[DEBUG] Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('[DEBUG] Response status:', response.status);
      console.log('[DEBUG] Response ok:', response.ok);
      
      const data = await response.json();
      console.log('[DEBUG] Product types response:', JSON.stringify(data, null, 2));
      console.log('[DEBUG] data.has_mappings:', data.has_mappings);
      console.log('[DEBUG] data.count:', data.count);
      console.log('[DEBUG] data.product_types length:', data.product_types ? data.product_types.length : 'null');
      
      if (!data.has_mappings || data.count === 0) {
        console.log('[DEBUG] No mappings found - setting error state');
        setProductTypes([]);
        setNoProductTypeMappings(true);
        setError('No product types are mapped to this category yet. Please choose a different category or contact support.');
      } else {
        console.log('[DEBUG] Found', data.count, 'product types - setting success state');
        setProductTypes(data.product_types || []);
        setNoProductTypeMappings(false);
        setError('');
      }
    } catch (err) {
      console.error('[ERROR] Error loading product types:', err);
      console.error('[ERROR] Error stack:', err.stack);
      setError('Error loading product types: ' + err.message);
      setProductTypes([]);
      setNoProductTypeMappings(true);
    }
  };
  
  const handleProductTypeChange = (ptId) => {
    setSelectedProductType(ptId);
    setSelectedProductTypeId(ptId);
  };
  
  const validateCategoryType = () => {
    if (!isLeafCategory) {
      setError('Please complete category selection to the final level');
      return false;
    }
    
    if (!selectedCategoryId) {
      setError('Please select a category');
      return false;
    }
    
    if (noProductTypeMappings) {
      setError('Cannot proceed: No product types are mapped to this category');
      return false;
    }
    
    if (!selectedProductTypeId) {
      setError('Please select a product type');
      return false;
    }
    
    markTabComplete('category');
    setCurrentTab('attributes');
    // Fetch attributes for next tab
    fetchProductAttributes();
    return true;
  };

  // ==================== TAB 4: PRODUCT ATTRIBUTES ====================
  
  const fetchProductAttributes = async () => {
    if (!selectedProductTypeId) return;
    
    setLoading(true);
    try {
      // Use XMLHttpRequest to avoid Response body locking issues
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', `${API_URL}/api/v3/submissions/tab4/attributes/${selectedProductTypeId}`, true);
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ success: true, data });
            } catch (e) {
              reject(new Error('Invalid server response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              resolve({ success: false, error: errorData.detail || 'Failed to fetch attributes' });
            } catch (e) {
              resolve({ success: false, error: `Request failed with status ${xhr.status}` });
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        
        xhr.send();
      });
      
      if (result.success) {
        const data = result.data;
        
        console.log('[DEBUG] Attributes API response:', data);
        console.log('[DEBUG] Required attributes before filter:', data.required_attributes?.length);
        console.log('[DEBUG] Optional attributes before filter:', data.optional_attributes?.length);
        
        // Filter out attributes that are already on Basics tab and unit fields (they'll be rendered inline)
        const filteredRequired = (data.required_attributes || []).filter(
          attr => attr.attribute_code?.toLowerCase() !== 'condition' &&
                  attr.attribute_code?.toLowerCase() !== 'warranty' &&
                  !attr.attribute_code.endsWith('_unit')  // Don't render unit fields separately
        );
        const filteredOptional = (data.optional_attributes || []).filter(
          attr => attr.attribute_code?.toLowerCase() !== 'condition' &&
                  attr.attribute_code?.toLowerCase() !== 'warranty' &&
                  !attr.attribute_code.endsWith('_unit')  // Don't render unit fields separately
        );
        
        // Sort optional attributes to put 'Model' first in free-text fields
        filteredOptional.sort((a, b) => {
          const aIsModel = a.attribute_code?.toLowerCase() === 'model';
          const bIsModel = b.attribute_code?.toLowerCase() === 'model';
          
          if (aIsModel && !bIsModel) return -1;
          if (!aIsModel && bIsModel) return 1;
          return 0;  // Keep original order for others
        });
        
        console.log('[DEBUG] After filtering Condition, Warranty, and _unit fields:');
        console.log('[DEBUG] Required:', filteredRequired.length, filteredRequired.map(a => a.attribute_name));
        console.log('[DEBUG] Optional:', filteredOptional.length, filteredOptional.map(a => a.attribute_name));
        
        setRequiredAttributes(filteredRequired);
        setOptionalAttributes(filteredOptional);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('[ERROR] Error fetching attributes:', err);
      setError('Error fetching attributes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAttributeChange = (attrCode, value) => {
    setProductAttributes(prev => ({
      ...prev,
      [attrCode]: value
    }));
  };
  
  const validateProductAttributes = () => {
    // Check all required attributes are filled
    const missingRequired = requiredAttributes.filter(
      attr => !productAttributes[attr.attribute_code]
    );
    
    if (missingRequired.length > 0) {
      setError(`Please fill required attributes: ${missingRequired.map(a => a.attribute_name).join(', ')}`);
      return false;
    }
    
    markTabComplete('attributes');
    setCurrentTab('variants');
    fetchVariantSchema();
    return true;
  };
  
  const renderAttributeInput = (attr) => {
    const { attribute_code, attribute_name, data_type, options } = attr;
    
    // Check if this is a unit field (e.g., dimensions_height_unit)
    if (attribute_code.endsWith('_unit')) {
      // This is a unit selector - render as dropdown
      return (
        <Select
          value={productAttributes[attribute_code] || ''}
          onValueChange={(val) => handleAttributeChange(attribute_code, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select unit`} />
          </SelectTrigger>
          <SelectContent>
            {options && options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Check if this attribute has a corresponding unit field (e.g., dimensions_height has dimensions_height_unit)
    const hasUnitField = requiredAttributes.some(a => a.attribute_code === `${attribute_code}_unit`) ||
                         optionalAttributes.some(a => a.attribute_code === `${attribute_code}_unit`);
    
    if (hasUnitField) {
      // This is a measurement field with a unit - render numeric input with unit dropdown
      const unitAttr = requiredAttributes.find(a => a.attribute_code === `${attribute_code}_unit`) ||
                       optionalAttributes.find(a => a.attribute_code === `${attribute_code}_unit`);
      
      return (
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              value={productAttributes[attribute_code] || ''}
              onChange={(e) => handleAttributeChange(attribute_code, e.target.value)}
              placeholder={`Enter ${attribute_name}`}
              min="0"
              step="0.01"
            />
          </div>
          <div className="w-32">
            <Select
              value={productAttributes[`${attribute_code}_unit`] || ''}
              onValueChange={(val) => handleAttributeChange(`${attribute_code}_unit`, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {unitAttr && unitAttr.options && unitAttr.options.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    // Multi-select dropdown for multi_option data type
    if (data_type === 'multi_option' && options && options.length > 0) {
      const multiSelectOptions = options.map(opt => ({
        label: opt.label,
        value: opt.value
      }));
      
      const currentValues = productAttributes[attribute_code] || [];
      const selectedOptions = multiSelectOptions.filter(opt => 
        Array.isArray(currentValues) ? currentValues.includes(opt.value) : currentValues === opt.value
      );
      
      return (
        <MultiSelect
          options={multiSelectOptions}
          value={selectedOptions}
          onChange={(selected) => {
            const values = selected.map(s => s.value);
            handleAttributeChange(attribute_code, values);
          }}
          labelledBy={`Select ${attribute_name}`}
          overrideStrings={{
            selectSomeItems: `Select ${attribute_name}...`,
            allItemsAreSelected: "All selected",
            search: "Search",
          }}
          disableSearch={multiSelectOptions.length < 10}
          hasSelectAll={false}
        />
      );
    }
    
    // Single select dropdown
    if (data_type === 'enum' || data_type === 'select' || data_type === 'option' || (options && options.length > 0)) {
      // Special handling for Country of Origin
      if (attribute_code === 'country_of_origin') {
        return (
          <div className="space-y-2">
            <Select
              value={productAttributes[attribute_code] || ''}
              onValueChange={(val) => {
                handleAttributeChange(attribute_code, val);
                if (val.toLowerCase() !== 'other') {
                  // Clear the custom country field if not "other"
                  handleAttributeChange(`${attribute_code}_custom`, '');
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${attribute_name}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Show text input if "Other" is selected */}
            {productAttributes[attribute_code]?.toLowerCase() === 'other' && (
              <div>
                <Input
                  type="text"
                  value={productAttributes[`${attribute_code}_custom`] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow letters, spaces, and hyphens
                    const alphaOnly = value.replace(/[^a-zA-Z\s-]/g, '');
                    handleAttributeChange(`${attribute_code}_custom`, alphaOnly);
                  }}
                  placeholder="Enter country name (letters only)"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter country name using letters only (proper format)
                </p>
              </div>
            )}
          </div>
        );
      }
      
      return (
        <Select
          value={productAttributes[attribute_code] || ''}
          onValueChange={(val) => handleAttributeChange(attribute_code, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${attribute_name}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Special handling for pocket_count FIRST - text field with numeric validation (0-99)
    if (attribute_code === 'pocket_count') {
      return (
        <Input
          type="text"
          value={productAttributes[attribute_code] || ''}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numbers 0-99
            if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 99)) {
              handleAttributeChange(attribute_code, value);
            }
          }}
          placeholder="Enter number (0-99)"
          maxLength={2}
        />
      );
    }
    
    // Numeric input (but pocket_count is handled above)
    if (data_type === 'int' || data_type === 'integer' || data_type === 'numeric') {
      return (
        <Input
          type="number"
          value={productAttributes[attribute_code] || ''}
          onChange={(e) => handleAttributeChange(attribute_code, e.target.value)}
          placeholder={`Enter ${attribute_name}`}
          min="0"
        />
      );
    }
    
    if (data_type === 'long_text' || data_type === 'textarea') {
      return (
        <Textarea
          value={productAttributes[attribute_code] || ''}
          onChange={(e) => handleAttributeChange(attribute_code, e.target.value)}
          placeholder={`Enter ${attribute_name}`}
          rows={3}
        />
      );
    }
    
    // Default: text input
    return (
      <Input
        type="text"
        value={productAttributes[attribute_code] || ''}
        onChange={(e) => handleAttributeChange(attribute_code, e.target.value)}
        placeholder={`Enter ${attribute_name}`}
      />
    );
  };

  // ==================== TAB 5: VARIANTS ====================
  
  const fetchVariantSchema = async () => {
    if (!selectedProductTypeId) return;
    
    setLoading(true);
    try {
      // Use XMLHttpRequest to avoid Response body locking issues
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', `${API_URL}/api/v3/submissions/tab5/variant-schema/${selectedProductTypeId}`, true);
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ success: true, data });
            } catch (e) {
              reject(new Error('Invalid server response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              resolve({ success: false, error: errorData.detail || 'Failed to fetch variant schema' });
            } catch (e) {
              resolve({ success: false, error: `Request failed with status ${xhr.status}` });
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        
        xhr.send();
      });
      
      if (result.success) {
        setVariantSchema(result.data.variant_attributes || []);
        
        // Initialize with one empty variant if none exist
        if (variants.length === 0) {
          setVariants([]);
          setCurrentVariant({});
        }
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError('Error fetching variant schema: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVariantAttributeChange = (attrCode, value) => {
    setCurrentVariant(prev => ({
      ...prev,
      [attrCode]: value
    }));
  };
  
  // Check if variant has visual attributes that require images
  const hasVisualAttributes = (schema) => {
    return schema.some(attr => 
      VISUAL_ATTRIBUTES.includes(attr.attribute_code.toLowerCase())
    );
  };
  
  const handleVariantImageUpload = async (e, isShared = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setLoading(true);
    setError('');
    
    const uploadedUrls = [];
    const errors = [];
    
    // Process files sequentially to avoid any potential race conditions
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate PNG only
      if (file.type !== 'image/png') {
        errors.push(`"${file.name}": Only PNG format accepted`);
        continue;
      }
      
      // Validate size
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`"${file.name}": Exceeds 5MB limit`);
        continue;
      }
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Use XMLHttpRequest instead of fetch to avoid Response body issues
        const uploadResult = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.open('POST', `${API_URL}/api/v3/submissions/tab6/upload-image`, true);
          
          xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve({ success: true, data });
              } catch (e) {
                reject(new Error('Invalid server response'));
              }
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText);
                resolve({ success: false, error: errorData.detail || 'Upload failed' });
              } catch (e) {
                resolve({ success: false, error: `Upload failed with status ${xhr.status}` });
              }
            }
          };
          
          xhr.onerror = function() {
            reject(new Error('Network error during upload'));
          };
          
          xhr.send(formData);
        });
        
        if (uploadResult.success) {
          uploadedUrls.push(uploadResult.data.url);
          console.log(`✅ Uploaded ${file.name}:`, uploadResult.data.url);
        } else {
          errors.push(`"${file.name}": ${uploadResult.error}`);
        }
      } catch (err) {
        errors.push(`"${file.name}": ${err.message}`);
        console.error(`Upload error for ${file.name}:`, err);
      }
    }
    
    // Show errors if any
    if (errors.length > 0) {
      setError(errors.join('\n'));
    }
    
    // Add successfully uploaded images
    if (uploadedUrls.length > 0) {
      if (isShared) {
        setSharedVariantImages(prev => [...prev, ...uploadedUrls]);
      } else {
        setVariantImages(prev => [...prev, ...uploadedUrls]);
      }
    }
    
    setLoading(false);
    e.target.value = '';
  };
  
  const handleVariantImageURL = async (url, isShared = false) => {
    if (!url || url.trim() === '') return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/v3/submissions/tab6/import-image-url?url=${encodeURIComponent(url)}`, {
        method: 'POST',
      });
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Server returned invalid response');
      }
      
      if (!response.ok) {
        throw new Error(data.detail || 'URL import failed');
      }
      
      if (isShared) {
        setSharedVariantImages(prev => [...prev, data.url]);
      } else {
        setVariantImages(prev => [...prev, data.url]);
      }
      
      console.log('✅ Image imported from URL:', data.url);
    } catch (err) {
      setError(`URL import failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const removeVariantImage = (urlToRemove, isShared = false) => {
    if (isShared) {
      setSharedVariantImages(prev => prev.filter(url => url !== urlToRemove));
    } else {
      setVariantImages(prev => prev.filter(url => url !== urlToRemove));
    }
  };
  
  const addVariant = () => {
    // Validate required variant attributes
    const missingRequired = variantSchema.filter(
      attr => attr.required && !currentVariant[attr.attribute_code]
    );
    
    if (missingRequired.length > 0) {
      setError(`Please fill required variant attributes: ${missingRequired.map(a => a.attribute_name).join(', ')}`);
      return;
    }
    
    // Determine which images to use
    let variantImagesList = [];
    if (applyImagesToAllVariants) {
      variantImagesList = [...sharedVariantImages];
    } else if (variantImages.length > 0) {
      variantImagesList = [...variantImages];
    }
    
    // Generate SKU
    const sku = `SKU-${Date.now()}-${variants.length + 1}`;
    
    // Add the variant
    const newVariant = {
      sku: sku,
      gtin: '',  // Add GTIN field for each variant
      price: 0,
      quantity: 0,
      variant_attributes: { ...currentVariant },
      images: variantImagesList
    };
    
    console.log('Adding variant with images:', variantImagesList);
    
    setVariants([...variants, newVariant]);
    setCurrentVariant({}); // Reset for next variant
    if (!applyImagesToAllVariants) {
      setVariantImages([]); // Reset variant images only if not applying to all
    }
    setError('');
  };
  
  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateVariantPriceQty = (index, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const renderVariantAttributeInput = (attr) => {
    const { attribute_code, attribute_name, data_type, options } = attr;
    
    // Multi-select dropdown for multi_option data type
    if (data_type === 'multi_option' && options && options.length > 0) {
      const multiSelectOptions = options.map(opt => ({
        label: opt.label,
        value: opt.value
      }));
      
      const currentValues = currentVariant[attribute_code] || [];
      const selectedOptions = multiSelectOptions.filter(opt => 
        Array.isArray(currentValues) ? currentValues.includes(opt.value) : currentValues === opt.value
      );
      
      return (
        <MultiSelect
          options={multiSelectOptions}
          value={selectedOptions}
          onChange={(selected) => {
            const values = selected.map(s => s.value);
            handleVariantAttributeChange(attribute_code, values);
          }}
          labelledBy={`Select ${attribute_name}`}
          overrideStrings={{
            selectSomeItems: `Select ${attribute_name}...`,
            allItemsAreSelected: "All selected",
            search: "Search",
          }}
          disableSearch={multiSelectOptions.length < 10}
          hasSelectAll={false}
        />
      );
    }
    
    if (data_type === 'enum' || data_type === 'select' || data_type === 'option' || (options && options.length > 0)) {
      return (
        <Select
          value={currentVariant[attribute_code] || ''}
          onValueChange={(val) => handleVariantAttributeChange(attribute_code, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${attribute_name}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Default: text input
    return (
      <Input
        type="text"
        value={currentVariant[attribute_code] || ''}
        onChange={(e) => handleVariantAttributeChange(attribute_code, e.target.value)}
        placeholder={`Enter ${attribute_name}`}
      />
    );
  };
  
  const validateVariants = () => {
    if (variants.length === 0) {
      setError('Please create at least one variant');
      return false;
    }
    
    const invalid = variants.find(v => !v.sku || v.price <= 0 || v.quantity < 0);
    if (invalid) {
      setError('All variants must have SKU, valid price, and quantity');
      return false;
    }
    
    // Check if at least one variant has images
    const hasImages = variants.some(v => v.images && v.images.length > 0);
    if (!hasImages) {
      setError('At least one variant must have images attached');
      return false;
    }
    
    markTabComplete('variants');
    setCurrentTab('seo');
    generateSeoSuggestions();
    return true;
  };

  // ==================== TAB 6: MEDIA ====================
  
  // ==================== TAB 6: SEO ====================
  
  const generateSeoSuggestions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v3/submissions/tab7/generate-seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: basics.title,
          brand: basics.brand,
          category: selectedCategoryId,
          key_attributes: productAttributes
        })
      });
      
      const data = await response.json();
      setSeo(data);
    } catch (err) {
      console.error('Error generating SEO:', err);
    }
  };
  
  const validateSeo = () => {
    if (!seo.seo_title || !seo.seo_description || !seo.url_slug) {
      setError('All SEO fields are required');
      return false;
    }
    markTabComplete('seo');
    return true;
  };

  // ==================== FINAL SUBMISSION ====================
  
  const submitProduct = async () => {
    if (!validateSeo()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        gtin: noGtin ? null : gtin,
        submission_type: submissionFlow, // 'new_product', 'offer', 'new_variant'
        existing_product_id: existingProductId,
        basics: submissionFlow === 'new_product' ? {
          title: basics.title,
          brand: basics.brand,
          condition: basics.condition,
          short_description: basics.short_description,
          warranty: basics.warranty
        } : {},
        category_type: submissionFlow === 'new_product' ? {
          category_id: selectedCategoryId,
          product_type_id: selectedProductTypeId
        } : {},
        product_attributes: submissionFlow === 'new_product' ? productAttributes : {},
        variants: variants.map(v => ({
          ...v,
          variant_attributes: submissionFlow === 'offer' && selectedExistingVariant 
            ? { ...selectedExistingVariant.variant_attributes, _existing_variant_id: selectedExistingVariant.variant_id }
            : v.variant_attributes
        })),
        seo: submissionFlow === 'new_product' ? seo : {}
      };
      
      // Use XMLHttpRequest to avoid Response body locking issues
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('POST', `${API_URL}/api/v3/submissions/submit`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ success: true, data });
            } catch (e) {
              reject(new Error('Invalid server response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              resolve({ success: false, error: errorData.detail || 'Submission failed' });
            } catch (e) {
              resolve({ success: false, error: `Submission failed with status ${xhr.status}` });
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error during submission'));
        };
        
        xhr.send(JSON.stringify(payload));
      });
      
      if (result.success) {
        setSuccess('Product submitted successfully! Pending approval.');
        
        // Reset form after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Better error display
        const errorMsg = typeof result.error === 'object' 
          ? JSON.stringify(result.error, null, 2) 
          : result.error;
        throw new Error(errorMsg);
      }
      
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err.message || String(err);
      setError('Submission failed: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ==================== HELPERS ====================
  
  const markTabComplete = (tabName) => {
    if (!completedTabs.includes(tabName)) {
      setCompletedTabs(prev => [...prev, tabName]);
    }
  };
  
  const isTabAccessible = (tabName) => {
    const tabOrder = ['gtin', 'basics', 'category', 'attributes', 'variants', 'seo'];
    const currentIndex = tabOrder.indexOf(tabName);
    const completedUpTo = tabOrder.filter(t => completedTabs.includes(t)).length;
    return currentIndex <= completedUpTo;
  };

  // ==================== RENDER ====================

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl bg-gradient-to-br from-[#FF3CFE] via-brand-900 to-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Product Submission</h1>
        <p className="text-white/80">GTIN-First · Schema-Driven · Step-by-Step</p>
        <p className="text-xs text-white/60">Version: 3.2.2 - Pre-fill With useEffect</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid grid-cols-7 gap-2">
          <TabsTrigger 
            value="gtin" 
            disabled={!isTabAccessible('gtin')}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            GTIN
            {completedTabs.includes('gtin') && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
          
          <TabsTrigger 
            value="basics" 
            disabled={!isTabAccessible('basics')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Basics
            {completedTabs.includes('basics') && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
          
          <TabsTrigger 
            value="category" 
            disabled={!isTabAccessible('category')}
            className="flex items-center gap-2"
          >
            <FolderTree className="h-4 w-4" />
            Category
            {completedTabs.includes('category') && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
          
          <TabsTrigger 
            value="attributes" 
            disabled={!isTabAccessible('attributes')}
            className="flex items-center gap-2"
          >
            <ListChecks className="h-4 w-4" />
            Attributes
            {completedTabs.includes('attributes') && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
          
          <TabsTrigger 
            value="variants" 
            disabled={!isTabAccessible('variants')}
            className="flex items-center gap-2"
          >
            <Grid3x3 className="h-4 w-4" />
            Variants
            {completedTabs.includes('variants') && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
          
          <TabsTrigger 
            value="seo" 
            disabled={!isTabAccessible('seo')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            SEO
            {completedTabs.includes('seo') && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: GTIN */}
        <TabsContent value="gtin">
          <Card>
            <CardHeader>
              <CardTitle>GTIN Validation</CardTitle>
              <CardDescription>
                Enter your GTIN to check if the product already exists in our catalog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* GTIN Input - Only show if not yet validated */}
              {!gtinValidated && (
                <>
                  <div>
                    <Label htmlFor="gtin">GTIN (8, 12, 13, or 14 digits)</Label>
                    <Input
                      id="gtin"
                      type="text"
                      value={gtin}
                      onChange={(e) => setGtin(e.target.value)}
                      placeholder="Enter GTIN"
                      disabled={noGtin}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={validateGtin} 
                      disabled={!gtin || noGtin || loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Validate GTIN
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={skipGtin}
                    >
                      No GTIN / Create New Product
                    </Button>
                  </div>
                </>
              )}
              
              {/* Product Exists - Show Details */}
              {gtinValidated && gtinExists && gtinData && (
                <div className="space-y-4">
                  <Alert className={gtinData.status === 'pending_approval' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}>
                    <AlertCircle className={`h-4 w-4 ${gtinData.status === 'pending_approval' ? 'text-yellow-600' : 'text-blue-600'}`} />
                    <AlertTitle className={gtinData.status === 'pending_approval' ? 'text-yellow-900' : 'text-blue-900'}>
                      {gtinData.status === 'pending_approval' ? 'Product Pending Approval!' : 'Product Found in Catalog!'}
                    </AlertTitle>
                    <AlertDescription className={gtinData.status === 'pending_approval' ? 'text-yellow-800' : 'text-blue-800'}>
                      {gtinData.status === 'pending_approval' 
                        ? 'This GTIN already has a pending submission awaiting admin approval.'
                        : 'This GTIN already exists. You can create an offer for existing variants or propose a new variant.'}
                    </AlertDescription>
                  </Alert>
                  
                  {/* Product Info */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex gap-4">
                      {gtinData.images && gtinData.images.length > 0 && (
                        <img 
                          src={gtinData.images[0]} 
                          alt="Product" 
                          className="h-32 w-32 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{gtinData.name || gtinData.title}</h3>
                        <p className="text-sm text-gray-600">Brand: {gtinData.brand}</p>
                        <p className="text-sm text-gray-600">GTIN: {gtin}</p>
                        {gtinData.description && (
                          <p className="text-sm text-gray-500 mt-2">{gtinData.description.substring(0, 150)}...</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Existing Variants */}
                  {existingVariants && existingVariants.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Existing Variants ({existingVariants.length}):</h4>
                      <div className="space-y-3">
                        {existingVariants.map((variant, idx) => {
                          // Filter out None/Not Applicable values
                          const relevantAttributes = Object.entries(variant.variant_attributes || {})
                            .filter(([key, value]) => {
                              if (!value) return false;
                              if (typeof value === 'string') {
                                const lowerVal = value.toLowerCase();
                                return !lowerVal.includes('none') && 
                                       !lowerVal.includes('not applicable') &&
                                       lowerVal.trim() !== '';
                              }
                              if (Array.isArray(value)) {
                                return value.length > 0 && 
                                       !value.some(v => typeof v === 'string' && (v.toLowerCase().includes('none') || v.toLowerCase().includes('not applicable')));
                              }
                              return true;
                            });
                          
                          // Get primary image
                          const variantImage = variant.images && variant.images.length > 0 
                            ? variant.images[0] 
                            : (gtinData.images && gtinData.images.length > 0 ? gtinData.images[0] : null);
                          
                          return (
                            <div key={idx} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                              <div className="flex gap-4">
                                {/* Variant Image Thumbnail */}
                                {variantImage && (
                                  <div className="flex-shrink-0">
                                    <img 
                                      src={variantImage} 
                                      alt={`Variant ${idx + 1}`} 
                                      className="h-24 w-24 object-cover rounded border"
                                    />
                                    {variant.images && variant.images.length > 1 && (
                                      <p className="text-xs text-gray-500 text-center mt-1">
                                        +{variant.images.length - 1} more
                                      </p>
                                    )}
                                  </div>
                                )}
                                
                                {/* Variant Details */}
                                <div className="flex-1">
                                  <h5 className="font-semibold text-md mb-2">Variant {idx + 1}</h5>
                                  
                                  {/* Show only relevant attributes */}
                                  {relevantAttributes.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {relevantAttributes.map(([key, value]) => (
                                        <span 
                                          key={key} 
                                          className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm"
                                        >
                                          <strong className="text-blue-900">{key.replace(/_/g, ' ')}:</strong>
                                          <span className="ml-1 text-blue-700">
                                            {Array.isArray(value) ? value.join(', ') : value}
                                          </span>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 mb-3">No variant-specific attributes</p>
                                  )}
                                  
                                  {/* Action Buttons */}
                                  <div className="flex gap-2 mt-2">
                                    <Button 
                                      size="sm" 
                                      variant="default"
                                      onClick={() => {
                                        setSelectedExistingVariant(variant);
                                        setSubmissionFlow('offer');
                                        markTabComplete('gtin');
                                        setCurrentTab('variants');
                                      }}
                                      className="text-xs"
                                    >
                                      Select This Variant
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">What would you like to do?</p>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        console.log('[NEW_VARIANT] Button clicked');
                        console.log('[NEW_VARIANT] gtinData:', gtinData);
                        
                        // Set submission flow first
                        setSubmissionFlow('new_variant');
                        
                        // Pre-fill existing product data immediately
                        if (gtinData) {
                          const prefilledBasics = {
                            title: gtinData.title || gtinData.name || '',
                            brand: gtinData.brand || '',
                            condition: 'new',
                            short_description: gtinData.short_description || gtinData.description || '',
                            warranty: ''
                          };
                          console.log('[NEW_VARIANT] Pre-filling basics with:', prefilledBasics);
                          setBasics(prefilledBasics);
                        }
                        
                        // Complete GTIN tab and navigate to basics
                        markTabComplete('gtin');
                        setCurrentTab('basics');
                      }}
                    >
                      Add New Variant to This Product
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        setSubmissionFlow('new_product');
                        markTabComplete('gtin');
                        setCurrentTab('basics');
                      }}
                    >
                      Continue as New Product (Full Submission)
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      variant="ghost"
                      onClick={() => {
                        // Reset and start fresh
                        setGtinValidated(false);
                        setGtinExists(false);
                        setGtinData(null);
                        setExistingVariants([]);
                        setExistingProductId(null);
                        setGtin('');
                        setSubmissionFlow('new_product');
                        setSelectedExistingVariant(null);
                      }}
                    >
                      Different Product / Start Over
                    </Button>
                  </div>
                </div>
              )}
              
              {/* New Product - Confirmed */}
              {gtinValidated && !gtinExists && (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      GTIN validated! This is a new product. Continue to enter product details.
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={() => { markTabComplete('gtin'); setCurrentTab('basics'); }}>
                    Continue to Product Details
                  </Button>
                </div>
              )}
              
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: BASICS */}
        <TabsContent value="basics">
          <Card>
            <CardHeader>
              <CardTitle>Product Basics</CardTitle>
              <CardDescription>Core product information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Show alert if adding new variant to existing product */}
              {submissionFlow === 'new_variant' && gtinExists && gtinData && (
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Adding New Variant:</strong> Product details below are from the existing product "{gtinData.name}". 
                    You'll define the new variant attributes on the Variants tab.
                  </AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={basics.title}
                  onChange={(e) => setBasics({...basics, title: e.target.value})}
                  readOnly={gtinExists}
                  className={gtinExists ? 'bg-gray-100 cursor-not-allowed' : ''}
                  placeholder="Enter product title"
                />
              </div>
              
              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={basics.brand}
                  onChange={(e) => setBasics({...basics, brand: e.target.value})}
                  readOnly={gtinExists}
                  className={gtinExists ? 'bg-gray-100 cursor-not-allowed' : ''}
                  placeholder="Enter brand name"
                />
              </div>
              
              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={basics.condition}
                  onValueChange={(val) => setBasics({...basics, condition: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map(cond => (
                      <SelectItem key={cond.value} value={cond.value}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={basics.short_description}
                  onChange={(e) => setBasics({...basics, short_description: e.target.value})}
                  readOnly={gtinExists}
                  className={gtinExists ? 'bg-gray-100 cursor-not-allowed' : ''}
                  rows={4}
                  placeholder="Enter product description"
                />
              </div>
              
              <div>
                <Label htmlFor="warranty">Warranty (Optional)</Label>
                <Input
                  id="warranty"
                  value={basics.warranty}
                  onChange={(e) => setBasics({...basics, warranty: e.target.value})}
                  placeholder="E.g., 1 year manufacturer warranty"
                />
              </div>
              
              <Button onClick={validateBasics}>Continue to Category</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: CATEGORY & PRODUCT TYPE */}
        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Category & Product Type</CardTitle>
              <CardDescription>
                Select category level by level until you reach the final category, then choose a product type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cascading Category Dropdowns */}
              {console.log('[DEBUG] Rendering category dropdowns, availableCategories:', availableCategories)}
              {Object.keys(availableCategories).map((level) => {
                const levelNum = parseInt(level);
                const cats = availableCategories[levelNum];
                console.log(`[DEBUG] Level ${levelNum}, categories:`, cats);
                
                if (!cats || cats.length === 0) return null;
                
                return (
                  <div key={level}>
                    <Label htmlFor={`category-level-${level}`}>
                      Category Level {levelNum + 1} *
                    </Label>
                    <Select 
                      value={categoryLevels[levelNum] || ''} 
                      onValueChange={(val) => handleCategoryLevelChange(levelNum, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select level ${levelNum + 1} category`} />
                      </SelectTrigger>
                      <SelectContent>
                        {cats.map(cat => (
                          <SelectItem key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
              
              {isLeafCategory && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Category selection complete. Now select a product type.
                  </AlertDescription>
                </Alert>
              )}
              
              {noProductTypeMappings && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No product types are mapped to this category yet. Please choose a different category or contact support.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Product Type Dropdown - Only shown when leaf category selected */}
              {isLeafCategory && (
                <div>
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select 
                    value={selectedProductType} 
                    onValueChange={handleProductTypeChange}
                    disabled={noProductTypeMappings || productTypes.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        noProductTypeMappings 
                          ? "No product types available" 
                          : "Select product type"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map(pt => (
                        <SelectItem key={pt.product_type_id} value={pt.product_type_id}>
                          {pt.product_type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button onClick={validateCategoryType} disabled={!isLeafCategory || !selectedProductTypeId}>
                Continue to Attributes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: ATTRIBUTES */}
        <TabsContent value="attributes">
          <Card>
            <CardHeader>
              <CardTitle>Product Attributes</CardTitle>
              <CardDescription>
                Product-level attributes (applied to the entire product)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Required Attributes - 2 Column Grid */}
                  {requiredAttributes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Required Fields ({requiredAttributes.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requiredAttributes.map(attr => (
                          <div key={attr.attribute_code}>
                            <Label>{attr.attribute_name} *</Label>
                            {renderAttributeInput(attr)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Optional Attributes - Separate Dropdown/Select from Free Text */}
                  {optionalAttributes.length > 0 && (
                    <>
                      {/* Optional Dropdown/Select Attributes - 2 Column Grid */}
                      {optionalAttributes.filter(attr => 
                        !attr.attribute_code.endsWith('_unit') &&  // Skip unit fields (rendered inline)
                        (attr.data_type === 'option' || 
                        attr.data_type === 'multi_option' || 
                        attr.data_type === 'enum' || 
                        attr.data_type === 'select' ||
                        attr.attribute_code === 'pocket_count' ||  // Include pocket_count here
                        (attr.options && attr.options.length > 0))
                      ).length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Optional Fields ({optionalAttributes.filter(attr => 
                              !attr.attribute_code.endsWith('_unit') &&  // Skip unit fields
                              (attr.data_type === 'option' || 
                              attr.data_type === 'multi_option' || 
                              attr.data_type === 'enum' || 
                              attr.data_type === 'select' ||
                              attr.attribute_code === 'pocket_count' ||
                              (attr.options && attr.options.length > 0))
                            ).length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {optionalAttributes
                              .filter(attr => 
                                !attr.attribute_code.endsWith('_unit') &&  // Skip unit fields
                                (attr.data_type === 'option' || 
                                attr.data_type === 'multi_option' || 
                                attr.data_type === 'enum' || 
                                attr.data_type === 'select' ||
                                attr.attribute_code === 'pocket_count' ||
                                (attr.options && attr.options.length > 0))
                              )
                              .map(attr => (
                                <div key={attr.attribute_code}>
                                  <Label>{attr.attribute_name}</Label>
                                  {renderAttributeInput(attr)}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Free Text Fields - Grouped Together */}
                      {optionalAttributes.filter(attr => 
                        !attr.attribute_code.endsWith('_unit') &&  // Skip unit fields
                        (attr.data_type === 'text' || 
                        attr.data_type === 'long_text' || 
                        attr.data_type === 'textarea') &&
                        attr.attribute_code !== 'country_of_origin' &&
                        attr.attribute_code !== 'pocket_count' &&
                        (!attr.options || attr.options.length === 0)
                      ).length > 0 && (
                        <div className="space-y-4 mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-lg text-blue-900">
                                Additional Details (Free Text)
                              </h3>
                              <p className="text-sm text-blue-700 mt-1">
                                These fields accept custom text. Provide detailed information to help buyers make informed decisions.
                              </p>
                              <p className="text-xs text-blue-600 mt-2 font-medium">
                                ✓ Basic HTML formatting accepted (will render on product pages)
                                <br />
                                ✓ Avoid special characters unless necessary for formatting
                                <br />
                                ✓ Keep descriptions clear and professional
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {optionalAttributes
                              .filter(attr => 
                                !attr.attribute_code.endsWith('_unit') &&  // Skip unit fields
                                (attr.data_type === 'text' || 
                                attr.data_type === 'long_text' || 
                                attr.data_type === 'textarea') &&
                                attr.attribute_code !== 'country_of_origin' &&
                                attr.attribute_code !== 'pocket_count' &&
                                (!attr.options || attr.options.length === 0)
                              )
                              .map(attr => (
                                <div key={attr.attribute_code}>
                                  <Label>{attr.attribute_name}</Label>
                                  {renderAttributeInput(attr)}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {requiredAttributes.length === 0 && optionalAttributes.length === 0 && (
                    <p className="text-gray-500">No attributes defined for this product type.</p>
                  )}
                  
                  <Button onClick={validateProductAttributes} className="mt-6">Continue to Variants</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: VARIANTS */}
        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                {submissionFlow === 'offer' && selectedExistingVariant
                  ? 'Creating offer for existing variant - add your price, quantity, and condition'
                  : submissionFlow === 'new_variant'
                  ? 'Proposing new variant for existing product'
                  : 'Define variants like color, size, etc. Add one variant at a time.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Show context for offer flow */}
              {submissionFlow === 'offer' && selectedExistingVariant && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">Creating Offer for Existing Variant</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    <p className="font-semibold mb-2">{gtinData?.name}</p>
                    <div className="flex gap-2">
                      {Object.entries(selectedExistingVariant.variant_attributes || {})
                        .filter(([k, v]) => v && typeof v === 'string' && !v.toLowerCase().includes('none') && !v.toLowerCase().includes('not applicable'))
                        .map(([key, value]) => (
                          <span key={key} className="px-2 py-1 bg-blue-100 rounded text-sm">
                            {key}: <strong>{value}</strong>
                          </span>
                        ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Show context for new variant flow */}
              {submissionFlow === 'new_variant' && gtinData && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-900">Proposing New Variant</AlertTitle>
                  <AlertDescription className="text-yellow-800">
                    <p>You're adding a new variant to: <strong>{gtinData.name}</strong></p>
                    <p className="text-sm mt-1">This will require admin approval before going live.</p>
                  </AlertDescription>
                </Alert>
              )}
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  {/* OFFER FLOW: Simplified Form */}
                  {submissionFlow === 'offer' && selectedExistingVariant ? (
                    <div className="space-y-6">
                      <div className="border rounded-lg p-6 bg-white space-y-4">
                        <h3 className="font-semibold text-lg">Your Offer Details</h3>
                        <p className="text-sm text-gray-600">
                          You're creating an offer for an existing variant. Just add your seller-specific details below.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="offer-sku">Your SKU *</Label>
                            <Input
                              id="offer-sku"
                              placeholder="Enter your SKU"
                              value={currentVariant.sku || ''}
                              onChange={(e) => setCurrentVariant({...currentVariant, sku: e.target.value})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="offer-condition">Condition *</Label>
                            <select
                              id="offer-condition"
                              className="w-full p-2 border rounded"
                              value={currentVariant.condition || 'new'}
                              onChange={(e) => setCurrentVariant({...currentVariant, condition: e.target.value})}
                            >
                              <option value="new">New</option>
                              <option value="like_new">Like New</option>
                              <option value="good">Good</option>
                              <option value="fair">Fair</option>
                            </select>
                          </div>
                          
                          <div>
                            <Label htmlFor="offer-price">Your Price *</Label>
                            <Input
                              id="offer-price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={currentVariant.price || ''}
                              onChange={(e) => setCurrentVariant({...currentVariant, price: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="offer-quantity">Your Quantity *</Label>
                            <Input
                              id="offer-quantity"
                              type="number"
                              placeholder="0"
                              value={currentVariant.quantity || ''}
                              onChange={(e) => setCurrentVariant({...currentVariant, quantity: parseInt(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        
                        {/* Optional: Condition-specific images */}
                        <div className="mt-4">
                          <Label>Your Product Images (Optional)</Label>
                          <p className="text-sm text-gray-600 mb-2">
                            Upload images showing the actual condition of YOUR product
                          </p>
                          <Input
                            type="file"
                            accept="image/png"
                            multiple
                            onChange={handleVariantImageUpload}
                          />
                          
                          {/* Show uploaded images */}
                          {variantImages.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {variantImages.map((img, idx) => (
                                <div key={idx} className="relative">
                                  <img src={img} alt={`Upload ${idx + 1}`} className="h-20 w-20 object-cover rounded border" />
                                  <button
                                    type="button"
                                    onClick={() => setVariantImages(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => {
                            if (!currentVariant.sku || !currentVariant.price || !currentVariant.quantity) {
                              setError('Please fill in SKU, price, and quantity');
                              return;
                            }
                            
                            const offer = {
                              sku: currentVariant.sku,
                              price: currentVariant.price,
                              quantity: currentVariant.quantity,
                              condition: currentVariant.condition || 'new',
                              variant_attributes: selectedExistingVariant.variant_attributes,
                              images: variantImages
                            };
                            
                            setVariants([offer]);
                            markTabComplete('variants');
                            setCurrentTab('seo');
                          }}
                          className="w-full"
                        >
                          Continue to SEO
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                  {/* NORMAL FLOW: Variant Attribute Input Form */}
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    <h3 className="font-semibold">Add New Variant</h3>
                    
                    {variantSchema.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {variantSchema.map(attr => (
                            <div key={attr.attribute_code}>
                              <Label>
                                {attr.attribute_name} {attr.required && '*'}
                              </Label>
                              {renderVariantAttributeInput(attr)}
                            </div>
                          ))}
                        </div>
                        
                        {/* Variant Images - Show if variant has visual attributes */}
                        {hasVisualAttributes(variantSchema) && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
                            <div className="flex items-start gap-2">
                              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-blue-900 text-lg">Product Images</h4>
                                <p className="text-sm text-blue-800 mt-1">
                                  Upload clear, high-quality images that accurately show your product.
                                </p>
                              </div>
                            </div>
                            
                            {/* Image Requirements */}
                            <div className="bg-white p-3 rounded border border-blue-200">
                              <h5 className="font-semibold text-sm text-gray-900 mb-2">Image Requirements</h5>
                              <ul className="text-xs text-gray-700 space-y-1">
                                <li>• <strong>Minimum 3 images</strong> (5–8 recommended)</li>
                                <li>• <strong>PNG format only</strong></li>
                                <li>• <strong>Minimum 1200 × 1200 px</strong></li>
                                <li>• <strong>Square images (1:1) work best</strong></li>
                                <li>• First image should be product only on a clean background</li>
                                <li>• No text, logos, borders, or watermarks</li>
                              </ul>
                            </div>
                            
                            {/* Variant Images Info */}
                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                              <p className="text-xs font-semibold text-yellow-900">Variant Images</p>
                              <p className="text-xs text-yellow-800 mt-1">
                                If your product has colour or style variants, each variant must have at least one accurate image.
                              </p>
                            </div>
                            
                            {/* Option: Apply same images to all variants */}
                            <div className="flex items-center gap-2 p-2 bg-white rounded border">
                              <input
                                type="checkbox"
                                id="applyToAll"
                                checked={applyImagesToAllVariants}
                                onChange={(e) => {
                                  setApplyImagesToAllVariants(e.target.checked);
                                  if (e.target.checked) {
                                    setSharedVariantImages([...variantImages]);
                                    setVariantImages([]);
                                  } else {
                                    setVariantImages([...sharedVariantImages]);
                                    setSharedVariantImages([]);
                                  }
                                }}
                                className="rounded"
                              />
                              <Label htmlFor="applyToAll" className="cursor-pointer font-medium text-gray-900">
                                Apply same images to all variants
                              </Label>
                            </div>
                            
                            {applyImagesToAllVariants ? (
                              // Shared images for all variants
                              <div className="space-y-3">
                                <p className="text-sm text-blue-800">
                                  Upload images once - they will be applied to all variants you add.
                                </p>
                                
                                {/* File Upload */}
                                <div>
                                  <Label className="text-sm font-semibold">Upload Image Files (Recommended)</Label>
                                  <Input
                                    type="file"
                                    accept="image/png"
                                    multiple
                                    onChange={(e) => handleVariantImageUpload(e, true)}
                                    className="mt-1"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Select multiple PNG files at once</p>
                                </div>
                                
                                {/* URL Import */}
                                <div>
                                  <Label className="text-sm font-semibold">Or Import via URL (Advanced)</Label>
                                  <div className="flex gap-2 mt-1">
                                    <Input
                                      type="url"
                                      placeholder="https://example.com/image.png"
                                      value={imageUrlInput}
                                      onChange={(e) => setImageUrlInput(e.target.value)}
                                    />
                                    <Button 
                                      type="button"
                                      onClick={() => {
                                        handleVariantImageURL(imageUrlInput, true);
                                        setImageUrlInput('');
                                      }}
                                      disabled={!imageUrlInput}
                                    >
                                      Import
                                    </Button>
                                  </div>
                                  <p className="text-xs text-orange-600 mt-1">
                                    ⚠️ Images via URL must be publicly accessible and may stop working if source changes.
                                  </p>
                                </div>
                                
                                {/* Image Previews */}
                                {sharedVariantImages.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold mb-2">
                                      Uploaded Images ({sharedVariantImages.length}/10)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {sharedVariantImages.map((url, idx) => (
                                        <div key={idx} className="relative">
                                          <img 
                                            src={url} 
                                            alt={`Shared ${idx + 1}`} 
                                            className={`h-24 w-24 object-cover rounded border-2 ${idx === heroImageIndex ? 'border-yellow-500' : 'border-gray-300'}`}
                                          />
                                          {idx === heroImageIndex && (
                                            <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs px-1 rounded">⭐ Hero</div>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => setHeroImageIndex(idx)}
                                            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1"
                                          >
                                            {idx === heroImageIndex ? 'Hero' : 'Set Hero'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => removeVariantImage(url, true)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                    {sharedVariantImages.length < 3 && (
                                      <p className="text-xs text-orange-600 mt-2">⚠️ Minimum 3 images required</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Individual images per variant
                              <div className="space-y-3">
                                <p className="text-sm text-blue-800">
                                  Upload different images for each variant, or leave blank to use product-level images.
                                </p>
                                
                                {/* File Upload */}
                                <div>
                                  <Label className="text-sm font-semibold">Upload Image Files (Recommended)</Label>
                                  <Input
                                    type="file"
                                    accept="image/png"
                                    multiple
                                    onChange={(e) => handleVariantImageUpload(e, false)}
                                    className="mt-1"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Select multiple PNG files at once</p>
                                </div>
                                
                                {/* URL Import */}
                                <div>
                                  <Label className="text-sm font-semibold">Or Import via URL (Advanced)</Label>
                                  <div className="flex gap-2 mt-1">
                                    <Input
                                      type="url"
                                      placeholder="https://example.com/image.png"
                                      value={imageUrlInput}
                                      onChange={(e) => setImageUrlInput(e.target.value)}
                                    />
                                    <Button 
                                      type="button"
                                      onClick={() => {
                                        handleVariantImageURL(imageUrlInput, false);
                                        setImageUrlInput('');
                                      }}
                                      disabled={!imageUrlInput}
                                    >
                                      Import
                                    </Button>
                                  </div>
                                  <p className="text-xs text-orange-600 mt-1">
                                    ⚠️ Images via URL must be publicly accessible and may stop working if source changes.
                                  </p>
                                </div>
                                
                                {/* Image Previews */}
                                {variantImages.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold mb-2">
                                      Uploaded Images ({variantImages.length}/10)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {variantImages.map((url, idx) => (
                                        <div key={idx} className="relative">
                                          <img 
                                            src={url} 
                                            alt={`Variant ${idx + 1}`} 
                                            className={`h-24 w-24 object-cover rounded border-2 ${idx === 0 ? 'border-yellow-500' : 'border-gray-300'}`}
                                          />
                                          {idx === 0 && (
                                            <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs px-1 rounded">⭐ Hero</div>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => removeVariantImage(url, false)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                    {variantImages.length < 3 && (
                                      <p className="text-xs text-orange-600 mt-2">⚠️ Minimum 3 images recommended</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <Button onClick={addVariant} className="w-full mt-4">
                          Add Variant
                        </Button>
                      </>
                    ) : (
                      <p className="text-gray-500">No variant attributes defined for this product type.</p>
                    )}
                  </div>
                  
                  {/* List of Added Variants */}
                  {variants.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Added Variants ({variants.length})</h3>
                      
                      {variants.map((variant, idx) => (
                        <div key={idx} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-medium">Variant {idx + 1}</p>
                              {Object.entries(variant.variant_attributes).map(([key, value]) => (
                                <p key={key} className="text-sm text-gray-600">
                                  {key}: <span className="font-medium">{value}</span>
                                </p>
                              ))}
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeVariant(idx)}
                            >
                              Remove
                            </Button>
                          </div>
                          
                          {/* Display variant images */}
                          {variant.images && variant.images.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <Label className="text-xs font-semibold mb-2 block">Variant Images ({variant.images.length})</Label>
                              <div className="flex gap-2 flex-wrap">
                                {variant.images.map((imgUrl, imgIdx) => (
                                  <div key={imgIdx} className="relative">
                                    <img 
                                      src={imgUrl} 
                                      alt={`Variant ${idx + 1} - Image ${imgIdx + 1}`} 
                                      className="h-20 w-20 object-cover rounded border"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t">
                            <div>
                              <Label className="text-xs">SKU *</Label>
                              <Input
                                value={variant.sku}
                                onChange={(e) => updateVariantPriceQty(idx, 'sku', e.target.value)}
                                placeholder="SKU"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">GTIN</Label>
                              <Input
                                value={variant.gtin || ''}
                                onChange={(e) => updateVariantPriceQty(idx, 'gtin', e.target.value)}
                                placeholder="GTIN (optional)"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Price *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) => updateVariantPriceQty(idx, 'price', parseFloat(e.target.value))}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Quantity *</Label>
                              <Input
                                type="number"
                                value={variant.quantity}
                                onChange={(e) => updateVariantPriceQty(idx, 'quantity', parseInt(e.target.value))}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    onClick={validateVariants} 
                    disabled={variants.length === 0}
                    className="w-full"
                  >
                    Continue to SEO
                  </Button>
                </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization</CardTitle>
              <CardDescription>
                Optimize your product for search engines (final gate before submission)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title * (max 60 characters)</Label>
                <Input
                  id="seoTitle"
                  value={seo.seo_title}
                  onChange={(e) => setSeo({...seo, seo_title: e.target.value})}
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{seo.seo_title.length}/60 characters</p>
              </div>
              
              <div>
                <Label htmlFor="seoDescription">SEO Description * (max 160 characters)</Label>
                <Textarea
                  id="seoDescription"
                  value={seo.seo_description}
                  onChange={(e) => setSeo({...seo, seo_description: e.target.value})}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">{seo.seo_description.length}/160 characters</p>
              </div>
              
              <div>
                <Label htmlFor="urlSlug">URL Slug *</Label>
                <Input
                  id="urlSlug"
                  value={seo.url_slug}
                  onChange={(e) => setSeo({...seo, url_slug: e.target.value})}
                />
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Review all information before submitting. Your product will be sent for approval.
                </AlertDescription>
              </Alert>
              
              {/* Show validation status */}
              {!completedTabs.includes('gtin') || !completedTabs.includes('basics') || 
               !completedTabs.includes('category') || !completedTabs.includes('attributes') || 
               !completedTabs.includes('variants') ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please complete all previous tabs before submitting:
                    {!completedTabs.includes('gtin') && <span className="block">• GTIN validation required</span>}
                    {!completedTabs.includes('basics') && <span className="block">• Product basics required</span>}
                    {!completedTabs.includes('category') && <span className="block">• Category selection required</span>}
                    {!completedTabs.includes('attributes') && <span className="block">• Product attributes required</span>}
                    {!completedTabs.includes('variants') && <span className="block">• At least one variant required</span>}
                  </AlertDescription>
                </Alert>
              ) : null}
              
              <Button 
                onClick={submitProduct} 
                disabled={loading || !completedTabs.includes('gtin') || !completedTabs.includes('basics') || 
                         !completedTabs.includes('category') || !completedTabs.includes('attributes') || 
                         !completedTabs.includes('variants')}
                className="w-full"
                size="lg"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Product for Approval
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductSubmissionV3;
