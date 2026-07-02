import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '../components/AdminLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [featureToggles, setFeatureToggles] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchFeatureToggles();
  }, [user, navigate]);

  const fetchFeatureToggles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/analytics/feature-toggles`, { withCredentials: true });
      setFeatureToggles(response.data.toggles || []);
    } catch (error) {
      console.error('Error fetching feature toggles:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = async (featureName, enabled) => {
    try {
      await axios.put(
        `${API}/admin/analytics/feature-toggles/${featureName}?enabled=${enabled}`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      setFeatureToggles(prev => 
        prev.map(toggle => 
          toggle.feature_name === featureName 
            ? { ...toggle, enabled } 
            : toggle
        )
      );
      
      toast.success(`${featureName.replace('_', ' ')} ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating feature toggle:', error);
      toast.error('Failed to update setting');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF3CFE]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-7 h-7 text-[#FF3CFE]" />
              Admin Settings
            </h2>
            <p className="text-gray-500 mt-1">
              Manage system-wide feature toggles and configurations
            </p>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Analytics Feature Toggles</CardTitle>
              <CardDescription>
                Enable or disable analytics features for all sellers. When disabled, sellers won't see these widgets even if they have them enabled in their preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {featureToggles.map((toggle) => (
                  <div key={toggle.feature_name} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor={toggle.feature_name} className="text-base font-semibold capitalize">
                        {toggle.feature_name.replace(/_/g, ' ')}
                      </Label>
                      {toggle.description && (
                        <p className="text-sm text-gray-600 mt-1">{toggle.description}</p>
                      )}
                    </div>
                    <Switch
                      id={toggle.feature_name}
                      checked={toggle.enabled}
                      onCheckedChange={(checked) => handleToggleChange(toggle.feature_name, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Disabled features will be hidden from all sellers immediately. 
                  This is useful for gradually rolling out new analytics features or temporarily disabling 
                  features during maintenance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-white border-gray-200">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system configuration and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Total Features</p>
                  <p className="text-2xl font-bold text-gray-900">{featureToggles.length}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Enabled Features</p>
                  <p className="text-2xl font-bold text-green-600">
                    {featureToggles.filter(t => t.enabled).length}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Disabled Features</p>
                  <p className="text-2xl font-bold text-red-600">
                    {featureToggles.filter(t => !t.enabled).length}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
