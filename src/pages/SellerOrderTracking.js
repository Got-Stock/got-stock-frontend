import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import DeliveryTracker from '../components/DeliveryTracker';
import SellerLayout from '../components/SellerLayout';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SellerOrderTracking = () => {
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
      <SellerLayout title="Orders">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE]"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Orders">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
        <p className="text-gray-500">Manage fulfilment and keep buyers updated.</p>
      </div>

      {orders.length === 0 ? (
        <Card className="border-gray-200 bg-white">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No orders yet</h3>
            <p className="text-gray-500">Orders from your customers will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateTracking(order)}
                    className="border-[#FF3CFE] text-[#FF3CFE] hover:bg-[#FF3CFE]/10"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                </div>

                <DeliveryTracker order={order} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Tracking Information</DialogTitle>
            <DialogDescription>
              Update the order status and tracking details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select value={updateData.status} onValueChange={(val) => setUpdateData({ ...updateData, status: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tracking_number">Tracking Number</Label>
              <Input
                id="tracking_number"
                value={updateData.tracking_number}
                onChange={(e) => setUpdateData({ ...updateData, tracking_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={updateData.carrier}
                onChange={(e) => setUpdateData({ ...updateData, carrier: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={submitUpdate}
              disabled={updating}
              className="bg-[#FF3CFE] text-white hover:bg-[#FF3CFE]/90"
            >
              {updating ? 'Updating...' : 'Update Tracking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SellerLayout>
  );
};

export default SellerOrderTracking;
