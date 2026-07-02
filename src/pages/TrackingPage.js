import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Package, MapPin, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import SellerLayout from '../components/SellerLayout';

const API = process.env.REACT_APP_BACKEND_URL;

const TrackingPage = () => {
  const location = useLocation();
  // Same component serves /admin/tracking, /customer-account/tracking and the
  // seller portal at /dashboard/tracking — only the seller route gets the shell.
  const inSellerPortal = location.pathname.startsWith('/dashboard');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrierCode, setCarrierCode] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const url = `${API}/api/tracking/${trackingNumber}${
        carrierCode ? `?carrier_code=${carrierCode}` : ''
      }`;
      
      const response = await axios.get(url, { withCredentials: true });
      setTrackingData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch tracking information');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_transit':
      case 'in transit':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'pending':
      case 'not_found':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'exception':
      case 'undelivered':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exception':
      case 'undelivered':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const inner = (
    <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Shipment</h1>
          <p className="text-gray-600">
            Enter your tracking number to view real-time updates from any carrier worldwide
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="md:col-span-2"
              />
              <Input
                type="text"
                placeholder="Carrier code (optional)"
                value={carrierCode}
                onChange={(e) => setCarrierCode(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !trackingNumber.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Package
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Mock Mode Warning */}
        {trackingData?.is_mock && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">Demo Mode</h3>
                <p className="text-yellow-800 text-sm mt-1">
                  This is mock tracking data. To enable real tracking, add your 17TRACK API key to the backend .env file.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-red-50 border-red-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-800 text-sm mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {trackingData.tracking_number}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {trackingData.carrier_name || 'Unknown Carrier'}
                  </p>
                </div>
                <Badge className={getStatusColor(trackingData.current_status)}>
                  {trackingData.current_status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trackingData.origin_country && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Origin
                    </p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {trackingData.origin_country}
                    </p>
                  </div>
                )}
                {trackingData.destination_country && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Destination
                    </p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {trackingData.destination_country}
                    </p>
                  </div>
                )}
                {trackingData.delivery_estimate && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Est. Delivery
                    </p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {trackingData.delivery_estimate}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Last Update
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(trackingData.last_update)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Tracking Timeline */}
            <Card className="shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h3>
              
              {trackingData.events && trackingData.events.length > 0 ? (
                <div className="space-y-4">
                  {trackingData.events.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                          {getStatusIcon(event.status)}
                        </div>
                        {index !== trackingData.events.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {event.status}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatDate(event.timestamp)}
                            </span>
                          </div>
                          {event.location && (
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </p>
                          )}
                          <p className="text-sm text-gray-700">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No tracking events yet. Check back soon for updates.</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {!trackingData && !error && !loading && (
          <Card className="text-center py-16 shadow-lg">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg">
              Enter a tracking number above to get started
            </p>
          </Card>
        )}
    </>
  );

  if (inSellerPortal) {
    return <SellerLayout title="Track Shipment">{inner}</SellerLayout>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">{inner}</div>
    </div>
  );
};

export default TrackingPage;
