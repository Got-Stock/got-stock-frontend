import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Edit, 
  Tag, 
  Trash2, 
  Search,
  ArrowLeft,
  Save,
  X,
  DollarSign
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSaleDialog, setShowSaleDialog] = useState(false);
  const [saleProduct, setSaleProduct] = useState(null);
  const [salePrice, setSalePrice] = useState("");
  const [salePercentage, setSalePercentage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/products/all`, {
        withCredentials: true
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(p =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id?.includes(searchQuery)
    );
    setFilteredProducts(filtered);
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${API}/admin/products/${editingProduct.id}`,
        {
          name: editingProduct.name,
          description: editingProduct.description,
          brand: editingProduct.brand,
          status: editingProduct.status
        },
        { withCredentials: true }
      );
      
      toast.success("Product updated successfully");
      setShowEditDialog(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleAddSale = (product) => {
    setSaleProduct(product);
    setSalePrice("");
    setSalePercentage("");
    setShowSaleDialog(true);
  };

  const applySalePrice = async () => {
    try {
      const saleData = {
        sale_price: salePrice ? parseFloat(salePrice) : null,
        sale_percentage: salePercentage ? parseInt(salePercentage) : null
      };

      await axios.patch(
        `${API}/admin/products/${saleProduct.id}/sale`,
        saleData,
        { withCredentials: true }
      );

      toast.success("Sale pricing applied successfully");
      setShowSaleDialog(false);
      fetchProducts();
    } catch (error) {
      console.error("Error applying sale:", error);
      toast.error("Failed to apply sale pricing");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`${API}/admin/products/${productId}`, {
        withCredentials: true
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/admin/home")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Product Management</h1>
                <p className="text-sm text-gray-200">{filteredProducts.length} products</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.media?.images?.[0] || "https://via.placeholder.com/60"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.variants?.[0]?.price ? `$${product.variants[0].price.toFixed(2)}` : 'N/A'}
                    {product.sale_price && (
                      <div className="text-xs text-green-600 font-semibold">
                        Sale: ${product.sale_price.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={product.status === 'APPROVED' ? 'default' : product.status === 'PENDING' ? 'secondary' : 'destructive'}
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddSale(product)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Make changes to product information</DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Brand</Label>
                  <Input
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    rows="4"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value})}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Sale Dialog */}
        <Dialog open={showSaleDialog} onOpenChange={setShowSaleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sale Pricing</DialogTitle>
              <DialogDescription>
                Set a sale price or discount percentage for {saleProduct?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Sale Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 29.99"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
              <div className="text-center text-sm text-gray-500">— OR —</div>
              <div>
                <Label>Discount Percentage (%)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 25"
                  value={salePercentage}
                  onChange={(e) => setSalePercentage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={applySalePrice} className="bg-green-600 hover:bg-green-700">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Apply Sale
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
