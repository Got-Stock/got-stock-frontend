import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, Package, Search, Filter, ChevronDown, ChevronRight, Send, Star, ImageIcon, Edit, X, Upload, Trash2, ChevronUp, Save } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // If it's a relative path starting with /api, prepend BACKEND_URL
  if (imagePath.startsWith('/api')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  // Otherwise, assume it's a relative path and prepend BACKEND_URL
  return `${BACKEND_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Grouped data
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeller, setFilterSeller] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProductType, setFilterProductType] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterSKU, setFilterSKU] = useState('');
  const [filterGTIN, setFilterGTIN] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Selection & bulk actions
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('');
  
  // Single item dialogs
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // Detail view dialog
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Attribute options for dropdowns
  const [attributeOptions, setAttributeOptions] = useState({});
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  
  // Dynamic attributes based on product type ONLY (not category)
  const [productTypeAttributes, setProductTypeAttributes] = useState([]);

  useEffect(() => {
    fetchSubmissions();
    fetchAttributeOptions();
    fetchCategories();
    fetchProductTypes();
  }, []);

  useEffect(() => {
    if (submissions.length > 0) {
      console.log('Triggering groupSubmissionsByProduct due to submissions change');
      groupSubmissionsByProduct();
    }
  }, [submissions, searchTerm, filterSeller, filterBrand, filterCategory, filterProductType, filterColor, filterSize, filterSKU, filterGTIN, filterPriceMin, filterPriceMax]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/products/pending`, { withCredentials: true });
      console.log('Fetched submissions:', response.data);
      console.log('Number of submissions:', response.data.length);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributeOptions = async () => {
    try {
      const response = await axios.get(`${API}/attribute-options`, { withCredentials: true });
      console.log('Fetched attribute options:', response.data);
      console.log('Number of attributes with options:', Object.keys(response.data).length);
      setAttributeOptions(response.data);
    } catch (error) {
      console.error('Error fetching attribute options:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`, { withCredentials: true });
      console.log('Fetched categories:', response.data.length);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(`${API}/product-types`, { withCredentials: true });
      console.log('Fetched product types:', response.data.length);
      setProductTypes(response.data);
    } catch (error) {
      console.error('Error fetching product types:', error);
    }
  };

  const fetchProductTypeAttributes = async (productTypeId) => {
    if (!productTypeId) {
      console.log('🔍 fetchProductTypeAttributes: No product type ID provided');
      setProductTypeAttributes([]);
      return;
    }
    
    try {
      console.log('🔍 Fetching attributes for product type:', productTypeId);
      
      // Use admin-specific endpoint that returns ALL attributes (product + variant level)
      const response = await axios.get(
        `${API}/admin/product-type-attributes/${productTypeId}`,
        { withCredentials: true }
      );
      
      console.log('✅ Product type attributes response:', response.data);
      
      if (response.data.success) {
        const attrs = response.data.data.attributes || [];
        console.log(`✅ Found ${attrs.length} product type attributes`);
        setProductTypeAttributes(attrs);
      } else {
        console.log('⚠️ Product type attributes API returned success=false');
        setProductTypeAttributes([]);
      }
    } catch (error) {
      console.error('❌ Error fetching product type attributes:', error);
      toast.error('Failed to load product type attributes');
      setProductTypeAttributes([]);
    }
  };

  const groupSubmissionsByProduct = async () => {
    try {
      console.log('Starting groupSubmissionsByProduct with submissions:', submissions.length);
      const groups = {};
      
      submissions.forEach(sub => {
        const key = `${sub.title}-${sub.brand}`.toLowerCase();
        if (!groups[key]) {
          groups[key] = {
            product_key: key,
            title: sub.title,
            brand: sub.brand,
            submissions: [],
            variants: [],
            seller: null,
            thumbnail: null
          };
        }
        groups[key].submissions.push(sub);
      });
      
      console.log('Created groups:', Object.keys(groups).length);
      const groupsArray = Object.values(groups);
      
      // Process each group WITHOUT making additional API calls
      for (const group of groupsArray) {
        const allVariants = [];
        
        for (const sub of group.submissions) {
          // Variants are already included in the submission!
          const variants = sub.variants || [];
          
          const variantsWithSub = variants.map(v => ({
            ...v,
            submission: {
              ...sub,
              category_path: sub.category || sub.category_path || '',
              category_id: sub.category_id || '',
              product_type_id: sub.product_type_id || '',
              product_type_name: sub.product_type_name || ''
            },
            submissionId: sub.id
          }));
          
          allVariants.push(...variantsWithSub);
          
          // Set thumbnail from first variant with images
          if (!group.thumbnail && variantsWithSub.length > 0 && variantsWithSub[0].images?.length > 0) {
            group.thumbnail = variantsWithSub[0].images[0];
          }
          
          // Set seller info (already in submission or variant)
          if (!group.seller) {
            group.seller = {
              seller_id: sub.seller_id || (variantsWithSub[0]?.seller_id),
              business_name: sub.seller_name || 'Unknown'
            };
          }
        }
        
        group.variants = allVariants;
      }
      
      console.log('✅ Grouping complete with', groupsArray.length, 'product groups');
      
      let filtered = groupsArray;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(g => 
          g.title.toLowerCase().includes(term) ||
          g.brand.toLowerCase().includes(term) ||
          g.variants.some(v => 
            v.sku?.toLowerCase().includes(term) ||
            v.size?.toLowerCase().includes(term) ||
            v.color?.toLowerCase().includes(term)
          )
        );
      }
      
      if (filterSeller) {
        filtered = filtered.filter(g => 
          g.seller?.business_name?.toLowerCase().includes(filterSeller.toLowerCase())
        );
      }
      
      if (filterBrand) {
        filtered = filtered.filter(g => 
          g.brand.toLowerCase().includes(filterBrand.toLowerCase())
        );
      }
      
      if (filterCategory) {
        filtered = filtered.filter(g =>
          g.variants.some(v => 
            v.submission?.category_name?.toLowerCase().includes(filterCategory.toLowerCase())
          )
        );
      }
      
      if (filterProductType) {
        filtered = filtered.filter(g =>
          g.variants.some(v =>
            v.submission?.product_type_name?.toLowerCase().includes(filterProductType.toLowerCase())
          )
        );
      }
      
      if (filterColor) {
        filtered = filtered.filter(g =>
          g.variants.some(v =>
            v.color?.toLowerCase().includes(filterColor.toLowerCase())
          )
        );
      }
      
      if (filterSize) {
        filtered = filtered.filter(g =>
          g.variants.some(v =>
            v.size?.toLowerCase().includes(filterSize.toLowerCase())
          )
        );
      }
      
      if (filterSKU) {
        filtered = filtered.filter(g =>
          g.variants.some(v =>
            v.sku?.toLowerCase().includes(filterSKU.toLowerCase())
          )
        );
      }
      
      if (filterGTIN) {
        filtered = filtered.filter(g =>
          g.variants.some(v =>
            v.gtin?.toLowerCase().includes(filterGTIN.toLowerCase())
          )
        );
      }
      
      if (filterPriceMin) {
        const minPrice = parseFloat(filterPriceMin);
        filtered = filtered.filter(g =>
          g.variants.some(v => v.price >= minPrice)
        );
      }
      
      if (filterPriceMax) {
        const maxPrice = parseFloat(filterPriceMax);
        filtered = filtered.filter(g =>
          g.variants.some(v => v.price <= maxPrice)
        );
      }
      
      console.log('Final filtered groups:', filtered.length);
      setGroupedProducts(filtered);
      setLoading(false); // ✅ FIX: Set loading to false after grouping is complete
      console.log('✅ Grouping complete, loading set to false');
    } catch (error) {
      console.error('Error in groupSubmissionsByProduct:', error);
      setGroupedProducts([]);
      setLoading(false); // ✅ FIX: Set loading to false even on error
    }
  };

  const toggleProductExpand = (productKey) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productKey)) {
      newExpanded.delete(productKey);
    } else {
      newExpanded.add(productKey);
    }
    setExpandedProducts(newExpanded);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = [];
      groupedProducts.forEach(g => {
        g.variants.forEach(v => {
          if (['pending', 'submitted', 'pending_approval'].includes(v.submission?.status)) {
            allIds.push(`${v.submissionId}-${v.id}`);
          }
        });
      });
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (submissionId, variantId) => {
    const id = `${submissionId}-${variantId}`;
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    if (!window.confirm(`Approve ${selectedItems.size} selected variant(s)?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const submissionIds = new Set();
      selectedItems.forEach(id => {
        const [subId] = id.split('-');
        submissionIds.add(subId);
      });

      const results = await Promise.all(
        Array.from(submissionIds).map(subId =>
          axios.post(
            `${API}/v3/submissions/${subId}/approve`,
            { admin_notes: 'Bulk approved' },
            { withCredentials: true }
          ).catch(err => ({ error: err.response?.data?.detail || 'Failed' }))
        )
      );

      const succeeded = results.filter(r => !r.error).length;
      toast.success(`Approved ${succeeded} submission(s)`);

      setSelectedItems(new Set());
      fetchSubmissions();
    } catch (error) {
      console.error('Bulk approve error:', error);
      toast.error('Bulk approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkReject = () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }
    setBulkRejectReason('');
    setShowBulkRejectDialog(true);
  };

  const submitBulkReject = async () => {
    if (!bulkRejectReason.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const submissionIds = new Set();
      selectedItems.forEach(id => {
        const [subId] = id.split('-');
        submissionIds.add(subId);
      });

      const results = await Promise.all(
        Array.from(submissionIds).map(subId =>
          axios.post(
            `${API}/admin/products/${subId}/approve`,
            {
              approval_status: 'rejected',
              admin_notes: bulkRejectReason
            },
            { withCredentials: true }
          ).catch(err => ({ error: err.response?.data?.detail || 'Failed' }))
        )
      );

      const succeeded = results.filter(r => !r.error).length;
      toast.success(`Rejected ${succeeded} submission(s)`);

      setShowBulkRejectDialog(false);
      setSelectedItems(new Set());
      fetchSubmissions();
    } catch (error) {
      console.error('Bulk reject error:', error);
      toast.error('Bulk rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkPost = async () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    if (!window.confirm(`Post ${selectedItems.size} selected variant(s) directly?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const submissionIds = new Set();
      selectedItems.forEach(id => {
        const [subId] = id.split('-');
        submissionIds.add(subId);
      });

      const results = await Promise.all(
        Array.from(submissionIds).map(subId =>
          axios.post(
            `${API}/v3/submissions/${subId}/post-direct`,
            {},
            { withCredentials: true }
          ).catch(err => ({ error: err.response?.data?.detail || 'Failed' }))
        )
      );

      const succeeded = results.filter(r => !r.error).length;
      toast.success(`Posted ${succeeded} submission(s)`);

      setSelectedItems(new Set());
      fetchSubmissions();
    } catch (error) {
      console.error('Bulk post error:', error);
      toast.error('Bulk post failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveVariant = async (variant) => {
    if (!window.confirm(`Approve this variant?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${API}/v3/submissions/${variant.submissionId}/approve`,
        { admin_notes: 'Approved' },
        { withCredentials: true }
      );
      toast.success('Variant approved!');
      fetchSubmissions();
    } catch (error) {
      console.error('Approval error:', error);
      toast.error(error.response?.data?.detail || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectVariant = (variant) => {
    setRejectTarget(variant);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${API}/v3/submissions/${rejectTarget.submissionId}/reject`,
        {
          rejection_reason: rejectReason,
          admin_notes: rejectReason
        },
        { withCredentials: true }
      );
      toast.success('Submission rejected');
      setShowRejectDialog(false);
      setRejectTarget(null);
      setRejectReason('');
      fetchSubmissions();
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error(error.response?.data?.detail || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostVariant = async (variant) => {
    if (!window.confirm(`Post this variant directly?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${API}/v3/submissions/${variant.submissionId}/post-direct`,
        {},
        { withCredentials: true }
      );
      toast.success('Variant posted!');
      fetchSubmissions();
    } catch (error) {
      console.error('Post error:', error);
      toast.error(error.response?.data?.detail || 'Failed to post');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishProduct = async (product_id) => {
    if (!window.confirm(`Publish this product to make it live on the site?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${API}/v3/products/${product_id}/publish`,
        {},
        { withCredentials: true }
      );
      toast.success('Product published successfully!');
      fetchSubmissions();
    } catch (error) {
      console.error('Publish error:', error);
      toast.error(error.response?.data?.detail || 'Failed to publish');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRowClick = async (variant, e) => {
    if (e.target.closest('button') || e.target.closest('input[type="checkbox"]')) {
      return;
    }
    
    console.log('🔍 Opening variant:', variant.id);
    console.log('📦 Variant data:', variant);
    
    // IMPORTANT: Fetch fresh submission data from API instead of using cached list data
    let freshSubmission = variant.submission;
    
    try {
      console.log('🔄 Fetching fresh submission data from API...');
      const submissionResponse = await axios.get(
        `${API}/admin/products/pending`,
        { withCredentials: true }
      );
      
      // Find the specific submission
      const foundSubmission = submissionResponse.data.find(s => s.id === variant.submission?.id);
      if (foundSubmission) {
        freshSubmission = foundSubmission;
        console.log('✅ Found fresh submission data');
        
        // Find the specific variant within the submission
        const freshVariant = foundSubmission.variants?.find(v => v.id === variant.id);
        if (freshVariant) {
          variant = { 
            ...freshVariant, 
            submission: foundSubmission,
            submissionId: foundSubmission.id  // ✅ FIX: Ensure submissionId is preserved
          };
          console.log('✅ Using fresh variant data with submissionId:', foundSubmission.id);
        }
      } else {
        console.log('⚠️ Could not find fresh submission, using cached data');
      }
    } catch (error) {
      console.error('❌ Error fetching fresh submission:', error);
      console.log('⚠️ Falling back to cached data');
    }
    
    // Extract size and color from variant_attributes
    let size = '';
    let color = '';
    
    if (variant.variant_attributes) {
      color = variant.variant_attributes.primary_colour || '';
      size = variant.variant_attributes.womens_size || 
             variant.variant_attributes.mens_size || 
             variant.variant_attributes.alpha_size || 
             variant.variant_attributes.size || '';
    }
    
    // Get stock from quantity field
    const stock = variant.quantity ?? variant.stock_quantity ?? variant.stock ?? 0;
    
    // Fetch seller info if not already present
    let sellerInfo = variant.seller;
    if (!sellerInfo && variant.seller_id) {
      try {
        const sellerRes = await axios.get(`${API}/sellers/${variant.seller_id}`, { withCredentials: true });
        sellerInfo = sellerRes.data;
      } catch (error) {
        console.error('Error fetching seller:', error);
        sellerInfo = { seller_id: variant.seller_id, business_name: 'Unknown' };
      }
    }
    
    // Extract features and benefits from attributes and combine them
    const attributes = variant.submission?.attributes || {};
    const featuresBenefitsList = [];
    
    // Check for the features_benefits field (it's an array)
    if (attributes.features_benefits) {
      if (Array.isArray(attributes.features_benefits)) {
        featuresBenefitsList.push(...attributes.features_benefits.filter(item => item && item.trim()));
      } else if (typeof attributes.features_benefits === 'string') {
        // Handle if it's a string
        const items = attributes.features_benefits.split('\n').filter(item => item.trim());
        featuresBenefitsList.push(...items);
      }
    }
    
    // Also check for separate features field
    if (attributes.features) {
      if (Array.isArray(attributes.features)) {
        featuresBenefitsList.push(...attributes.features.filter(item => item && item.trim()));
      } else if (typeof attributes.features === 'string') {
        const items = attributes.features.split('\n').filter(f => f.trim());
        featuresBenefitsList.push(...items);
      }
    }
    
    // Also check for separate benefits field
    if (attributes.benefits) {
      if (Array.isArray(attributes.benefits)) {
        featuresBenefitsList.push(...attributes.benefits.filter(item => item && item.trim()));
      } else if (typeof attributes.benefits === 'string') {
        const items = attributes.benefits.split('\n').filter(b => b.trim());
        featuresBenefitsList.push(...items);
      }
    }
    
    // Extract usage and care instructions
    const usageInstructions = attributes.usage_instructions || '';
    const careInstructions = attributes.care_instructions || '';
    
    // Prepare initial data
    let categoryId = variant.submission?.category_id || '';
    let categoryPath = variant.submission?.category_path || variant.submission?.category || '';
    let productTypeId = variant.submission?.product_type_id || '';
    let productTypeName = variant.submission?.product_type_name || '';
    
    // Fetch product type name if we have the ID but not the name
    if (productTypeId && !productTypeName) {
      try {
        const ptRes = await axios.get(`${API}/product-types/${productTypeId}`, { withCredentials: true });
        productTypeName = ptRes.data.name || ptRes.data.type_name || '';
      } catch (error) {
        console.error('Error fetching product type:', error);
      }
    }
    
    // If category_id is missing but we have category path, try to look it up
    if (!categoryId && categoryPath) {
      try {
        const catRes = await axios.get(`${API}/categories/lookup`, {
          params: { path: categoryPath },
          withCredentials: true
        });
        if (catRes.data.id) {
          categoryId = catRes.data.id;
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    }
    
    const modalData = {
      ...variant,
      id: variant.id,  // ✅ Explicitly ensure variant ID is set
      submissionId: variant.submissionId || variant.submission?.id,  // ✅ Ensure submissionId is set
      seller: sellerInfo,
      size: size,
      color: color,
      stock_quantity: stock,
      submission: {
        ...variant.submission,
        category_id: categoryId,
        category_path: categoryPath,
        product_type_id: productTypeId,
        product_type_name: productTypeName,
        features_benefits: featuresBenefitsList,
        usage_instructions: usageInstructions,
        care_instructions: careInstructions
      }
    };
    
    console.log('📝 Modal data prepared:', {
      variantId: modalData.id,
      submissionId: modalData.submissionId
    });
    
    setSelectedDetail(modalData);
    setEditFormData(modalData);
    setHasUnsavedChanges(false);
    setLastUpdated(null);
    setShowDetailDialog(true);
    
    // Load attributes for current product type only
    if (productTypeId) {
      console.log('📋 Loading attributes for product type:', productTypeId);
      await fetchProductTypeAttributes(productTypeId);
    } else {
      console.log('⚠️ No product type ID found');
    }
  };

  const handleFormChange = (field, value, isSubmissionField = false) => {
    setHasUnsavedChanges(true);
    if (isSubmissionField) {
      setEditFormData(prev => ({
        ...prev,
        submission: {
          ...prev.submission,
          [field]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAttributeChange = (key, value) => {
    setHasUnsavedChanges(true);
    setEditFormData(prev => ({
      ...prev,
      submission: {
        ...prev.submission,
        attributes: {
          ...(prev.submission.attributes || {}),
          [key]: value
        }
      }
    }));
  };

  const handleCategoryChange = async (newCategoryId) => {
    const selectedCategory = categories.find(cat => cat.category_id === newCategoryId);
    
    // Update category ID and path
    handleFormChange('category_id', newCategoryId, true);
    if (selectedCategory) {
      handleFormChange('category_path', selectedCategory.path, true);
    }
    
    // Show notification
    toast.info('Category changed. Please select product type.', {
      duration: 3000
    });
    
    // Mark as unsaved
    setHasUnsavedChanges(true);
  };

  const handleProductTypeChange = async (newProductTypeId) => {
    const selectedType = productTypes.find(pt => pt.product_type_id === newProductTypeId);
    
    // Update product type ID and name
    handleFormChange('product_type_id', newProductTypeId, true);
    if (selectedType) {
      handleFormChange('product_type_name', selectedType.product_type_name, true);
    }
    
    // Fetch attributes for this product type
    await fetchProductTypeAttributes(newProductTypeId);
    
    // Show warning
    toast.success('Product type changed. Attributes loaded.', {
      duration: 3000
    });
    
    // Mark as unsaved
    setHasUnsavedChanges(true);
  };

  const handleAddFeaturesBenefits = (value) => {
    console.log('🔵 handleAddFeaturesBenefits called with value:', value);
    if (!value || !value.trim()) {
      console.log('🔴 Value is empty, returning');
      return;
    }
    
    setHasUnsavedChanges(true);
    const currentList = editFormData.submission?.features_benefits || [];
    console.log('🔵 Current list before adding:', currentList);
    const newList = [...currentList, value];
    console.log('🔵 New list after adding:', newList);
    
    // Force update with new list
    setEditFormData(prev => {
      const updated = {
        ...prev,
        submission: {
          ...prev.submission,
          features_benefits: newList
        }
      };
      console.log('✅ EditFormData updated, features_benefits:', updated.submission.features_benefits);
      return updated;
    });
    
    // Also update selectedDetail to keep them in sync
    setSelectedDetail(prev => ({
      ...prev,
      submission: {
        ...prev.submission,
        features_benefits: newList
      }
    }));
    
    console.log('✅ Feature/Benefit added successfully, new count:', newList.length);
  };

  const handleFeaturesBenefitsChange = (index, value) => {
    setHasUnsavedChanges(true);
    const newList = [...(editFormData.submission?.features_benefits || [])];
    newList[index] = value;
    setEditFormData(prev => ({
      ...prev,
      submission: {
        ...prev.submission,
        features_benefits: newList
      }
    }));
  };

  const handleRemoveFeaturesBenefits = (index) => {
    setHasUnsavedChanges(true);
    const newList = [...(editFormData.submission?.features_benefits || [])];
    newList.splice(index, 1);
    setEditFormData(prev => ({
      ...prev,
      submission: {
        ...prev.submission,
        features_benefits: newList
      }
    }));
  };

  // State for the new feature/benefit dropdown
  const [newFeatureBenefit, setNewFeatureBenefit] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    console.log('📤 Image upload started:', file.name);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG images are allowed. WEBP is not supported.');
      event.target.value = '';
      return;
    }
    
    // Validate file extension as well
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png')) {
      toast.error('Only .jpg, .jpeg, and .png file extensions are allowed.');
      event.target.value = '';
      return;
    }
    
    // Check image dimensions
    try {
      const dimensions = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
      
      console.log('📐 Image dimensions:', dimensions);
      
      // Check if at least one dimension is 1200px or more
      if (dimensions.width < 1200 && dimensions.height < 1200) {
        toast.error(`Image must be at least 1200px on one side. Current size: ${dimensions.width}×${dimensions.height}px`);
        event.target.value = '';
        return;
      }
      
      console.log('✅ Image validation passed');
    } catch (error) {
      console.error('Error checking image dimensions:', error);
      toast.error('Failed to validate image dimensions');
      event.target.value = '';
      return;
    }
    
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API}/admin/variants/${editFormData.id}/upload-image`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      if (response.data.success) {
        console.log('✅ Upload successful, new images:', response.data.images);
        setEditFormData(prev => ({
          ...prev,
          images: response.data.images
        }));
        setHasUnsavedChanges(true);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload image');
    } finally {
      setActionLoading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleImageReorder = (fromIndex, toIndex) => {
    setHasUnsavedChanges(true);
    const newImages = [...(editFormData.images || [])];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setEditFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSetHeroImage = (index) => {
    if (index === 0) return;
    setHasUnsavedChanges(true);
    const newImages = [...(editFormData.images || [])];
    const [heroImage] = newImages.splice(index, 1);
    newImages.unshift(heroImage);
    setEditFormData(prev => ({ ...prev, images: newImages }));
    toast.success('Hero image updated');
  };

  const handleDeleteImage = async (index) => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      const imageToDelete = editFormData.images[index];
      console.log('🗑️ Deleting image at index', index, ':', imageToDelete);
      
      // Create new array without the deleted image
      const newImages = [...(editFormData.images || [])];
      newImages.splice(index, 1);
      
      // Update the variant in the database immediately
      const response = await axios.put(
        `${API}/admin/variants/${editFormData.id}/images`,
        { images: newImages },
        { withCredentials: true }
      );
      
      // Update local state with new array
      setEditFormData(prev => ({ ...prev, images: newImages }));
      setHasUnsavedChanges(true);
      
      console.log('✅ Image deleted successfully, remaining:', newImages.length);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('❌ Image deletion error:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete image');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setActionLoading(true);
    try {
      console.log('💾 Saving changes for submission:', editFormData.submissionId);
      console.log('💾 Saving changes for variant:', editFormData.id);
      console.log('Data to save:', editFormData);
      
      // ✅ VALIDATE: Ensure we have required IDs
      if (!editFormData.submissionId) {
        throw new Error('Missing submission ID - cannot save');
      }
      if (!editFormData.id) {
        throw new Error('Missing variant ID - cannot save');
      }
      
      // Prepare the data to save - INCLUDE ALL FIELDS
      const submissionData = {
        title: editFormData.submission?.title,
        brand: editFormData.submission?.brand,
        category_id: editFormData.submission?.category_id,
        category_path: editFormData.submission?.category_path,
        product_type_id: editFormData.submission?.product_type_id,
        product_type_name: editFormData.submission?.product_type_name,
        short_description: editFormData.submission?.short_description,
        description: editFormData.submission?.description,  // Long description
        attributes: editFormData.submission?.attributes || {},
        // SEO fields
        seo_title: editFormData.submission?.seo_title,
        seo_description: editFormData.submission?.seo_description,
        url_slug: editFormData.submission?.url_slug
      };
      
      console.log('📤 Submission data to send:', submissionData);
      
      const variantData = {
        price: parseFloat(editFormData.price) || 0,
        quantity: parseInt(editFormData.stock_quantity || editFormData.quantity || 0),
        size: editFormData.size,
        color: editFormData.color,
        variant_attributes: {
          ...(editFormData.variant_attributes || {}),
          size: editFormData.size,
          primary_colour: editFormData.color
        }
      };
      
      // Update submission (product-level data)
      const submissionResponse = await axios.put(
        `${API}/v3/submissions/${editFormData.submissionId}`,
        submissionData,
        { withCredentials: true }
      );
      
      // Update variant (variant-level data)
      await axios.put(
        `${API}/admin/variants/${editFormData.id}`,
        variantData,
        { withCredentials: true }
      );
      
      console.log('✅ Both updates complete');
      
      // CRITICAL: Update the form data with the freshly saved data from backend response
      if (submissionResponse.data && submissionResponse.data.data) {
        const freshData = submissionResponse.data.data;
        console.log('🔄 Updating form with fresh data from backend:', freshData);
        
        // Update editFormData with fresh data
        setEditFormData(prev => ({
          ...prev,
          submission: {
            ...prev.submission,
            ...freshData,
            // Ensure attributes is the product_attributes from response
            attributes: freshData.product_attributes || prev.submission.attributes,
            category_path: freshData.category || prev.submission.category_path
          }
        }));
      }
      
      setHasUnsavedChanges(false);
      setLastUpdated({
        date: new Date(),
        user: 'Admin'
      });
      toast.success('Changes saved successfully!');
      
      // Refresh the submissions list in background (this updates the list cache)
      fetchSubmissions();
      
      console.log('✅ Save complete');
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error(error.response?.data?.detail || 'Failed to save changes');
    } finally {
      setActionLoading(false);
    }
  };

  const getVariantLabel = (variant) => {
    // Get color and size from variant_attributes
    let size = '';
    let color = '';
    
    if (variant.variant_attributes && typeof variant.variant_attributes === 'object') {
      // Get color
      color = variant.variant_attributes.primary_colour || variant.variant_attributes['primary_colour'] || '';
      
      // Get size - check multiple size fields
      size = variant.variant_attributes.womens_size || 
             variant.variant_attributes.mens_size || 
             variant.variant_attributes.alpha_size || 
             variant.variant_attributes.size ||
             variant.variant_attributes['womens_size'] ||
             variant.variant_attributes['mens_size'] ||
             variant.variant_attributes['alpha_size'] || '';
    }
    
    // Filter out "default", "None / Not Applicable", and empty values
    const hasSize = size && 
      size.toString().toLowerCase() !== 'default' && 
      size.toString().toLowerCase() !== 'none / not applicable' &&
      size.toString().trim() !== '';
    const hasColor = color && 
      color.toString().toLowerCase() !== 'default' && 
      color.toString().toLowerCase() !== 'none / not applicable' &&
      color.toString().trim() !== '';
    
    if (hasSize && hasColor) {
      return `colour : ${color} / size : ${size}`;
    } else if (hasSize) {
      return `size : ${size}`;
    } else if (hasColor) {
      return `colour : ${color}`;
    }
    
    return 'No Variant Data';
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'pending') {
      return ['pending', 'submitted', 'pending_approval'].includes(sub.status);
    } else if (filterStatus === 'approved') {
      return sub.status === 'approved';
    } else if (filterStatus === 'rejected') {
      return sub.status === 'rejected';
    } else if (filterStatus === 'published') {
      return sub.status === 'published';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#00ffef]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-cyan-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate("/admin")} 
                variant="ghost" 
                className="text-white hover:text-cyan-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Product Submissions</h1>
                <p className="text-sm text-gray-300">Review and approve seller submissions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <Card className="mb-6 bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products, brands, SKUs, variants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border-2 border-gray-700 text-black hover:bg-gray-100 font-semibold"
                >
                  <Filter className="h-4 w-4 text-black" />
                  <span className="text-black">Filters</span>
                  {(filterSeller || filterBrand || filterCategory || filterProductType || filterColor || filterSize || filterSKU || filterGTIN || filterPriceMin || filterPriceMax) && (
                    <Badge variant="secondary" className="ml-1 bg-cyan-600 text-white">Active</Badge>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t-2 border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-black font-semibold">Filter by Seller</Label>
                    <Input
                      placeholder="Seller name..."
                      value={filterSeller}
                      onChange={(e) => setFilterSeller(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Filter by Brand</Label>
                    <Input
                      placeholder="Brand name..."
                      value={filterBrand}
                      onChange={(e) => setFilterBrand(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Filter by Category</Label>
                    <Input
                      placeholder="Category..."
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Filter by Product Type</Label>
                    <Input
                      placeholder="Product type..."
                      value={filterProductType}
                      onChange={(e) => setFilterProductType(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Filter by Color</Label>
                    <Input
                      placeholder="Color..."
                      value={filterColor}
                      onChange={(e) => setFilterColor(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Filter by Size</Label>
                    <Input
                      placeholder="Size..."
                      value={filterSize}
                      onChange={(e) => setFilterSize(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Filter by SKU</Label>
                    <Input
                      placeholder="SKU..."
                      value={filterSKU}
                      onChange={(e) => setFilterSKU(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Filter by GTIN</Label>
                    <Input
                      placeholder="GTIN..."
                      value={filterGTIN}
                      onChange={(e) => setFilterGTIN(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Min Price</Label>
                    <Input
                      type="number"
                      placeholder="Min..."
                      value={filterPriceMin}
                      onChange={(e) => setFilterPriceMin(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-black font-semibold">Max Price</Label>
                    <Input
                      type="number"
                      placeholder="Max..."
                      value={filterPriceMax}
                      onChange={(e) => setFilterPriceMax(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="flex items-end md:col-span-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterSeller('');
                        setFilterBrand('');
                        setFilterCategory('');
                        setFilterProductType('');
                        setFilterColor('');
                        setFilterSize('');
                        setFilterSKU('');
                        setFilterGTIN('');
                        setFilterPriceMin('');
                        setFilterPriceMax('');
                        setSearchTerm('');
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600 font-semibold"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {selectedItems.size > 0 && (
          <Card className="mb-6 bg-cyan-50 border-2 border-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900">
                    {selectedItems.size} variant{selectedItems.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleBulkApprove}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve All
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleBulkPost}
                    disabled={actionLoading}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Post All
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkReject}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedItems(new Set())}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Tabs */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="mb-6">
          <TabsList className="bg-white">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending ({submissions.filter(s => ['pending', 'submitted', 'pending_approval'].includes(s.status)).length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved ({submissions.filter(s => s.status === 'approved').length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({submissions.filter(s => s.status === 'rejected').length})
            </TabsTrigger>
            <TabsTrigger value="published" className="gap-2">
              <Star className="h-4 w-4" />
              Published ({submissions.filter(s => s.status === 'published').length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Package className="h-4 w-4" />
              All ({submissions.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Product List */}
        {groupedProducts.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No submissions found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.size > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 h-5 w-5"
                  />
                  <span className="font-medium text-gray-900">Select All Variants</span>
                </label>
              </CardContent>
            </Card>

            {/* Product Groups */}
            {groupedProducts.map((group, idx) => (
              <Card key={idx} className="bg-white overflow-hidden">
                <CardContent className="p-0">
                  {/* Product Header */}
                  <div 
                    className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleProductExpand(group.product_key)}
                  >
                    <div className="flex items-center gap-4">
                      <button className="text-gray-600">
                        {expandedProducts.has(group.product_key) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                      
                      {group.thumbnail && (
                        <img 
                          src={getImageUrl(group.thumbnail)} 
                          alt={group.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{group.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span><strong>Brand:</strong> {group.brand}</span>
                          {group.seller && (
                            <span><strong>Seller:</strong> {group.seller.business_name || group.seller.seller_id}</span>
                          )}
                          <Badge variant="secondary">
                            {group.variants.length} variant{group.variants.length !== 1 ? 's' : ''}
                          </Badge>
                          {/* Show status badge */}
                          {group.variants[0]?.submission?.status && (
                            <Badge 
                              variant={
                                group.variants[0].submission.status === 'APPROVED' ? 'default' :
                                group.variants[0].submission.status === 'PUBLISHED' ? 'default' :
                                group.variants[0].submission.status === 'REJECTED' ? 'destructive' :
                                'secondary'
                              }
                              className={
                                group.variants[0].submission.status === 'APPROVED' ? 'bg-green-600 text-white' :
                                group.variants[0].submission.status === 'PUBLISHED' ? 'bg-blue-600 text-white' :
                                ''
                              }
                            >
                              {group.variants[0].submission.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variants List */}
                  {expandedProducts.has(group.product_key) && (
                    <div className="divide-y">
                      {group.variants.map((variant) => {
                        const itemId = `${variant.submissionId}-${variant.id}`;
                        const isPending = ['pending', 'submitted', 'pending_approval'].includes(variant.submission?.status);
                        
                        return (
                          <div 
                            key={itemId}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={(e) => handleRowClick(variant, e)}
                          >
                            <div className="flex items-center gap-4">
                              {isPending && (
                                <input
                                  type="checkbox"
                                  checked={selectedItems.has(itemId)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleSelectItem(variant.submissionId, variant.id);
                                  }}
                                  className="rounded border-gray-300 h-5 w-5"
                                />
                              )}
                              
                              {variant.images && variant.images.length > 0 && (
                                <div className="relative">
                                  <img 
                                    src={getImageUrl(variant.images[0])} 
                                    alt="Variant"
                                    className="w-20 h-20 object-cover rounded border-2 border-gray-200"
                                  />
                                  <div className="absolute -top-1 -left-1 bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    Hero
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex-1 grid grid-cols-4 gap-4">
                                <div>
                                  <span className="text-xs text-gray-500">Variant</span>
                                  <p className="font-medium text-sm">{getVariantLabel(variant)}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">SKU</span>
                                  <p className="font-medium text-sm">{variant.sku || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Seller</span>
                                  <p className="font-medium text-sm truncate">
                                    {group.seller?.business_name || 'Unknown'}
                                  </p>
                                </div>
                                <div className="col-span-1">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-xs text-gray-500">Price/Offer</span>
                                      <p className="font-medium text-sm">${variant.price}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Stock</span>
                                      <p className="font-medium text-sm">{variant.quantity ?? variant.stock_quantity ?? variant.stock ?? 0}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <Badge 
                                variant={
                                  variant.submission.status === 'APPROVED' ? 'default' :
                                  variant.submission.status === 'PUBLISHED' ? 'default' :
                                  variant.submission.status === 'REJECTED' ? 'destructive' :
                                  'secondary'
                                }
                                className={
                                  variant.submission.status === 'APPROVED' ? 'bg-green-600 text-white' :
                                  variant.submission.status === 'PUBLISHED' ? 'bg-blue-600 text-white' :
                                  ''
                                }
                              >
                                {variant.submission.status || 'PENDING'}
                              </Badge>

                              {/* Show action buttons for non-rejected items */}
                              {variant.submission.status !== 'REJECTED' && variant.submission.status !== 'PUBLISHED' && (
                                <div className="flex items-center gap-2">
                                  {variant.submission.status !== 'APPROVED' && variant.submission.status !== 'PUBLISHED' && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproveVariant(variant);
                                      }}
                                      disabled={actionLoading}
                                      title="Approve"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      <span className="text-xs">Approve</span>
                                    </Button>
                                  )}
                                  {variant.submission.status === 'APPROVED' && variant.submission.approved_global_product_id && (
                                    <Button
                                      size="sm"
                                      className="bg-purple-600 hover:bg-purple-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePublishProduct(variant.submission.approved_global_product_id);
                                      }}
                                      disabled={actionLoading}
                                      title="Publish to make live on site"
                                    >
                                      <Star className="h-4 w-4 mr-1" />
                                      <span className="text-xs">Publish</span>
                                    </Button>
                                  )}
                                  {variant.submission.status !== 'REJECTED' && variant.submission.status !== 'PUBLISHED' && variant.submission.status !== 'APPROVED' && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRejectVariant(variant);
                                      }}
                                      disabled={actionLoading}
                                      title="Reject"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      <span className="text-xs">Reject</span>
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRowClick(variant, e);
                                    }}
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail/Edit Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={(open) => {
        if (!open && hasUnsavedChanges) {
          if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) {
            return;
          }
        }
        setShowDetailDialog(open);
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Product Details - Edit Mode</span>
              {hasUnsavedChanges && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleSaveChanges}
                  disabled={actionLoading}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              )}
            </DialogTitle>
            {lastUpdated && (
              <p className="text-sm text-gray-600">
                Last updated: {lastUpdated.date.toLocaleString()} by {lastUpdated.user}
              </p>
            )}
          </DialogHeader>
          
          {editFormData && (
            <div className="space-y-8 py-4">
              {/* Seller Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">Seller Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Seller ID 🔒</Label>
                    <Input value={editFormData.seller_id || ''} readOnly className="bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div>
                    <Label>Seller Name</Label>
                    <Input value={editFormData.seller?.business_name || 'Unknown'} readOnly className="bg-gray-50" />
                  </div>
                  <div className="col-span-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Price</Label>
                        <Input 
                          type="number"
                          value={editFormData.price || ''} 
                          onChange={(e) => handleFormChange('price', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Stock Qty</Label>
                        <Input 
                          type="number"
                          value={editFormData.stock_quantity ?? editFormData.quantity ?? editFormData.stock ?? 0} 
                          onChange={(e) => handleFormChange('stock_quantity', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Basics */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">Product Basics (Read-only IDs)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product ID 🔒</Label>
                    <Input value={editFormData.submissionId || ''} readOnly className="bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div>
                    <Label>Variant ID 🔒</Label>
                    <Input value={editFormData.id || ''} readOnly className="bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div>
                    <Label>SKU 🔒</Label>
                    <Input 
                      value={editFormData.sku || ''} 
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label>Variant GTIN 🔒</Label>
                    <Input 
                      value={editFormData.gtin || ''} 
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="GTIN (Read-only)"
                    />
                  </div>
                  <div>
                    <Label>Product Title *</Label>
                    <Input 
                      value={editFormData.submission?.title || ''} 
                      onChange={(e) => handleFormChange('title', e.target.value, true)}
                    />
                  </div>
                  <div>
                    <Label>Brand *</Label>
                    <Input 
                      value={editFormData.submission?.brand || ''} 
                      onChange={(e) => handleFormChange('brand', e.target.value, true)}
                    />
                  </div>
                  <div>
                    <Label>Size <span className="text-xs text-gray-500">(Dropdown)</span></Label>
                    <select
                      value={editFormData.size || ''} 
                      onChange={(e) => handleFormChange('size', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">-- Select Size --</option>
                      <optgroup label="Alpha Sizes">
                        {(attributeOptions['Alpha Size'] || ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']).map((size, idx) => (
                          <option key={`alpha-${idx}`} value={size}>{size}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Baby Sizes">
                        {(attributeOptions['Baby Size'] || ['00000', '0000', '000', '00', '0', '6-12 Months', '12-18 Months', '18-24 Months']).map((size, idx) => (
                          <option key={`baby-${idx}`} value={size}>{size}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Kids Sizes">
                        {(attributeOptions['Kids Size'] || ['2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '14']).map((size, idx) => (
                          <option key={`kids-${idx}`} value={size}>{size}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Women's Sizes">
                        {(attributeOptions['Womens Size'] || ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20']).map((size, idx) => (
                          <option key={`womens-${idx}`} value={size}>{size}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Men's Sizes">
                        {(attributeOptions['Mens Size'] || ['28', '30', '32', '34', '36', '38', '40', '42']).map((size, idx) => (
                          <option key={`mens-${idx}`} value={size}>{size}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <Label>Primary Color <span className="text-xs text-gray-500">(Dropdown)</span></Label>
                    <select
                      value={editFormData.color || ''} 
                      onChange={(e) => handleFormChange('color', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">-- Select Color --</option>
                      {(attributeOptions['Primary Colour'] || ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Grey', 'Beige']).map((color, idx) => (
                        <option key={idx} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Category & Product Type */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">Category & Product Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category <span className="text-xs text-gray-500">(Select to update)</span></Label>
                    <select
                      value={editFormData.submission?.category_id || ''}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.path || cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Changing category will update available attributes
                    </p>
                  </div>
                  
                  <div>
                    <Label>Product Type <span className="text-xs text-gray-500">(Select to update)</span></Label>
                    <select
                      value={editFormData.submission?.product_type_id || ''}
                      onChange={(e) => handleProductTypeChange(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">-- Select Product Type --</option>
                      {productTypes.map((pt) => (
                        <option key={pt.product_type_id} value={pt.product_type_id}>
                          {pt.product_type_name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Changing product type will update available attributes
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Attributes (from Product Type) */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">
                  Product Attributes
                  {editFormData.submission?.product_type_name && (
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      (for {editFormData.submission?.product_type_name})
                    </span>
                  )}
                </h3>
                
                {/* Debug info */}
                <div className="text-xs text-gray-500 mb-3">
                  Product Type Attributes: {productTypeAttributes?.length || 0}
                </div>
                
                {productTypeAttributes && productTypeAttributes.length > 0 ? (
                  <div>
                    {/* Dropdown Attributes First */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Dropdown Attributes</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {productTypeAttributes
                          .filter(attr => {
                            const attrName = (attr.name || '').toLowerCase();
                            // Exclude size, color, free text fields, and unit fields (will be paired)
                            return !attrName.includes('size') && 
                                   !attrName.includes('colour') && 
                                   !attrName.includes('color') &&
                                   !attrName.includes('usage') &&
                                   !attrName.includes('care') &&
                                   !attrName.includes('features') &&
                                   !attrName.includes('benefits') &&
                                   !attrName.includes('_unit') &&  // Exclude unit fields
                                   attr.options && attr.options.length > 0;
                          })
                          .map((attr) => {
                            const attrKey = attr.name || attr.attribute_name || attr.attribute_id;
                            const displayName = attr.display_name || attr.name || attrKey;
                            const currentValue = editFormData.submission?.attributes?.[attrKey] || '';
                            
                            // Check if this attr has a corresponding unit field
                            const unitFieldName = attrKey + '_unit';
                            const unitAttr = productTypeAttributes.find(a => 
                              (a.name || '').toLowerCase() === unitFieldName.toLowerCase()
                            );
                            
                            return (
                              <div key={attr.attribute_id || attrKey} className={unitAttr ? "col-span-2" : ""}>
                                <Label>
                                  {displayName}
                                  {attr.is_required && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                
                                {unitAttr ? (
                                  // Measurement field with value + unit
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input
                                      type="number"
                                      value={currentValue}
                                      onChange={(e) => handleAttributeChange(attrKey, e.target.value)}
                                      placeholder={`Enter ${displayName}`}
                                    />
                                    <select
                                      value={editFormData.submission?.attributes?.[unitFieldName] || ''}
                                      onChange={(e) => handleAttributeChange(unitFieldName, e.target.value)}
                                      className="w-full px-3 py-2 border rounded-md"
                                    >
                                      <option value="">-- Unit --</option>
                                      {(unitAttr.options || []).map((opt, idx) => (
                                        <option key={idx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </div>
                                ) : (
                                  // Regular dropdown
                                  <select
                                    value={currentValue}
                                    onChange={(e) => handleAttributeChange(attrKey, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                  >
                                    <option value="">-- Select {displayName} --</option>
                                    {attr.options.map((opt, idx) => (
                                      <option key={idx} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    
                    {/* Free Text Attributes */}
                    {productTypeAttributes.filter(attr => {
                      const attrName = (attr.name || '').toLowerCase();
                      return !attrName.includes('size') && 
                             !attrName.includes('colour') && 
                             !attrName.includes('color') &&
                             !attrName.includes('usage') &&
                             !attrName.includes('care') &&
                             !attrName.includes('features') &&
                             !attrName.includes('benefits') &&
                             !attrName.includes('_unit') &&
                             (!attr.options || attr.options.length === 0);
                    }).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Free Text Attributes</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {productTypeAttributes
                            .filter(attr => {
                              const attrName = (attr.name || '').toLowerCase();
                              return !attrName.includes('size') && 
                                     !attrName.includes('colour') && 
                                     !attrName.includes('color') &&
                                     !attrName.includes('usage') &&
                                     !attrName.includes('care') &&
                                     !attrName.includes('features') &&
                                     !attrName.includes('benefits') &&
                                     !attrName.includes('_unit') &&
                                     (!attr.options || attr.options.length === 0);
                            })
                            .map((attr) => {
                              const attrKey = attr.name || attr.attribute_name || attr.attribute_id;
                              const displayName = attr.display_name || attr.name || attrKey;
                              const currentValue = editFormData.submission?.attributes?.[attrKey] || '';
                              
                              return (
                                <div key={attr.attribute_id || attrKey}>
                                  <Label>
                                    {displayName}
                                    {attr.is_required && <span className="text-red-500 ml-1">*</span>}
                                  </Label>
                                  <Input
                                    value={currentValue}
                                    onChange={(e) => handleAttributeChange(attrKey, e.target.value)}
                                    placeholder={attr.placeholder || `Enter ${displayName}`}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-sm text-blue-800">
                      {editFormData.submission?.product_type_id ? (
                        <>
                          ℹ️ No additional attributes available for this product type.
                          <br />
                          <span className="text-xs mt-1 block">
                            The basic fields above (Size, Color, Title, Brand) may be sufficient.
                          </span>
                        </>
                      ) : (
                        <>
                          📋 Select a product type above to load relevant attributes.
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Usage & Care Instructions */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">Usage & Care Instructions</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Usage Instructions</Label>
                    <Textarea 
                      value={editFormData.submission?.usage_instructions || ''} 
                      onChange={(e) => handleFormChange('usage_instructions', e.target.value, true)}
                      rows={3}
                      placeholder="How to use this product..."
                    />
                  </div>
                  <div>
                    <Label>Care Instructions</Label>
                    <Textarea 
                      value={editFormData.submission?.care_instructions || ''} 
                      onChange={(e) => handleFormChange('care_instructions', e.target.value, true)}
                      rows={3}
                      placeholder="How to care for this product..."
                    />
                  </div>
                </div>
              </div>

              {/* Features & Benefits (Combined List) */}
              <div className="border-b pb-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-3">Features & Benefits</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 mb-3 font-medium">
                      Select a feature or benefit from the dropdown and click the "Add to List" button to add it.
                    </p>
                    <div className="flex items-center gap-3">
                      <select
                        id="new-feature-benefit-select"
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={newFeatureBenefit}
                        onChange={(e) => {
                          console.log('🔵 Dropdown changed to:', e.target.value);
                          setNewFeatureBenefit(e.target.value);
                        }}
                      >
                        <option value="">-- Select feature or benefit --</option>
                        {(attributeOptions['Features & Benefits'] || []).map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                      <Button 
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold shadow-md"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🟢 ===== ADD BUTTON CLICKED =====');
                          console.log('🟢 Current newFeatureBenefit value:', newFeatureBenefit);
                          console.log('🟢 Current editFormData.submission?.features_benefits:', editFormData.submission?.features_benefits);
                          
                          if (!newFeatureBenefit || newFeatureBenefit.trim() === '') {
                            console.log('🔴 ERROR: newFeatureBenefit is empty!');
                            toast.error('Please select an option first');
                            return;
                          }
                          
                          // Get current list, ensure it's an array
                          const currentList = Array.isArray(editFormData.submission?.features_benefits) 
                            ? [...editFormData.submission.features_benefits]
                            : [];
                          
                          console.log('🟢 Current list (before add):', currentList);
                          
                          // Add the new item
                          currentList.push(newFeatureBenefit);
                          
                          console.log('🟢 New list (after add):', currentList);
                          
                          // Update state
                          setEditFormData(prev => {
                            const updated = {
                              ...prev,
                              submission: {
                                ...(prev.submission || {}),
                                features_benefits: currentList
                              }
                            };
                            console.log('🟢 Updated editFormData:', updated);
                            return updated;
                          });
                          
                          // Clear the dropdown
                          setNewFeatureBenefit('');
                          setHasUnsavedChanges(true);
                          
                          console.log('✅ ===== ADD COMPLETE =====');
                          toast.success(`Added: ${newFeatureBenefit}`);
                        }}
                        disabled={!newFeatureBenefit || newFeatureBenefit === ''}
                      >
                        ➕ Add to List
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Current List ({(editFormData.submission?.features_benefits || []).length} items):
                  </p>
                  {(!editFormData.submission?.features_benefits || editFormData.submission.features_benefits.length === 0) ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                      <p className="text-gray-500 text-sm">
                        ℹ️ No features or benefits added yet. Use the dropdown above to add items.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white border rounded-lg p-4">
                      {editFormData.submission.features_benefits.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded border mb-2 hover:bg-gray-100 transition-colors">
                          <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded min-w-[40px] text-center">{idx + 1}</span>
                          <select
                            value={item}
                            onChange={(e) => handleFeaturesBenefitsChange(idx, e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md bg-white"
                          >
                            <option value="">-- Select --</option>
                            {(attributeOptions['Features & Benefits'] || []).map((option, optIdx) => (
                            <option key={optIdx} value={option}>{option}</option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            console.log('🗑️ Removing item at index:', idx);
                            handleRemoveFeaturesBenefits(idx);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">Product Description</h3>
                <div>
                  <Label>Full Description</Label>
                  <Textarea 
                    value={editFormData.submission?.description || ''} 
                    onChange={(e) => handleFormChange('description', e.target.value, true)}
                    rows={6}
                  />
                </div>
              </div>

              {/* SEO Data */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">SEO Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label>SEO Title</Label>
                    <Input 
                      value={editFormData.submission?.seo_title || ''} 
                      onChange={(e) => handleFormChange('seo_title', e.target.value, true)}
                    />
                  </div>
                  <div>
                    <Label>URL Slug</Label>
                    <Input 
                      value={editFormData.submission?.url_slug || editFormData.submission?.slug || ''} 
                      onChange={(e) => handleFormChange('url_slug', e.target.value, true)}
                      placeholder="e.g., piper-mini-dress-black"
                    />
                  </div>
                  <div>
                    <Label>SEO Description</Label>
                    <Textarea 
                      value={editFormData.submission?.seo_description || ''} 
                      onChange={(e) => handleFormChange('seo_description', e.target.value, true)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>SEO Keywords</Label>
                    <Input 
                      value={editFormData.submission?.seo_keywords || ''} 
                      onChange={(e) => handleFormChange('seo_keywords', e.target.value, true)}
                      placeholder="Comma separated keywords"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Product Images</h3>
                </div>
                {editFormData.images && editFormData.images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {editFormData.images.map((img, idx) => (
                        <div key={idx} className="border rounded-lg p-3 space-y-3">
                          <div className="relative group">
                            <img 
                              src={getImageUrl(img)} 
                              alt={`Image ${idx + 1}`}
                              className="w-full h-auto max-h-64 object-contain rounded border bg-gray-50"
                              onLoad={(e) => {
                                // Store dimensions as data attribute
                                const imgElement = e.target;
                                imgElement.dataset.width = imgElement.naturalWidth;
                                imgElement.dataset.height = imgElement.naturalHeight;
                              }}
                            />
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded font-bold flex items-center gap-1 shadow-lg z-10">
                                <Star className="h-4 w-4" />
                                Hero
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2">
                              {idx > 0 && (
                                <Button
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100"
                                  onClick={() => handleSetHeroImage(idx)}
                                  title="Set as Hero"
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              )}
                              {idx > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="opacity-0 group-hover:opacity-100 bg-white"
                                  onClick={() => handleImageReorder(idx, idx - 1)}
                                  title="Move Up"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                              )}
                              {idx < editFormData.images.length - 1 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="opacity-0 group-hover:opacity-100 bg-white"
                                  onClick={() => handleImageReorder(idx, idx + 1)}
                                  title="Move Down"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                className="opacity-0 group-hover:opacity-100"
                                onClick={() => handleDeleteImage(idx)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium text-gray-600">Position:</span> {idx + 1}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Format:</span> {
                                  img.includes('/api/files/') 
                                    ? 'PNG' 
                                    : (img.split('.').pop()?.toUpperCase() || 'Unknown')
                                }
                              </div>
                            </div>
                            <div className="bg-blue-50 p-2 rounded">
                              <span className="font-medium text-gray-600">Dimensions:</span>
                              <span className="ml-1" id={`img-dim-${idx}`}>Loading...</span>
                            </div>
                            <div>
                              <Label className="text-xs">Filename</Label>
                              <p className="font-mono text-xs truncate bg-gray-50 p-1 rounded">
                                {img.includes('/api/files/') 
                                  ? img.split('/').pop() 
                                  : img.split('/').pop()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs">Alt Tag</Label>
                              <Input 
                                className="h-7 text-xs"
                                placeholder="Image alt text..."
                                defaultValue={`${editFormData.submission?.title} - ${getVariantLabel(editFormData)} - Image ${idx + 1}`}
                              />
                            </div>
                          </div>
                          <img 
                            src={getImageUrl(img)} 
                            alt=""
                            className="hidden"
                            onLoad={(e) => {
                              const dimEl = document.getElementById(`img-dim-${idx}`);
                              if (dimEl) {
                                dimEl.textContent = `${e.target.naturalWidth} × ${e.target.naturalHeight} px`;
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Add Image Button Below Existing Images */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors bg-gray-50">
                      <input
                        type="file"
                        id="image-upload-input"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={actionLoading}
                      />
                      <Button 
                        variant="default"
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                        onClick={() => document.getElementById('image-upload-input').click()}
                        disabled={actionLoading}
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        {actionLoading ? 'Uploading...' : 'Add Another Image'}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2 font-medium">JPG or PNG only, min 1200px on one side</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No images available</p>
                    <input
                      type="file"
                      id="image-upload-input"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={actionLoading}
                    />
                    <Button 
                      variant="default"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-6"
                      onClick={() => document.getElementById('image-upload-input').click()}
                      disabled={actionLoading}
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      {actionLoading ? 'Uploading...' : 'Upload First Image'}
                    </Button>
                    <p className="text-sm text-gray-600 mt-3 font-medium">Click to upload an image (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
            {hasUnsavedChanges && (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSaveChanges}
                disabled={actionLoading}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={showBulkRejectDialog} onOpenChange={setShowBulkRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Selected Submissions</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedItems.size} submission(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={bulkRejectReason}
              onChange={(e) => setBulkRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitBulkReject} disabled={actionLoading}>
              Reject All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Item Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this submission
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReject} disabled={actionLoading}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubmissions;
