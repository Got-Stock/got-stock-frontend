import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Download, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import DeliveryTracker from '../components/DeliveryTracker';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SellerOrderTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    tracking_number: '',
    carrier: '',
    location: '',
    estimated_delivery: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/seller/orders`, {
        withCredentials: true
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status || 'processing',
      tracking_number: order.tracking_details?.tracking_number || '',
      carrier: order.tracking_details?.carrier || '',
      location: order.tracking_details?.location || '',
      estimated_delivery: order.tracking_details?.estimated_delivery || ''
    });
    setShowUpdateDialog(true);
  };

  const submitUpdate = async () => {
    if (!selectedOrder) return;
    
    setUpdating(true);
    try {
      await axios.put(
        `${API}/seller/orders/${selectedOrder.id}/tracking`,
        {
          status: updateData.status,
          tracking_details: {
            tracking_number: updateData.tracking_number,
            carrier: updateData.carrier,
            location: updateData.location,
            estimated_delivery: updateData.estimated_delivery
          }
        },
        { withCredentials: true }
      );
      
      toast.success('Tracking information updated');
      setShowUpdateDialog(false);
      fetchSellerOrders();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update tracking');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF3CFE] via-brand-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF3CFE] via-brand-900 to-black py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-white hover:text-[#FF3CFE]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-white">Order Tracking</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                    <p className="text-sm text-white/70">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateTracking(order)}
                    className="border-[#FF3CFE]/30 text-white hover:bg-[#FF3CFE]/20"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                </div>

                <DeliveryTracker order={order} />
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="bg-black/90 border-[#FF3CFE]/30">
            <DialogHeader>
              <DialogTitle className="text-white">Update Tracking Information</DialogTitle>
              <DialogDescription className="text-white/70">
                Update the order status and tracking details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="status" className="text-white">Order Status</Label>
                <Select value={updateData.status} onValueChange={(val) => setUpdateData({...updateData, status: val})}>
                  <SelectTrigger className="bg-black/40 border-[#FF3CFE]/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tracking_number" className="text-white">Tracking Number</Label>
                <Input
                  id="tracking_number"
                  value={updateData.tracking_number}
                  onChange={(e) => setUpdateData({...updateData, tracking_number: e.target.value})}
                  className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <Label htmlFor="carrier" className="text-white">Carrier</Label>
                <Input
                  id="carrier"
                  value={updateData.carrier}
                  onChange={(e) => setUpdateData({...updateData, carrier: e.target.value})}
                  className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={submitUpdate}
                disabled={updating}
                className="bg-gradient-to-r from-[#FF3CFE] to-black hover:opacity-90"
              >
                {updating ? 'Updating...' : 'Update Tracking'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SellerOrderTracking;
