import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, Package, AlertCircle, FileText, User, Tag, Box } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [reviewAction, setReviewAction] = useState(null); // 'approve' or 'reject'

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filterStatus, allProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/products`, { withCredentials: true });
      setAllProducts(response.data);
    } catch (e) {
      console.error('Error fetching products:', e);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...allProducts];
    
    if (filterStatus === 'pending') {
      filtered = filtered.filter(p => 
        p.approval_status === 'NOT APPROVED' && !p.admin_notes
      );
    } else if (filterStatus === 'approved') {
      filtered = filtered.filter(p => p.approval_status === 'APPROVED');
    } else if (filterStatus === 'rejected') {
      filtered = filtered.filter(p => 
        p.approval_status === 'REJECTED' || (p.approval_status === 'NOT APPROVED' && p.admin_notes)
      );
    }
    // 'all' shows everything
    
    setProducts(filtered);
  };

  const handleReviewAction = (product, action) => {
    setSelectedProduct(product);
    setReviewAction(action);
    setAdminNotes(product.admin_notes || '');
  };

  const submitReview = async () => {
    if (!selectedProduct || !reviewAction) return;
    
    setActionLoading(true);
    try {
      await axios.post(
        `${API}/admin/products/${selectedProduct.product_id}/approve`,
        {
          approval_status: reviewAction === 'approve' ? 'APPROVED' : 'REJECTED',
          admin_notes: adminNotes
        },
        { withCredentials: true }
      );
      
      toast.success(`Product ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully`);
      setSelectedProduct(null);
      setReviewAction(null);
      setAdminNotes('');
      fetchProducts();
    } catch (error) {
      console.error('Review error:', error);
      toast.error(error.response?.data?.detail || 'Failed to update product');
    } finally {
      setActionLoading(false);
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setReviewAction(null);
    setAdminNotes(product.admin_notes || '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#00ffef]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img 
                  src="https://customer-assets.emergentagent.com/job_estore-fixes/artifacts/j6vnm434_Screenshot%202025-12-01%20060725.jpg" 
                  alt="GOT-STOCK"
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity animate-spin-y rounded-full"
                />
              </Link>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm font-medium text-gray-700">Admin Portal</p>
                <p className="text-xs text-gray-500">Submission Review</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Product Submission Review</h1>
          <p className="text-lg text-gray-200">Review and manage product submissions from sellers</p>
        </div>

        {/* Stats Cards - stacked to emphasise pending submissions */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="border-orange-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {allProducts.filter(p => p.approval_status === 'NOT APPROVED' && !p.admin_notes).length}
                  </p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {allProducts.filter(p => p.approval_status === 'APPROVED').length}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">
                    {allProducts.filter(p => p.approval_status === 'REJECTED' || (p.approval_status === 'NOT APPROVED' && p.admin_notes)).length}
                  </p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-blue-600">{allProducts.length}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="mb-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="pending" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Clock className="w-4 h-4 mr-2" />
              Pending ({allProducts.filter(p => p.approval_status === 'NOT APPROVED' && !p.admin_notes).length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approved ({allProducts.filter(p => p.approval_status === 'APPROVED').length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
              <XCircle className="w-4 h-4 mr-2" />
              Rejected ({allProducts.filter(p => p.approval_status === 'REJECTED' || (p.approval_status === 'NOT APPROVED' && p.admin_notes)).length})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Package className="w-4 h-4 mr-2" />
              All Products ({allProducts.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Products List */}
        {products.length === 0 ? (
          <Card className="border-blue-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-200">
                {filterStatus === 'pending' ? 'No products pending review at the moment' : 
                 filterStatus === 'approved' ? 'No approved products yet' : 
                 'No products submitted yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card 
                key={product.product_id} 
                className={`bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow ${
                  product.approval_status === 'NOT APPROVED' ? 'border-orange-200' : 'border-green-200'
                }`}
                data-testid={`product-card-${product.product_id}`}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <Badge className={
                          product.approval_status === 'APPROVED' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-orange-100 text-orange-700 border-orange-200'
                        }>
                          {product.approval_status === 'APPROVED' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" />Approved</>
                          ) : (
                            <><Clock className="w-3 h-3 mr-1" />Pending Review</>
                          )}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><User className="w-4 h-4 inline mr-1" /><strong>Brand:</strong> {product.brand}</p>
                        <p><Tag className="w-4 h-4 inline mr-1" /><strong>SKU:</strong> {product.vendor_sku}</p>
                        <p><FileText className="w-4 h-4 inline mr-1" /><strong>Category:</strong> {product.category_level_1} → {product.category_level_2}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProductDetails(product)}
                        className="border-blue-200 hover:bg-blue-50 w-full"
                        data-testid={`view-details-btn-${product.product_id}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review Details
                      </Button>
                      {product.approval_status === 'NOT APPROVED' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReviewAction(product, 'approve')}
                            data-testid={`quick-approve-btn-${product.product_id}`}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReviewAction(product, 'reject')}
                            data-testid={`quick-reject-btn-${product.product_id}`}
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Media Thumbnails */}
                  {product.media && product.media.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Product Media:</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {product.media.slice(0, 5).map((media, idx) => (
                          <div key={idx} className="relative flex-shrink-0">
                            <img 
                              src={media.media_url} 
                              alt={media.alt_text || `Product image ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                              }}
                            />
                            {media.is_primary && (
                              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                        ))}
                        {product.media.length > 5 && (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-xs font-medium">
                            +{product.media.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Barcode</p>
                      <p className="font-mono text-sm font-medium text-gray-900">{product.barcode}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Variants</p>
                      <p className="text-sm font-medium text-gray-900">{product.variants?.length || 0} variant(s)</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Media Files</p>
                      <p className="text-sm font-medium text-gray-900">{product.media?.length || 0} file(s)</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Gender</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{product.gender}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Description:</p>
                    <p className="text-sm text-blue-800 line-clamp-2">{product.description}</p>
                  </div>
                  
                  {product.admin_notes && (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-yellow-900 mb-1">Admin Notes:</p>
                      <p className="text-sm text-yellow-800">{product.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Product Review Modal */}
      <Dialog open={selectedProduct !== null} onOpenChange={() => {
        setSelectedProduct(null);
        setReviewAction(null);
        setAdminNotes('');
      }}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {reviewAction ? (
                reviewAction === 'approve' ? (
                  <><CheckCircle className="w-6 h-6 text-green-600" />Approve Product</>
                ) : (
                  <><XCircle className="w-6 h-6 text-red-600" />Reject Product</>
                )
              ) : (
                <><Eye className="w-6 h-6 text-blue-600" />Product Review Details</>
              )}
            </DialogTitle>
            <DialogDescription>
              {reviewAction ? 'Add notes and confirm your decision' : 'Complete product information for review'}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg border-b pb-2 text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Product Name</p>
                    <p className="text-base font-semibold text-gray-900">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brand</p>
                    <p className="text-base font-semibold text-gray-900">{selectedProduct.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vendor SKU</p>
                    <p className="font-mono text-base text-gray-900">{selectedProduct.vendor_sku}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Barcode</p>
                    <p className="font-mono text-base text-gray-900">{selectedProduct.barcode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-base capitalize text-gray-900">{selectedProduct.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Currency</p>
                    <p className="text-base text-gray-900">{selectedProduct.currency}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <p className="text-sm text-gray-700 mt-1">{selectedProduct.description}</p>
                  </div>
                  {selectedProduct.components && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-600">Components</p>
                      <p className="text-sm text-gray-700 mt-1">{selectedProduct.components}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg border-b pb-2 text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5" /> Categories
                </h3>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{selectedProduct.category_level_1}</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{selectedProduct.category_level_2}</span>
                  {selectedProduct.category_level_3 && (
                    <>
                      <span className="text-gray-400">→</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{selectedProduct.category_level_3}</span>
                    </>
                  )}
                  {selectedProduct.category_level_4 && (
                    <>
                      <span className="text-gray-400">→</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{selectedProduct.category_level_4}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Dimensions & Weight */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg border-b pb-2 text-gray-900 flex items-center gap-2">
                  <Box className="w-5 h-5" /> Dimensions & Weight
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm font-medium text-gray-600">Height</p>
                    <p className="text-base text-gray-900">{selectedProduct.height_value} {selectedProduct.height_metric}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm font-medium text-gray-600">Width</p>
                    <p className="text-base text-gray-900">{selectedProduct.width_value} {selectedProduct.width_metric}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm font-medium text-gray-600">Depth</p>
                    <p className="text-base text-gray-900">{selectedProduct.depth_value} {selectedProduct.depth_metric}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm font-medium text-gray-600">Weight</p>
                    <p className="text-base text-gray-900">{selectedProduct.weight_value} {selectedProduct.weight_metric}</p>
                  </div>
                </div>
              </div>

              {/* Features & Sustainability */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg border-b pb-2 text-gray-900">Features & Benefits</h3>
                <div className="space-y-2">
                  {selectedProduct.features_benefits_1 && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-700">• {selectedProduct.features_benefits_1}</p>
                    </div>
                  )}
                  {selectedProduct.features_benefits_2 && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-700">• {selectedProduct.features_benefits_2}</p>
                    </div>
                  )}
                  {selectedProduct.features_benefits_3 && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-700">• {selectedProduct.features_benefits_3}</p>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-base mt-4 text-gray-900">Sustainability Features</h3>
                <div className="space-y-2">
                  {selectedProduct.sustainability_features_1 && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-gray-700">• {selectedProduct.sustainability_features_1}</p>
                    </div>
                  )}
                  {selectedProduct.sustainability_features_2 && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-gray-700">• {selectedProduct.sustainability_features_2}</p>
                    </div>
                  )}
                  {selectedProduct.sustainability_features_3 && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-gray-700">• {selectedProduct.sustainability_features_3}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg border-b pb-2 text-gray-900">Additional Information</h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedProduct.care_instructions && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Care Instructions</p>
                      <p className="text-sm text-gray-700 mt-1">{selectedProduct.care_instructions}</p>
                    </div>
                  )}
                  {selectedProduct.seo_description && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">SEO Description</p>
                      <p className="text-sm text-gray-700 mt-1">{selectedProduct.seo_description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg border-b pb-2 text-gray-900">Product Variants ({selectedProduct.variants?.length || 0})</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedProduct.variants?.map((variant, index) => (
                    <div key={variant.variant_id || index} className="bg-brand-50 p-4 rounded-lg border border-brand-100">
                      <p className="font-semibold text-sm text-gray-900 mb-2">Variant {index + 1}</p>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Size</p>
                          <p className="font-medium">{variant.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Colour</p>
                          <p className="font-medium">{variant.colour}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Material</p>
                          <p className="font-medium">{variant.material}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Gender</p>
                          <p className="font-medium">{variant.variant_gender}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Style</p>
                          <p className="font-medium">{variant.style_attributes}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Occasion</p>
                          <p className="font-medium">{variant.occasion_attributes}</p>
                        </div>
                        <div className="col-span-3">
                          <p className="text-gray-600">Barcode</p>
                          <p className="font-mono font-medium">{variant.barcode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes Section */}
              {reviewAction && (
                <div className="space-y-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Admin Notes {reviewAction === 'reject' ? '(Required for rejection)' : '(Optional)'}
                  </h3>
                  <Textarea
                    placeholder={reviewAction === 'approve' 
                      ? 'Add notes about this approval (optional)' 
                      : 'Please explain why this product is being rejected (required)'}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="bg-white"
                    data-testid="admin-notes-input"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {reviewAction ? (
                  <>
                    <Button
                      onClick={submitReview}
                      data-testid="confirm-action-btn"
                      disabled={actionLoading || (reviewAction === 'reject' && !adminNotes.trim())}
                      className={reviewAction === 'approve' 
                        ? 'flex-1 bg-green-600 hover:bg-green-700 text-white' 
                        : 'flex-1 bg-red-600 hover:bg-red-700 text-white'}
                    >
                      {reviewAction === 'approve' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                      {actionLoading ? 'Processing...' : reviewAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReviewAction(null);
                        setAdminNotes(selectedProduct.admin_notes || '');
                      }}
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  selectedProduct.approval_status === 'NOT APPROVED' && (
                    <>
                      <Button
                        onClick={() => setReviewAction('approve')}
                        data-testid="modal-approve-btn"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Product
                      </Button>
                      <Button
                        onClick={() => setReviewAction('reject')}
                        data-testid="modal-reject-btn"
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Product
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
