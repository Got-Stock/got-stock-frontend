import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
      <div className="min-h-screen bg-gradient-to-br from-[#FF3CFE] via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE] mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF3CFE] via-purple-900 to-black py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-white hover:text-[#FF3CFE]"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-[#FF3CFE]/30 bg-black/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">Seller Registration</CardTitle>
            <CardDescription className="text-base text-white/70">Complete your seller profile to start submitting products</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-[#FF3CFE]/30 pb-2">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name" className="text-white">Business Name *</Label>
                    <Input
                      id="business_name"
                      data-testid="business-name-input"
                      value={formData.business_name}
                      onChange={(e) => handleChange('business_name', e.target.value)}
                      required
                      className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trading_name" className="text-white">Trading Name *</Label>
                    <Input
                      id="trading_name"
                      data-testid="trading-name-input"
                      value={formData.trading_name}
                      onChange={(e) => handleChange('trading_name', e.target.value)}
                      required
                      className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                    />
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="legal_entity_name" className="text-white">Legal Entity Name</Label>
                  <Input
                    id="legal_entity_name"
                    value={formData.legal_entity_name}
                    onChange={(e) => handleChange('legal_entity_name', e.target.value)}
                    placeholder="Registered legal entity name"
                    className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_address" className="text-white">Business Address</Label>
                  <Input
                    id="business_address"
                    value={formData.business_address}
                    onChange={(e) => handleChange('business_address', e.target.value)}
                    placeholder="Street, City, State, Postcode"
                    className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="abn_or_tax_id" className="text-white">ABN / Tax ID *</Label>
                  <Input
                    id="abn_or_tax_id"
                    data-testid="abn-input"
                    value={formData.abn_or_tax_id}
                    onChange={(e) => handleChange('abn_or_tax_id', e.target.value)}
                    required
                    className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-[#FF3CFE]/30 pb-2">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_name" className="text-white">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    data-testid="contact-name-input" className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                    value={formData.contact_name}
                    onChange={(e) => handleChange('contact_name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="text-white">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      data-testid="contact-email-input" className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                      value={formData.contact_email}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="text-white">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      data-testid="contact-phone-input" className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                      value={formData.contact_phone}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-[#FF3CFE]/30 pb-2">Payout Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="payout_banking_inst" className="text-white">Banking Institution *</Label>
                  <Input
                    id="payout_banking_inst"
                    data-testid="banking-inst-input" className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                    value={formData.payout_banking_inst}
                    onChange={(e) => handleChange('payout_banking_inst', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout_account_name" className="text-white">Account Name *</Label>
                  <Input
                    id="payout_account_name"
                    data-testid="account-name-input" className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                    value={formData.payout_account_name}
                    onChange={(e) => handleChange('payout_account_name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payout_account_number" className="text-white">Account Number *</Label>
                    <Input
                      id="payout_account_number"
                      data-testid="account-number-input" className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                      value={formData.payout_account_number}
                      onChange={(e) => handleChange('payout_account_number', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payout_account_BSB" className="text-white">BSB *</Label>
                    <Input
                      id="payout_account_BSB"
                      data-testid="bsb-input" className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                      value={formData.payout_account_BSB}
                      onChange={(e) => handleChange('payout_account_BSB', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submission Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-[#FF3CFE]/30 pb-2">Preferences</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="data_submission_method" className="text-white">Data Submission Method</Label>
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
                className="w-full bg-gradient-to-r from-[#FF3CFE] to-black hover:opacity-90 text-white py-6 text-lg rounded-lg transition-opacity disabled:opacity-40"
              >
                {formLoading ? 'Creating Profile...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerRegistration;
