import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Package, ArrowRight, Plus } from 'lucide-react';

const SubmissionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    // Get product data from navigation state
    if (location.state?.productData) {
      setProductData(location.state.productData);
    } else {
      // If no data, redirect to dashboard
      navigate('/dashboard');
    }
  }, [location, navigate]);

  if (!productData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="border-green-100 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                <div className="relative bg-green-500 rounded-full p-6">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-3">
              Product Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Your product has been submitted for admin approval
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Product Details */}
            <div className="bg-gradient-to-r from-blue-50 to-brand-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">
                    {productData.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Vendor SKU</p>
                      <p className="font-mono font-semibold text-gray-900">{productData.vendor_sku}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Brand</p>
                      <p className="font-semibold text-gray-900">{productData.brand}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold text-gray-900">
                        {productData.category_level_1} → {productData.category_level_2}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Variants</p>
                      <p className="font-semibold text-gray-900">{productData.variants?.length || 0} variant(s)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xl">⏳</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pending Admin Approval</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Your product is currently awaiting review by our admin team. You'll be notified once your product has been approved and is ready to go live on the marketplace.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">What's Next?</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    1
                  </div>
                  <p className="text-sm text-gray-700">Our admin team will review your product submission</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    2
                  </div>
                  <p className="text-sm text-gray-700">You'll receive notification once your product is approved or if changes are needed</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    3
                  </div>
                  <p className="text-sm text-gray-700">Approved products will be visible in your product list and on the marketplace</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
              <Button
                onClick={() => navigate('/products/new-v3')}
                className="w-full bg-gradient-to-r from-black to-[#ff3cfe] hover:opacity-90 text-white py-6 text-base"
                data-testid="submit-another-btn"
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit Another Product
              </Button>
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50 py-6 text-base"
                data-testid="view-products-btn"
              >
                View My Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                data-testid="back-dashboard-btn"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
