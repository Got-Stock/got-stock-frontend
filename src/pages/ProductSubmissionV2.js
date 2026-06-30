import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Search, Package, AlertCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductSubmissionV2 = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState('gtin'); // 'gtin', 'listing', 'submission'
  const [gtin, setGtin] = useState('');
  const [gtinValidation, setGtinValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Categories and types
  const [categoriesL1, setCategoriesL1] = useState([]);
  const [categoriesL2, setCategoriesL2] = useState([]);
  const [categoriesL3, setCategoriesL3] = useState([]);
  const [categoriesL4, setCategoriesL4] = useState([]);
  const [selectedCategoryL1, setSelectedCategoryL1] = useState('');
  const [selectedCategoryL2, setSelectedCategoryL2] = useState('');
  const [selectedCategoryL3, setSelectedCategoryL3] = useState('');
  const [selectedCategoryL4, setSelectedCategoryL4] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  
  // Dynamic attributes
  const [productFields, setProductFields] = useState([]);
  const [variantFields, setVariantFields] = useState([]);
  const [listingFields, setListingFields] = useState([]);
  
  // Listing data (when variant exists)
  const [listingData, setListingData] = useState({
    price: '',
    stock_qty: '',
    condition: 'new',
    lead_time_days: 3
  });
  
  // Submission data (when variant doesn't exist)
  const [submissionData, setSubmissionData] = useState({
    name: '',
    brand: '',
    model: '',
    description: '',
    attributes: {},
    variants: [],
    images: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: []
  });
  
  const [variants, setVariants] = useState([{ gtin: '', variant_attributes: {} }]);
  const [images, setImages] = useState(['']);
  
  // Tab navigation and validation
  const [activeTab, setActiveTab] = useState('basic');
  const [completedTabs, setCompletedTabs] = useState({
    basic: false,
    category: false,
    attributes: false,
    variants: false,
    media: false
  });

  // Load categories when Category tab is accessed
  useEffect(() => {
    if (activeTab === 'category' && categoriesL1.length === 0) {
      loadCategoriesLevel1();
    }
  }, [activeTab]);
  
  // Load L2 when L1 changes
  useEffect(() => {
    if (selectedCategoryL1) {
      loadCategoriesLevel2(selectedCategoryL1);
      // Reset lower levels
      setSelectedCategoryL2('');
      setSelectedCategoryL3('');
      setSelectedCategoryL4('');
      setCategoriesL3([]);
      setCategoriesL4([]);
      setSelectedCategory(''); // Reset final category
    }
  }, [selectedCategoryL1]);
  
  // Load L3 when L2 changes
  useEffect(() => {
    if (selectedCategoryL2) {
      loadCategoriesLevel3(selectedCategoryL2);
      // Reset lower levels
      setSelectedCategoryL3('');
      setSelectedCategoryL4('');
      setCategoriesL4([]);
    }
  }, [selectedCategoryL2]);
  
  // Load L4 when L3 changes and set final category  
  useEffect(() => {
    if (selectedCategoryL3) {
      // First, try to load L4 categories
      loadCategoriesLevel4(selectedCategoryL3);
      // Reset L4 selection
      setSelectedCategoryL4('');
    }
  }, [selectedCategoryL3]);
  
  // Determine and set final category based on deepest valid selection
  useEffect(() => {
    let finalCategory = null;
    
    // Priority: L4 > L3 (if no L4) > L2 (if no L3)
    if (selectedCategoryL4) {
      // L4 selected - always final
      finalCategory = selectedCategoryL4;
    } else if (selectedCategoryL3) {
      // L3 selected - check if L4 categories were loaded
      // If categoriesL4 is empty AND we've tried to load it, L3 is final
      // Give it a moment for async load to complete
      if (categoriesL4.length === 0) {
        finalCategory = selectedCategoryL3;
      }
    } else if (selectedCategoryL2 && categoriesL3.length === 0) {
      // L2 selected and no L3 exists
      finalCategory = selectedCategoryL2;
    }
    
    // Only update if different from current
    if (finalCategory && finalCategory !== selectedCategory) {
      console.log('Setting final category:', finalCategory);
      setSelectedCategory(finalCategory);
    }
  }, [selectedCategoryL2, selectedCategoryL3, selectedCategoryL4, categoriesL3.length, categoriesL4.length]);
  
  // Load product types when category changes and reset product type selection
  useEffect(() => {
    if (selectedCategory) {
      // Reset product type and attributes when final category changes
      setSelectedProductType('');
      setProductFields([]);
      setVariantFields([]);
      setListingFields([]);
      loadProductTypes(selectedCategory);
    }
  }, [selectedCategory]);
  
  // Load attributes when product type changes
  useEffect(() => {
    if (selectedCategory && selectedProductType) {
      console.log('Product type changed, loading attributes:', selectedProductType);
      loadAttributes(selectedCategory, selectedProductType);
    }
  }, [selectedProductType]);

  const loadCategoriesLevel1 = async () => {
    try {
      const response = await axios.get(`${API}/v2/submissions/categories/level/1`, { withCredentials: true });
      setCategoriesL1(response.data.categories || []);
    } catch (error) {
      console.error('Failed to load L1 categories:', error);
    }
  };
  
  const loadCategoriesLevel2 = async (parentId) => {
    try {
      const response = await axios.get(
        `${API}/v2/submissions/categories/level/2?parent_id=${parentId}`,
        { withCredentials: true }
      );
      const cats = response.data.categories || [];
      setCategoriesL2(cats);
      
      // If no L2 categories, L1 is the final category
      if (cats.length === 0 && selectedCategoryL1) {
        setSelectedCategory(selectedCategoryL1);
      }
    } catch (error) {
      console.error('Failed to load L2 categories:', error);
      setCategoriesL2([]);
      // If error, assume L1 is final
      if (selectedCategoryL1) {
        setSelectedCategory(selectedCategoryL1);
      }
    }
  };
  
  const loadCategoriesLevel3 = async (parentId) => {
    try {
      const response = await axios.get(
        `${API}/v2/submissions/categories/level/3?parent_id=${parentId}`,
        { withCredentials: true }
      );
      const cats = response.data.categories || [];
      setCategoriesL3(cats);
      
      // If no L3 categories, L2 is the final category
      if (cats.length === 0 && selectedCategoryL2) {
        setSelectedCategory(selectedCategoryL2);
      }
    } catch (error) {
      console.error('Failed to load L3 categories:', error);
      setCategoriesL3([]);
      // If error, assume L2 is final
      if (selectedCategoryL2) {
        setSelectedCategory(selectedCategoryL2);
      }
    }
  };
  
  const loadCategoriesLevel4 = async (parentId) => {
    try {
      const response = await axios.get(
        `${API}/v2/submissions/categories/level/4?parent_id=${parentId}`,
        { withCredentials: true }
      );
      const cats = response.data.categories || [];
      setCategoriesL4(cats);
      
      console.log(`L4 categories loaded for ${parentId}: ${cats.length} found`);
      
      // If no L4 categories exist, L3 is the final category
      if (cats.length === 0 && selectedCategoryL3) {
        console.log('No L4 children, setting L3 as final category');
        setSelectedCategory(selectedCategoryL3);
      }
    } catch (error) {
      console.error('Failed to load L4 categories:', error);
      setCategoriesL4([]);
      // On error, assume L3 is final
      if (selectedCategoryL3) {
        console.log('Error loading L4, setting L3 as final category');
        setSelectedCategory(selectedCategoryL3);
      }
    }
  };
  
  const loadProductTypes = async (categoryId) => {
    try {
      const response = await axios.get(
        `${API}/v2/submissions/categories/${categoryId}/product-types`,
        { withCredentials: true }
      );
      setProductTypes(response.data.product_types || []);
    } catch (error) {
      console.error('Failed to load product types:', error);
    }
  };
  
  const loadAttributes = async (categoryId, productTypeId = null) => {
    try {
      const params = new URLSearchParams({ category_id: categoryId });
      if (productTypeId) {
        params.append('product_type_id', productTypeId);
      }
      
      console.log('Loading attributes for:', { categoryId, productTypeId });
      
      const response = await axios.get(
        `${API}/v2/submissions/attributes/resolve?${params.toString()}`,
        { withCredentials: true }
      );
      
      console.log('Attributes loaded:', {
        product_fields: response.data.product_fields?.length || 0,
        variant_fields: response.data.variant_fields?.length || 0,
        listing_fields: response.data.listing_fields?.length || 0
      });
      
      setProductFields(response.data.product_fields || []);
      setVariantFields(response.data.variant_fields || []);
      setListingFields(response.data.listing_fields || []);
    } catch (error) {
      console.error('Failed to load attributes:', error);
      setProductFields([]);
      setVariantFields([]);
      setListingFields([]);
    }
  };

  const handleGtinValidation = async () => {
    if (!gtin.trim()) {
      toast.error('Please enter a GTIN');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/v2/submissions/gtin/validate`, {
        gtin: gtin
      }, { withCredentials: true });
      
      setGtinValidation(response.data);
      
      if (response.data.variant_exists) {
        setStep('listing');
        toast.success(`Product found: ${response.data.product_name}`);
      } else {
        setStep('submission');
        toast.info('GTIN not found in catalog. Please submit product details for review.');
      }
    } catch (error) {
      console.error('GTIN validation error:', error);
      toast.error('Failed to validate GTIN');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!listingData.price || !listingData.stock_qty) {
      toast.error('Please enter price and stock quantity');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API}/v2/submissions/listings`, {
        variant_id: gtinValidation.variant_id,
        price: parseFloat(listingData.price),
        stock_qty: parseInt(listingData.stock_qty),
        condition: listingData.condition,
        lead_time_days: listingData.lead_time_days
      }, { withCredentials: true });
      
      toast.success('Listing created successfully! Awaiting admin approval.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Listing creation error:', error);
      toast.error(error.response?.data?.detail || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmission = async () => {
    if (!submissionData.name || !submissionData.brand || !selectedCategory) {
      toast.error('Please enter product name, brand, and select a category');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/v2/submissions/draft`, {
        gtin: gtinValidation?.normalized || gtin,
        name: submissionData.name,
        brand: submissionData.brand,
        model: submissionData.model,
        description: submissionData.description,
        category_id: selectedCategory,
        product_type_id: selectedProductType || null,
        attributes: submissionData.attributes,
        variants: variants.filter(v => v.gtin),
        images: images.filter(img => img),
        seo_title: submissionData.seo_title,
        seo_description: submissionData.seo_description,
        seo_keywords: submissionData.seo_keywords
      }, { withCredentials: true });
      
      if (response.data.redirect_to_listing) {
        toast.warning('GTIN now exists in catalog. Redirecting to listing creation...');
        await handleGtinValidation();
        return;
      }
      
      toast.success('Product submission created! Submitting for review...');
      
      await axios.put(`${API}/v2/submissions/submit/${response.data.submission_id}`, {}, {
        withCredentials: true
      });
      
      toast.success('Submission sent for admin review!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.detail || 'Failed to create submission');
    } finally {
      setLoading(false);
    }
  };
  
  const addVariant = () => {
    setVariants([...variants, { gtin: '', variant_attributes: {} }]);
  };
  
  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };
  
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    if (field === 'gtin') {
      updated[index].gtin = value;
    } else {
      updated[index].variant_attributes[field] = value;
    }
    setVariants(updated);
  };
  
  const addImage = () => {
    setImages([...images, '']);
  };
  
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const updateImage = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };
  
  // Validation functions
  const validateBasicInfo = () => {
    return submissionData.name.trim() !== '' && 
           submissionData.brand.trim() !== '';
  };
  
  const validateCategory = () => {
    // Category must be selected AND product type must be selected
    return selectedCategory !== '' && selectedProductType !== '';
  };
  
  const validateAttributes = () => {
    // Product type must be selected (this is now required on category tab)
    if (!selectedProductType) {
      return false;
    }
    
    // Check all required product-level attributes are filled
    const requiredFields = productFields.filter(f => f.required && f.seller_editable);
    
    // If no required fields, validation passes
    if (requiredFields.length === 0) {
      return true;
    }
    
    return requiredFields.every(field => {
      const value = submissionData.attributes[field.name];
      
      if (!value) return false;
      
      // Check based on data type
      if (field.data_type === 'option') {
        // Single-select: must have option_code
        return value.option_code && value.option_code !== '';
      } else if (field.data_type === 'multi_option') {
        // Multi-select: must have at least one option_code
        return value.option_codes && Array.isArray(value.option_codes) && value.option_codes.length > 0;
      } else if (field.data_type === 'number' || field.data_type === 'integer' || field.data_type === 'decimal' || field.data_type === 'numeric') {
        // Numeric: must have value (and unit if units exist)
        if (!value.value && value.value !== 0) return false;
        if (field.units && field.units.length > 0) {
          return value.unit_code && value.unit_code !== '';
        }
        return true;
      } else if (field.data_type === 'boolean') {
        // Boolean: any value is valid
        return true;
      } else {
        // Text/textarea: must have value
        return value.value && value.value.trim() !== '';
      }
    });
  };
  
  const validateVariants = () => {
    // At least one variant must have a GTIN
    return variants.some(v => v.gtin.trim() !== '');
  };
  
  const isCurrentTabValid = () => {
    switch (activeTab) {
      case 'basic':
        return validateBasicInfo();
      case 'category':
        return validateCategory();
      case 'attributes':
        return validateAttributes();
      case 'variants':
        return validateVariants();
      case 'media':
        return true; // Media/SEO are optional
      default:
        return false;
    }
  };
  
  const canSubmit = () => {
    return validateBasicInfo() && 
           validateCategory() && 
           validateAttributes() && 
           validateVariants();
  };
  
  const handleNext = () => {
    const tabs = ['basic', 'category', 'attributes', 'variants', 'media'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (isCurrentTabValid() && currentIndex < tabs.length - 1) {
      // Mark current tab as complete
      setCompletedTabs(prev => ({...prev, [activeTab]: true}));
      // Move to next tab
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const renderDynamicField = (field, value, onChange, scope = 'product') => {
    const key = `${scope}_${field.attribute_id}`;
    
    if (!field.seller_editable) {
      return null;
    }
    
    // RULE 4: If data_type='option' but no options, field should not have been returned by backend
    // This is a safety check - backend should filter these out
    if (field.data_type === 'option' && (!field.options || field.options.length === 0)) {
      console.error(`RULE 4 VIOLATION: Option attribute "${field.label}" has no options. Should have been filtered by backend.`);
      return null; // DO NOT RENDER
    }
    
    // Check if field has units (for numeric/text fields)
    const hasUnits = field.units && field.units.length > 0;
    
    // Determine if should be multi-select based on data_type or field name patterns
    const isMultiSelect = field.data_type === 'multi_option' || 
                          field.name?.toLowerCase().includes('features') ||
                          field.label?.toLowerCase().includes('features');
    
    // OPTION TYPE - Render as dropdown or multi-select
    if (field.data_type === 'option' || field.data_type === 'multi_option') {
      if (isMultiSelect) {
        // Multi-select with checkboxes
        const currentCodes = value?.option_codes || [];
        
        return (
          <div key={key} className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto bg-white">
              {field.options.map(opt => (
                <div key={opt.code} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${key}_${opt.code}`}
                    checked={currentCodes.includes(opt.code)}
                    onChange={(e) => {
                      const newCodes = e.target.checked
                        ? [...currentCodes, opt.code]
                        : currentCodes.filter(c => c !== opt.code);
                      onChange(field.name, { option_codes: newCodes });
                    }}
                    className="rounded"
                  />
                  <label htmlFor={`${key}_${opt.code}`} className="text-sm cursor-pointer">
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
            {field.notes && <p className="text-xs text-gray-500">{field.notes}</p>}
          </div>
        );
      } else {
        // Single-select dropdown
        const currentCode = value?.option_code || '';
        
        return (
          <div key={key} className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <select
              className="w-full border rounded-md p-2 bg-white"
              value={currentCode}
              onChange={(e) => onChange(field.name, { option_code: e.target.value })}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {!field.required && <option value="none">None / Not Applicable</option>}
              {field.options.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
            {field.notes && <p className="text-xs text-gray-500">{field.notes}</p>}
          </div>
        );
      }
    }
    
    // NUMERIC TYPE - Render based on data type with optional units
    if (field.data_type === 'number' || field.data_type === 'integer' || field.data_type === 'decimal' || field.data_type === 'numeric') {
      const currentValue = value?.value || '';
      const currentUnit = value?.unit_code || (hasUnits && field.units.find(u => u.is_default)?.code) || '';
      
      return (
        <div key={key} className="space-y-2">
          <Label>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step={field.data_type === 'decimal' ? '0.01' : '1'}
              value={currentValue}
              onChange={(e) => {
                const newValue = e.target.value;
                onChange(field.name, hasUnits ? { value: parseFloat(newValue) || 0, unit_code: currentUnit } : { value: parseFloat(newValue) || 0 });
              }}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="flex-1"
            />
            {hasUnits && (
              <select
                className="border rounded-md p-2 bg-white w-32"
                value={currentUnit}
                onChange={(e) => {
                  onChange(field.name, { value: parseFloat(currentValue) || 0, unit_code: e.target.value });
                }}
                required={field.required && currentValue}
              >
                <option value="">Unit</option>
                {field.units.map(unit => (
                  <option key={unit.code} value={unit.code}>{unit.label}</option>
                ))}
              </select>
            )}
          </div>
          {field.notes && <p className="text-xs text-gray-500">{field.notes}</p>}
        </div>
      );
    }
    
    if (field.data_type === 'text' || field.data_type === 'string') {
      const currentValue = value?.value || '';
      const currentUnit = value?.unit_code || (hasUnits && field.units.find(u => u.is_default)?.code) || '';
      
      return (
        <div key={key} className="space-y-2">
          <Label>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={currentValue}
              onChange={(e) => {
                const newValue = e.target.value;
                onChange(field.name, hasUnits ? { value: newValue, unit_code: currentUnit } : { value: newValue });
              }}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="flex-1"
            />
            {hasUnits && (
              <select
                className="border rounded-md p-2 bg-white w-32"
                value={currentUnit}
                onChange={(e) => {
                  onChange(field.name, { value: currentValue, unit_code: e.target.value });
                }}
                required={field.required && currentValue}
              >
                <option value="">Unit</option>
                {field.units.map(unit => (
                  <option key={unit.code} value={unit.code}>{unit.label}</option>
                ))}
              </select>
            )}
          </div>
          {field.notes && <p className="text-xs text-gray-500">{field.notes}</p>}
        </div>
      );
    }
    
    if (field.data_type === 'boolean') {
      return (
        <div key={key} className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id={key}
            checked={value?.value || false}
            onChange={(e) => onChange(field.name, { value: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor={key}>{field.label}</Label>
          {field.notes && <p className="text-xs text-gray-500 ml-2">({field.notes})</p>}
        </div>
      );
    }
    
    if (field.data_type === 'textarea') {
      return (
        <div key={key} className="space-y-2">
          <Label>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <textarea
            className="w-full border rounded-md p-2"
            rows="3"
            value={value?.value || ''}
            onChange={(e) => onChange(field.name, { value: e.target.value })}
            required={field.required}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
          {field.notes && <p className="text-xs text-gray-500">{field.notes}</p>}
        </div>
      );
    }
    
    // UNKNOWN TYPE - Log error but don't render
    console.error(`Unknown data_type: ${field.data_type} for attribute ${field.label}`);
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef] py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-white hover:text-[#00ffef]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Submit New Product</CardTitle>
          </CardHeader>
          <CardContent>
            {/* STEP 1: GTIN Entry */}
            {step === 'gtin' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-blue-900 mb-1">Start with GTIN</p>
                      <p>Enter the product's GTIN (barcode) to check if it exists in our catalog.</p>
                      <p className="mt-2">• If it exists, you'll create a listing with your price and stock</p>
                      <p>• If it doesn't exist, you'll submit product details for admin review</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gtin">GTIN / Barcode *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="gtin"
                      value={gtin}
                      onChange={(e) => setGtin(e.target.value)}
                      placeholder="Enter GTIN (e.g., 0123456789012)"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleGtinValidation()}
                    />
                    <Button onClick={handleGtinValidation} disabled={loading}>
                      <Search className="w-4 h-4 mr-2" />
                      {loading ? 'Checking...' : 'Check GTIN'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2A: Create Listing (GTIN exists) */}
            {step === 'listing' && gtinValidation?.variant_exists && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Package className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-green-900 mb-1">Product Found in Catalog!</p>
                      <p><strong>Product:</strong> {gtinValidation.product_name}</p>
                      <p><strong>GTIN:</strong> {gtinValidation.normalized}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (AUD) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={listingData.price}
                      onChange={(e) => setListingData({...listingData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Quantity *</Label>
                    <Input
                      type="number"
                      value={listingData.stock_qty}
                      onChange={(e) => setListingData({...listingData, stock_qty: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('gtin')}>Back</Button>
                  <Button onClick={handleCreateListing} disabled={loading} className="flex-1">
                    {loading ? 'Creating...' : 'Create Listing'}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2B: Create Submission (GTIN doesn't exist) */}
            {step === 'submission' && !gtinValidation?.variant_exists && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic" className="relative">
                    Basic Info
                    {completedTabs.basic && <span className="ml-1 text-green-500">✓</span>}
                  </TabsTrigger>
                  <TabsTrigger value="category" className="relative">
                    Category
                    {completedTabs.category && <span className="ml-1 text-green-500">✓</span>}
                  </TabsTrigger>
                  <TabsTrigger value="attributes" className="relative">
                    Attributes
                    {completedTabs.attributes && <span className="ml-1 text-green-500">✓</span>}
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="relative">
                    Variants
                    {completedTabs.variants && <span className="ml-1 text-green-500">✓</span>}
                  </TabsTrigger>
                  <TabsTrigger value="media" className="relative">
                    Media & SEO
                    {completedTabs.media && <span className="ml-1 text-green-500">✓</span>}
                  </TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input
                      value={submissionData.name}
                      onChange={(e) => setSubmissionData({...submissionData, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Brand *</Label>
                      <Input
                        value={submissionData.brand}
                        onChange={(e) => setSubmissionData({...submissionData, brand: e.target.value})}
                        placeholder="Enter brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input
                        value={submissionData.model}
                        onChange={(e) => setSubmissionData({...submissionData, model: e.target.value})}
                        placeholder="Enter model"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea
                      className="w-full border rounded-md p-2"
                      rows="4"
                      value={submissionData.description}
                      onChange={(e) => setSubmissionData({...submissionData, description: e.target.value})}
                      placeholder="Enter product description"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setStep('gtin')}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      disabled={!isCurrentTabValid()}
                      className="flex-1"
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                {/* Category Tab */}
                <TabsContent value="category" className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">
                      Select your product category by drilling down from the broadest level to the most specific.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Level 1 Category *</Label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={selectedCategoryL1}
                      onChange={(e) => setSelectedCategoryL1(e.target.value)}
                    >
                      <option value="">Select Level 1 Category</option>
                      {categoriesL1.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {categoriesL2.length > 0 && (
                    <div className="space-y-2">
                      <Label>Level 2 Category *</Label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={selectedCategoryL2}
                        onChange={(e) => setSelectedCategoryL2(e.target.value)}
                      >
                        <option value="">Select Level 2 Category</option>
                        {categoriesL2.map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {categoriesL3.length > 0 && (
                    <div className="space-y-2">
                      <Label>Level 3 Category *</Label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={selectedCategoryL3}
                        onChange={(e) => setSelectedCategoryL3(e.target.value)}
                      >
                        <option value="">Select Level 3 Category</option>
                        {categoriesL3.map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {categoriesL4.length > 0 && (
                    <div className="space-y-2">
                      <Label>Level 4 Category</Label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={selectedCategoryL4}
                        onChange={(e) => setSelectedCategoryL4(e.target.value)}
                      >
                        <option value="">Select Level 4 Category (Optional)</option>
                        {categoriesL4.map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {selectedCategory && (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                        <p className="text-sm text-green-800">
                          <strong>Selected Category:</strong> {
                            categoriesL1.find(c => c.category_id === selectedCategoryL1)?.name
                          }
                          {selectedCategoryL2 && ` > ${categoriesL2.find(c => c.category_id === selectedCategoryL2)?.name}`}
                          {selectedCategoryL3 && ` > ${categoriesL3.find(c => c.category_id === selectedCategoryL3)?.name}`}
                          {selectedCategoryL4 && ` > ${categoriesL4.find(c => c.category_id === selectedCategoryL4)?.name}`}
                        </p>
                      </div>
                      
                      {/* Product Type Selection - MANDATORY */}
                      <div className="space-y-2 mt-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                        <Label className="text-base font-semibold text-orange-900">
                          Product Type * <span className="text-red-600">(Required)</span>
                        </Label>
                        <p className="text-sm text-gray-700 mb-2">
                          You must select a product type to configure attributes for your product.
                        </p>
                        {productTypes.length > 0 ? (
                          <select
                            className="w-full border-2 border-orange-300 rounded-md p-2 bg-white"
                            value={selectedProductType}
                            onChange={(e) => setSelectedProductType(e.target.value)}
                            required
                          >
                            <option value="">-- Select Product Type (Required) --</option>
                            {productTypes.map(type => (
                              <option key={type.product_type_id} value={type.product_type_id}>
                                {type.product_type_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                            ⚠️ No product types available for this category. This may be a data integrity issue. 
                            Please contact support or select a different category.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setActiveTab('basic')}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      disabled={!isCurrentTabValid()}
                      className="flex-1"
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                {/* Attributes Tab */}
                <TabsContent value="attributes" className="space-y-4">
                  {!selectedCategory ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium mb-2">Select a product type to configure attributes</p>
                      <p className="text-sm text-gray-500 mb-4">You must first complete the category selection in the previous tab</p>
                      <Button variant="outline" onClick={() => setActiveTab('category')}>
                        Go to Category Selection
                      </Button>
                    </div>
                  ) : !selectedProductType ? (
                    <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <p className="text-yellow-800 font-medium mb-2">Select a product type to configure attributes</p>
                      <p className="text-sm text-yellow-700 mb-4">
                        A product type must be selected on the Category tab to display the appropriate attribute fields
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab('category')} className="border-yellow-300">
                        Go Back to Select Product Type
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Show current configuration */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Category:</strong> {
                            categoriesL1.find(c => c.category_id === selectedCategoryL1)?.name
                          }
                          {selectedCategoryL2 && ` > ${categoriesL2.find(c => c.category_id === selectedCategoryL2)?.name}`}
                          {selectedCategoryL3 && ` > ${categoriesL3.find(c => c.category_id === selectedCategoryL3)?.name}`}
                          {selectedCategoryL4 && ` > ${categoriesL4.find(c => c.category_id === selectedCategoryL4)?.name}`}
                        </p>
                        {selectedProductType && (
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Product Type:</strong> {productTypes.find(t => t.product_type_id === selectedProductType)?.product_type_name}
                          </p>
                        )}
                      </div>
                      
                      {productFields.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 font-medium">No product-level attributes configured</p>
                          <p className="text-sm text-gray-500 mt-1">
                            This product type doesn't require additional attributes at the product level
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            {productFields.map(field => 
                              renderDynamicField(
                                field,
                                submissionData.attributes[field.name],
                                (name, value) => setSubmissionData({
                                  ...submissionData,
                                  attributes: {...submissionData.attributes, [name]: value}
                                })
                              )
                            )}
                          </div>
                          
                          {productFields.some(f => f.required) && (
                            <p className="text-sm text-gray-500 italic">
                              * Required fields must be filled to continue
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setActiveTab('category')}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      disabled={!isCurrentTabValid()}
                      className="flex-1"
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                {/* Variants Tab */}
                <TabsContent value="variants" className="space-y-4">
                  {/* Show current configuration */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Category:</strong> {
                        categoriesL1.find(c => c.category_id === selectedCategoryL1)?.name
                      }
                      {selectedCategoryL2 && ` > ${categoriesL2.find(c => c.category_id === selectedCategoryL2)?.name}`}
                      {selectedCategoryL3 && ` > ${categoriesL3.find(c => c.category_id === selectedCategoryL3)?.name}`}
                      {selectedCategoryL4 && ` > ${categoriesL4.find(c => c.category_id === selectedCategoryL4)?.name}`}
                    </p>
                    {selectedProductType && (
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Product Type:</strong> {productTypes.find(t => t.product_type_id === selectedProductType)?.product_type_name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Product Variants</Label>
                    <Button size="sm" onClick={addVariant}>
                      <Plus className="w-4 h-4 mr-1" /> Add Variant
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Add at least one variant with a GTIN. Each variant can have unique attributes.
                  </p>
                  
                  {variantFields.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Variant-level attributes available:</strong> {variantFields.map(f => f.label).join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {variants.map((variant, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>GTIN for this variant *</Label>
                              <Input
                                value={variant.gtin}
                                onChange={(e) => updateVariant(index, 'gtin', e.target.value)}
                                placeholder="Variant GTIN (required)"
                              />
                            </div>
                            
                            {variantFields.length > 0 && (
                              <div className="grid grid-cols-2 gap-4">
                                {variantFields.map(field =>
                                  renderDynamicField(
                                    field,
                                    variant.variant_attributes[field.name],
                                    (name, value) => updateVariant(index, name, value),
                                    'variant'
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          
                          {variants.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setActiveTab('attributes')}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      disabled={!isCurrentTabValid()}
                      className="flex-1"
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                {/* Media & SEO Tab */}
                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg">Product Images</Label>
                      <Button size="sm" onClick={addImage}>
                        <Plus className="w-4 h-4 mr-1" /> Add Image
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Add image URLs for your product (optional but recommended)
                    </p>
                    
                    {images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={image}
                          onChange={(e) => updateImage(index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <hr className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">SEO Information (Optional)</h3>
                    <p className="text-sm text-gray-600">
                      Optimize your product for search engines
                    </p>
                    <div className="space-y-2">
                      <Label>SEO Title</Label>
                      <Input
                        value={submissionData.seo_title}
                        onChange={(e) => setSubmissionData({...submissionData, seo_title: e.target.value})}
                        placeholder="Optimized title for search engines"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SEO Description</Label>
                      <textarea
                        className="w-full border rounded-md p-2"
                        rows="3"
                        value={submissionData.seo_description}
                        onChange={(e) => setSubmissionData({...submissionData, seo_description: e.target.value})}
                        placeholder="Meta description for search results"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setActiveTab('variants')}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleCreateSubmission} 
                      disabled={loading || !canSubmit()}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                  </div>
                  
                  {!canSubmit() && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm text-orange-800">
                        <strong>Missing required fields:</strong>
                      </p>
                      <ul className="text-sm text-orange-700 mt-2 list-disc list-inside">
                        {!validateBasicInfo() && <li>Complete basic product information</li>}
                        {!validateCategory() && <li>Select a category</li>}
                        {!validateAttributes() && <li>Fill all required attributes</li>}
                        {!validateVariants() && <li>Add at least one variant with GTIN</li>}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductSubmissionV2;
