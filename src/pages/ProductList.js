import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, CheckCircle, Clock, Edit, Save, X, Search, Plus, DollarSign, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';
import SellerLayout from '../components/SellerLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingInventory, setSavingInventory] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterStatus]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`, { withCredentials: true });
      setProducts(response.data);
    } catch (e) {
      console.error('Error fetching products:', e);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor_sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(product => {
        if (filterStatus === 'approved') return product.approval_status === 'APPROVED';
        if (filterStatus === 'pending') return product.approval_status === 'NOT APPROVED';
        return true;
      });
    }
    
    setFilteredProducts(filtered);
  };

  const getStatusBadge = (status) => {
    if (status === 'APPROVED') {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      );
    }
  };

  const getStockBadge = (stockStatus) => {
    const badges = {
      'in_stock': <Badge className="bg-green-100 text-green-700">In Stock</Badge>,
      'low_stock': <Badge className="bg-yellow-100 text-yellow-700">Low Stock</Badge>,
      'out_of_stock': <Badge className="bg-red-100 text-red-700">Out of Stock</Badge>
    };
    return badges[stockStatus] || <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
  };

  const handleEditInventory = (product) => {
    // Initialize editing state with current product data
    const variantEdits = product.variants?.map(v => ({
      variant_id: v.variant_id,
      size: v.size,
      colour: v.colour,
      price: v.price || 0,
      stock_qty: v.stock_qty || 0,
      stock_status: v.stock_status || 'out_of_stock'
    })) || [];
    
    setEditingInventory({
      product_id: product.product_id,
      product_name: product.name,
      variants: variantEdits
    });
  };

  const updateVariantField = (variantIndex, field, value) => {
    setEditingInventory(prev => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex][field] = field === 'price' || field === 'stock_qty' ? parseFloat(value) || 0 : value;
      return { ...prev, variants: newVariants };
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      product_id: product.product_id,
      name: product.name,
      brand: product.brand,
      description: product.description,
      components: product.components || '',
      care_instructions: product.care_instructions,
      seo_description: product.seo_description
    });
  };

  const updateProductField = (field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProductChanges = async () => {
    setSavingProduct(true);
    try {
      await axios.patch(
        `${API}/products/${editingProduct.product_id}`,
        editingProduct,
        { withCredentials: true }
      );
      
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error(error.response?.data?.detail || 'Failed to update product');
    } finally {
      setSavingProduct(false);
    }
  };

  const saveInventoryChanges = async () => {
    setSavingInventory(true);
    try {
      await axios.patch(
        `${API}/products/${editingInventory.product_id}/inventory`,
        {
          product_id: editingInventory.product_id,
          variant_updates: editingInventory.variants
        },
        { withCredentials: true }
      );
      
      toast.success('Inventory updated successfully!');
      setEditingInventory(null);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Failed to update inventory:', error);
      toast.error(error.response?.data?.detail || 'Failed to update inventory');
    } finally {
      setSavingInventory(false);
    }
  };

  const getTotalStock = (product) => {
    return product.variants?.reduce((sum, v) => sum + (v.stock_qty || 0), 0) || 0;
  };

  const getLowestPrice = (product) => {
    const prices = product.variants?.map(v => v.price || 0).filter(p => p > 0) || [];
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  if (loading) {
    return (
      <SellerLayout title="My Products">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE]"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="My Products">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
            <p className="text-gray-500">Manage your catalogue, inventory & pricing</p>
          </div>
          <Button
            onClick={() => navigate('/products/new-v3')}
            className="bg-[#FF3CFE] hover:bg-[#FF3CFE]/90 text-white"
            data-testid="add-product-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-gray-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, SKU, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
              
              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products ({products.length})</SelectItem>
                  <SelectItem value="approved">Approved ({products.filter(p => p.approval_status === 'APPROVED').length})</SelectItem>
                  <SelectItem value="pending">Pending ({products.filter(p => p.approval_status === 'NOT APPROVED').length})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-blue-600">{products.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{products.filter(p => p.approval_status === 'APPROVED').length}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.approval_status === 'NOT APPROVED').length}</p>
              </div>
              <div className="bg-brand-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Stock</p>
                <p className="text-2xl font-bold text-brand-600">{products.reduce((sum, p) => sum + getTotalStock(p), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <Card className="border-gray-200 bg-white">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by submitting your first product'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button
                  onClick={() => navigate('/products/new-v3')}
                  data-testid="submit-first-product-btn"
                  className="bg-[#FF3CFE] hover:bg-[#FF3CFE]/90 text-white"
                >
                  Submit Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.product_id}
                className="border-gray-200 bg-white hover:shadow-md transition-all"
                data-testid={`product-card-${product.product_id}`}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        {getStatusBadge(product.approval_status)}
                      </div>
                      <CardDescription className="flex flex-wrap gap-4 text-sm">
                        <span><strong>SKU:</strong> {product.vendor_sku}</span>
                        <span><strong>Brand:</strong> {product.brand}</span>
                        <span><strong>Category:</strong> {product.category_level_1} → {product.category_level_2}</span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                        className="border-blue-200 hover:bg-blue-50"
                        data-testid={`view-details-${product.product_id}`}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="border-brand-200 hover:bg-brand-50 text-brand-600"
                        data-testid={`edit-product-${product.product_id}`}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Product
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditInventory(product)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white"
                        data-testid={`edit-inventory-${product.product_id}`}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Manage Inventory
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Variants Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Variants</p>
                      <p className="text-lg font-semibold text-gray-900">{product.variants?.length || 0} variants</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Stock</p>
                      <p className="text-lg font-semibold text-gray-900">{getTotalStock(product)} units</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Price Range</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getLowestPrice(product) > 0 ? `From $${getLowestPrice(product).toFixed(2)}` : 'Not set'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Variant Overview */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Variants:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.slice(0, 5).map((variant, idx) => (
                          <div key={idx} className="bg-blue-50 border border-blue-200 rounded px-3 py-1 text-xs">
                            <span className="font-medium">{variant.size} - {variant.colour}</span>
                            <span className="text-gray-600 ml-2">
                              {variant.price ? `$${variant.price}` : 'No price'} | 
                              {variant.stock_qty || 0} units
                            </span>
                          </div>
                        ))}
                        {product.variants.length > 5 && (
                          <div className="bg-gray-100 border border-gray-300 rounded px-3 py-1 text-xs text-gray-600">
                            +{product.variants.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {product.admin_notes && (
                    <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-orange-900 mb-1">Admin Notes:</p>
                      <p className="text-sm text-orange-800">{product.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      {/* Product Details Modal */}
      <Dialog open={selectedProduct !== null} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Product Details</DialogTitle>
            <DialogDescription>Complete product information</DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Product Name</p>
                  <p className="text-base font-semibold">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Brand</p>
                  <p className="text-base font-semibold">{selectedProduct.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendor SKU</p>
                  <p className="font-mono text-base">{selectedProduct.vendor_sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Barcode</p>
                  <p className="font-mono text-base">{selectedProduct.barcode}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">Description</p>
                  <p className="text-sm mt-1">{selectedProduct.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Categories</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-100 px-3 py-1 rounded-full">{selectedProduct.category_level_1}</span>
                  <span>→</span>
                  <span className="bg-blue-100 px-3 py-1 rounded-full">{selectedProduct.category_level_2}</span>
                  {selectedProduct.category_level_3 && (
                    <>
                      <span>→</span>
                      <span className="bg-blue-100 px-3 py-1 rounded-full">{selectedProduct.category_level_3}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={editingProduct !== null} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Edit className="w-6 h-6 text-brand-600" />
              Edit Product Information
            </DialogTitle>
            <DialogDescription>
              Update product details. Note: Categories and variants cannot be changed after submission.
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Name *</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => updateProductField('name', e.target.value)}
                  placeholder="Product name"
                  maxLength={35}
                />
                <p className="text-xs text-gray-500">{editingProduct.name.length}/35 characters</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Brand *</label>
                <Input
                  value={editingProduct.brand}
                  onChange={(e) => updateProductField('brand', e.target.value)}
                  placeholder="Brand name"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500">{editingProduct.brand.length}/20 characters</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => updateProductField('description', e.target.value)}
                  rows={4}
                  placeholder="Product description"
                  maxLength={600}
                />
                <p className="text-xs text-gray-500">{editingProduct.description.length}/600 characters (max)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Components</label>
                <Textarea
                  value={editingProduct.components}
                  onChange={(e) => updateProductField('components', e.target.value)}
                  rows={3}
                  placeholder="Product components (optional)"
                  maxLength={240}
                />
                <p className="text-xs text-gray-500">{editingProduct.components.length}/240 characters (max)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Care Instructions *</label>
                <Textarea
                  value={editingProduct.care_instructions}
                  onChange={(e) => updateProductField('care_instructions', e.target.value)}
                  rows={3}
                  placeholder="Care instructions"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500">{editingProduct.care_instructions.length}/300 characters (max)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">SEO Description *</label>
                <Textarea
                  value={editingProduct.seo_description}
                  onChange={(e) => updateProductField('seo_description', e.target.value)}
                  rows={3}
                  placeholder="SEO description"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500">{editingProduct.seo_description.length}/300 characters (max)</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Changes to categories, variants, media, and dimensions are not supported through this editor. 
                  Contact support if you need to modify these fields.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={saveProductChanges}
                  disabled={savingProduct}
                  className="flex-1 bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-90 text-white"
                  data-testid="save-product-btn"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingProduct ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  disabled={savingProduct}
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Inventory Management Modal */}
      <Dialog open={editingInventory !== null} onOpenChange={() => setEditingInventory(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-green-600" />
              Manage Inventory & Pricing
            </DialogTitle>
            <DialogDescription>
              Update stock quantities, pricing, and availability for {editingInventory?.product_name}
            </DialogDescription>
          </DialogHeader>
          
          {editingInventory && (
            <div className="space-y-4">
              {editingInventory.variants.map((variant, index) => (
                <Card key={variant.variant_id} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Variant {index + 1}: {variant.size} - {variant.colour}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Price (AUD)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price}
                          onChange={(e) => updateVariantField(index, 'price', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          <Package className="w-4 h-4 inline mr-1" />
                          Stock Quantity
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock_qty}
                          onChange={(e) => updateVariantField(index, 'stock_qty', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Stock Status</label>
                        <Select
                          value={variant.stock_status}
                          onValueChange={(value) => updateVariantField(index, 'stock_status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_stock">In Stock</SelectItem>
                            <SelectItem value="low_stock">Low Stock</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={saveInventoryChanges}
                  disabled={savingInventory}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white"
                  data-testid="save-inventory-btn"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingInventory ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingInventory(null)}
                  disabled={savingInventory}
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SellerLayout>
  );
};

export default ProductList;
