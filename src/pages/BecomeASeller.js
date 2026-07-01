import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { ArrowLeft, Send, Building, User, CreditCard, Package, Truck, Headphones } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BecomeASeller() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    email: '',
    website: '',
    abn: '',
    
    // Representative Information
    applicantName: '',
    applicantPosition: '',
    contactNumber: '',
    applicantEmail: '',
    
    // Bank Details
    bankName: '',
    accountName: '',
    accountNumber: '',
    bsb: '',
    
    // Eligibility Verification
    proofOfOwnership: '',
    yearsInOperation: '',
    primaryCategories: '',
    primaryBrands: '',
    productsAuthentic: '',
    
    // Inventory & Fulfillment
    avgStockLevels: '',
    stockUpdateCommitment: '',
    shippingMethod: '',
    trackingAvailable: '',
    dispatchTimeframe: '',
    
    // Returns & Customer Service
    customerServiceContact: '',
    returnPolicy: '',
    
    // Agreement
    termsAgreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = [
      'businessName', 'address', 'city', 'state', 'postcode', 'phone', 'email', 'abn',
      'applicantName', 'applicantPosition', 'contactNumber', 'applicantEmail',
      'bankName', 'accountName', 'accountNumber', 'bsb',
      'proofOfOwnership', 'yearsInOperation', 'primaryCategories', 'primaryBrands', 'productsAuthentic',
      'avgStockLevels', 'shippingMethod', 'trackingAvailable', 'dispatchTimeframe',
      'customerServiceContact', 'returnPolicy'
    ];

    for (let field of required) {
      if (!formData[field] || formData[field] === '') {
        toast.error(`Please fill in: ${field.replace(/([A-Z])/g, ' $1').trim()}`);
        return false;
      }
    }

    if (!formData.termsAgreed) {
      toast.error('Please confirm that your details are true and correct');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email) || !emailRegex.test(formData.applicantEmail)) {
      toast.error('Please enter valid email addresses');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API}/seller-application/submit`, formData);
      
      toast.success('Application submitted successfully! We will review and contact you soon.');
      
      // Reset form
      setFormData({
        businessName: '', address: '', city: '', state: '', postcode: '', phone: '', email: '', website: '', abn: '',
        applicantName: '', applicantPosition: '', contactNumber: '', applicantEmail: '',
        bankName: '', accountName: '', accountNumber: '', bsb: '',
        proofOfOwnership: '', yearsInOperation: '', primaryCategories: '', primaryBrands: '', productsAuthentic: '',
        avgStockLevels: '', stockUpdateCommitment: '', shippingMethod: '', trackingAvailable: '', dispatchTimeframe: '',
        customerServiceContact: '', returnPolicy: '',
        termsAgreed: false
      });
      
      // Redirect to homepage after 2 seconds
      setTimeout(() => navigate('/'), 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Seller</h1>
          <p className="text-lg text-gray-600">
            Join Got-Stock marketplace and reach thousands of customers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Tell us about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="abn">ABN *</Label>
                  <Input
                    id="abn"
                    name="abn"
                    value={formData.abn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode *</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Representative Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Representative Information
              </CardTitle>
              <CardDescription>Primary contact person details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Applicant Name *</Label>
                  <Input
                    id="applicantName"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applicantPosition">Position *</Label>
                  <Input
                    id="applicantPosition"
                    name="applicantPosition"
                    value={formData.applicantPosition}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applicantEmail">Email *</Label>
                  <Input
                    id="applicantEmail"
                    name="applicantEmail"
                    type="email"
                    value={formData.applicantEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Bank Details
              </CardTitle>
              <CardDescription>For payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bsb">BSB *</Label>
                  <Input
                    id="bsb"
                    name="bsb"
                    value={formData.bsb}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Eligibility Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Proof of Brand Ownership / Distribution Rights Attached? *</Label>
                <RadioGroup
                  value={formData.proofOfOwnership}
                  onValueChange={(value) => handleRadioChange('proofOfOwnership', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="proof-yes" />
                    <Label htmlFor="proof-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="proof-no" />
                    <Label htmlFor="proof-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="yearsInOperation">Years in Operation *</Label>
                <Input
                  id="yearsInOperation"
                  name="yearsInOperation"
                  type="number"
                  value={formData.yearsInOperation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="primaryCategories">Primary Product Categories *</Label>
                <Textarea
                  id="primaryCategories"
                  name="primaryCategories"
                  value={formData.primaryCategories}
                  onChange={handleChange}
                  placeholder="e.g., Fashion, Electronics, Home & Living"
                  required
                />
              </div>

              <div>
                <Label htmlFor="primaryBrands">Primary Brands *</Label>
                <Textarea
                  id="primaryBrands"
                  name="primaryBrands"
                  value={formData.primaryBrands}
                  onChange={handleChange}
                  placeholder="List your main brands"
                  required
                />
              </div>

              <div>
                <Label>Confirm Products are Authentic, Genuine & New *</Label>
                <RadioGroup
                  value={formData.productsAuthentic}
                  onValueChange={(value) => handleRadioChange('productsAuthentic', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="authentic-yes" />
                    <Label htmlFor="authentic-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="authentic-no" />
                    <Label htmlFor="authentic-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Fulfillment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Inventory & Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="avgStockLevels">Average Stock Levels Maintained *</Label>
                <Input
                  id="avgStockLevels"
                  name="avgStockLevels"
                  value={formData.avgStockLevels}
                  onChange={handleChange}
                  placeholder="e.g., 100-500 units"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stockUpdateCommitment">Commitment to Update/Remove Out of Stock Products (Optional)</Label>
                <Textarea
                  id="stockUpdateCommitment"
                  name="stockUpdateCommitment"
                  value={formData.stockUpdateCommitment}
                  onChange={handleChange}
                  placeholder="Describe your commitment"
                />
              </div>

              <div>
                <Label htmlFor="shippingMethod">Shipping Method Used *</Label>
                <Input
                  id="shippingMethod"
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleChange}
                  placeholder="e.g., Australia Post, Courier"
                  required
                />
              </div>

              <div>
                <Label>Tracking Available? *</Label>
                <RadioGroup
                  value={formData.trackingAvailable}
                  onValueChange={(value) => handleRadioChange('trackingAvailable', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="tracking-yes" />
                    <Label htmlFor="tracking-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tracking-no" />
                    <Label htmlFor="tracking-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="dispatchTimeframe">Typical Dispatch Timeframe *</Label>
                <Input
                  id="dispatchTimeframe"
                  name="dispatchTimeframe"
                  value={formData.dispatchTimeframe}
                  onChange={handleChange}
                  placeholder="e.g., 1-2 business days"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Returns & Customer Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Returns & Customer Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerServiceContact">Customer Service Contact Details *</Label>
                <Input
                  id="customerServiceContact"
                  name="customerServiceContact"
                  value={formData.customerServiceContact}
                  onChange={handleChange}
                  placeholder="Phone and/or email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="returnPolicy">Return & Refunds Policy *</Label>
                <Textarea
                  id="returnPolicy"
                  name="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={handleChange}
                  placeholder="Describe your return and refund policy"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms Agreement */}
          <Card className="border-brand-200 bg-brand-50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Submitting this application is the first step in joining Got-Stock marketplace, but it does not guarantee approval.</p>
                  <p>• Our team reviews every application to ensure all sellers meet our quality and compliance standards.</p>
                  <p>• We may request additional information before making a decision.</p>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="termsAgreed"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <Label htmlFor="termsAgreed" className="font-semibold">
                    I confirm that all details provided are true and correct *
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
