import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, CheckCircle, XCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCategoryManager = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dropdownOptions, setDropdownOptions] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(cat =>
        cat.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, dropdownsRes] = await Promise.all([
        axios.get(`${API}/category/all-with-attributes`, { withCredentials: true }),
        axios.get(`${API}/dropdown-options`, { withCredentials: true })
      ]);
      
      setCategories(categoriesRes.data.categories || []);
      setFilteredCategories(categoriesRes.data.categories || []);
      setDropdownOptions(dropdownsRes.data.dropdown_options || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img 
                  src="https://customer-assets.emergentagent.com/job_product-gateway/artifacts/tabee7q7_GSwhiteonblack.png" 
                  alt="GOT-STOCK"
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm font-medium text-gray-700">Category Attribute Manager</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Category Attribute System</h1>
          <p className="text-gray-200">Manage category-specific product attributes and validations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Total Categories</CardDescription>
              <CardTitle className="text-3xl">{categories.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">With attribute definitions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Dropdown Options</CardDescription>
              <CardTitle className="text-3xl">{Object.keys(dropdownOptions).length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Predefined value sets</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Total Options</CardDescription>
              <CardTitle className="text-3xl">
                {Object.values(dropdownOptions).reduce((sum, arr) => sum + arr.length, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Across all dropdowns</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Category Attributes</CardTitle>
            <CardDescription>
              Categories with defined attribute requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCategories.map((category, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{category.path}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {category.required_count} required
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings className="w-4 h-4 text-blue-600" />
                          {category.total_attributes} total attributes
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate(`/admin/category-attributes/${encodeURIComponent(category.path)}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <p>No categories found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dropdown Options Summary */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Dropdown Options Summary</CardTitle>
            <CardDescription>
              Available predefined values for product attributes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(dropdownOptions).map(([key, values]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <p className="text-xs text-gray-600">{values.length} options</p>
                  <div className="mt-2 max-h-20 overflow-y-auto text-xs text-gray-500">
                    {values.slice(0, 5).join(', ')}
                    {values.length > 5 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminCategoryManager;
