import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import SellerLayout from '../components/SellerLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SellerRegistration = () => {
  const { user, checkAuth, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    trading_name: '',
    legal_entity_name: '',
    business_address: '',
    abn_or_tax_id: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    payout_banking_inst: '',
    payout_account_name: '',
    payout_account_number: '',
    payout_account_BSB: '',
    commission_rate: 10.0,
    data_submission_method: 'individual'
  });

  // Only redirect to login if explicitly not authenticated (not during loading)
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please log in first to complete seller registration');
      navigate('/seller-login');
    }
  }, [user, loading, navigate]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double-check authentication before submitting
    if (!user) {
      toast.error('Not authenticated. Please log in again.');
      navigate('/seller-login');
      return;
    }
    
    setFormLoading(true);

    try {
      // Let backend set status to 'onboarding' by default
      const payload = { ...formData };
      await axios.post(`${API}/seller/register`, payload, { withCredentials: true });
      toast.success('Seller profile created successfully! You can now submit for review.');
      await checkAuth();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create profile');
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <SellerLayout title="Seller Registration">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE]"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Seller Registration">
      <div className="mx-auto max-w-3xl">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Seller Registration</CardTitle>
            <CardDescription className="text-base text-gray-500">Complete your seller profile to start submitting products</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name" className="text-gray-700">Business Name *</Label>
                    <Input
                      id="business_name"
                      data-testid="business-name-input"
                      value={formData.business_name}
                      onChange={(e) => handleChange('business_name', e.target.value)}
                      required
                      className=""
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trading_name" className="text-gray-700">Trading Name *</Label>
                    <Input
                      id="trading_name"
                      data-testid="trading-name-input"
                      value={formData.trading_name}
                      onChange={(e) => handleChange('trading_name', e.target.value)}
                      required
                      className=""
                    />
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="legal_entity_name" className="text-gray-700">Legal Entity Name</Label>
                  <Input
                    id="legal_entity_name"
                    value={formData.legal_entity_name}
                    onChange={(e) => handleChange('legal_entity_name', e.target.value)}
                    placeholder="Registered legal entity name"
                    className=""
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_address" className="text-gray-700">Business Address</Label>
                  <Input
                    id="business_address"
                    value={formData.business_address}
                    onChange={(e) => handleChange('business_address', e.target.value)}
                    placeholder="Street, City, State, Postcode"
                    className=""
                  />
                </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="abn_or_tax_id" className="text-gray-700">ABN / Tax ID *</Label>
                  <Input
                    id="abn_or_tax_id"
                    data-testid="abn-input"
                    value={formData.abn_or_tax_id}
                    onChange={(e) => handleChange('abn_or_tax_id', e.target.value)}
                    required
                    className=""
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_name" className="text-gray-700">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    data-testid="contact-name-input" className=""
                    value={formData.contact_name}
                    onChange={(e) => handleChange('contact_name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="text-gray-700">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      data-testid="contact-email-input" className=""
                      value={formData.contact_email}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="text-gray-700">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      data-testid="contact-phone-input" className=""
                      value={formData.contact_phone}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Payout Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="payout_banking_inst" className="text-gray-700">Banking Institution *</Label>
                  <Input
                    id="payout_banking_inst"
                    data-testid="banking-inst-input" className=""
                    value={formData.payout_banking_inst}
                    onChange={(e) => handleChange('payout_banking_inst', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout_account_name" className="text-gray-700">Account Name *</Label>
                  <Input
                    id="payout_account_name"
                    data-testid="account-name-input" className=""
                    value={formData.payout_account_name}
                    onChange={(e) => handleChange('payout_account_name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payout_account_number" className="text-gray-700">Account Number *</Label>
                    <Input
                      id="payout_account_number"
                      data-testid="account-number-input" className=""
                      value={formData.payout_account_number}
                      onChange={(e) => handleChange('payout_account_number', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payout_account_BSB" className="text-gray-700">BSB *</Label>
                    <Input
                      id="payout_account_BSB"
                      data-testid="bsb-input" className=""
                      value={formData.payout_account_BSB}
                      onChange={(e) => handleChange('payout_account_BSB', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submission Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Preferences</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="data_submission_method" className="text-gray-700">Data Submission Method</Label>
                  <Select
                    value={formData.data_submission_method}
                    onValueChange={(value) => handleChange('data_submission_method', value)}
                  >
                    <SelectTrigger data-testid="submission-method-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value=".csv">CSV Upload</SelectItem>
                      <SelectItem value="API upload">API Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                data-testid="submit-registration-btn"
                disabled={formLoading || loading}
                className="w-full bg-[#FF3CFE] hover:bg-[#FF3CFE]/90 text-white py-6 text-lg rounded-lg transition-colors disabled:opacity-40"
              >
                {formLoading ? 'Creating Profile...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default SellerRegistration;
