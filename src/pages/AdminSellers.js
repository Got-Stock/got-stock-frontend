import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Clock, Building2, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSellers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('onboarding');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/sellers`, { withCredentials: true });
      setSellers(res.data || []);
    } catch (err) {
      console.error('Error loading sellers', err);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sellerId, status) => {
    setUpdating(true);
    try {
      await axios.put(
        `${API}/admin/sellers/${sellerId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Seller marked as ${status}`);
      await fetchSellers();
    } catch (err) {
      console.error('Error updating seller status', err);
      toast.error(err.response?.data?.detail || 'Failed to update seller status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredSellers = sellers.filter((s) =>
    filterStatus === 'all' ? true : (s.status || 'pending') === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      <header className="bg-black border-b border-cyan-600 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Seller Approvals</h1>
            <p className="text-sm text-gray-300">
              Review and approve new seller profiles created via the seller registration form.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')} className="border-cyan-600 text-cyan-300 hover:bg-cyan-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant={filterStatus === 'onboarding' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('onboarding')}
            >
              <Clock className="w-4 h-4 mr-2" /> Onboarding
            </Button>
            <Button
              variant={filterStatus === 'pending_review' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending_review')}
            >
              <Clock className="w-4 h-4 mr-2" /> Pending Review
            </Button>
            <Button
              variant={filterStatus === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('approved')}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Approved
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('rejected')}
            >
              <XCircle className="w-4 h-4 mr-2" /> Rejected
            </Button>
            <Button
              variant={filterStatus === 'suspended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('suspended')}
            >
              <XCircle className="w-4 h-4 mr-2" /> Suspended
            </Button>
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            {filteredSellers.length} sellers shown
          </p>
        </div>

        {filteredSellers.length === 0 ? (
          <div className="bg-white/80 rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">No sellers found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSellers.map((seller) => (
              <Card key={seller.seller_id} className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span>{seller.business_name}</span>
                  </CardTitle>
                  {seller.legal_entity_name && (
                    <CardDescription className="text-gray-600">
                      {seller.legal_entity_name}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-700">Business Details</p>
                    {seller.abn && (
                      <p className="text-gray-600">ABN: {seller.abn}</p>
                    )}
                    {seller.business_address && (
                      <p className="text-gray-600">
                        Address: {typeof seller.business_address === 'string' 
                          ? seller.business_address 
                          : `${seller.business_address.line1 || ''}, ${seller.business_address.city || ''}, ${seller.business_address.state || ''} ${seller.business_address.postcode || ''}, ${seller.business_address.country || ''}`
                        }
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-700">Contact</p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" /> {seller.business_email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" /> {seller.business_phone}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline">
                      Status: {seller.status || 'onboarding'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={updating || (seller.status === 'approved')}
                        onClick={() => handleStatusUpdate(seller.seller_id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updating || (seller.status === 'rejected')}
                        onClick={() => handleStatusUpdate(seller.seller_id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSellers;
