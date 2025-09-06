import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Clock, CheckCircle, XCircle, User, Mail, Phone } from 'lucide-react';

interface PurchaseRequest {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
  };
  buyer: {
    _id: string;
    displayName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  seller: {
    _id: string;
    displayName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  message?: string;
  offeredPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  buyerContact: {
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const PurchaseRequests: React.FC = () => {
  const [receivedRequests, setReceivedRequests] = useState<PurchaseRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPurchaseRequests();
  }, []);

  const fetchPurchaseRequests = async () => {
    try {
      console.log('Fetching purchase requests...');
      setLoading(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      // Fetch received requests (as seller)
      const receivedResponse = await fetch(`${import.meta.env.VITE_API_URL}/purchase-requests/received`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch sent requests (as buyer)
      const sentResponse = await fetch(`${import.meta.env.VITE_API_URL}/purchase-requests/sent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (receivedResponse.ok) {
        const receivedData = await receivedResponse.json();
        console.log('Received requests:', receivedData);
        setReceivedRequests(receivedData);
      } else {
        console.error('Failed to fetch received requests:', await receivedResponse.text());
      }

      if (sentResponse.ok) {
        const sentData = await sentResponse.json();
        console.log('Sent requests:', sentData);
        setSentRequests(sentData);
      } else {
        console.error('Failed to fetch sent requests:', await sentResponse.text());
      }
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      console.log('Updating request status:', requestId, status);
      setUpdating(requestId);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/purchase-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        console.log('Request status updated successfully');
        // Refresh the requests
        await fetchPurchaseRequests();
      } else {
        const errorText = await response.text();
        console.error('Failed to update request status:', errorText);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>;
      case 'accepted':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="w-3 h-3" />
          Accepted
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1 bg-blue-500">
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const RequestCard: React.FC<{ request: PurchaseRequest; isReceived: boolean }> = ({ request, isReceived }) => {
    const otherUser = isReceived ? request.buyer : request.seller;
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{request.product.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isReceived ? 'Request from' : 'Request to'} {otherUser.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(request.createdAt)}
                </p>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Product Image */}
            {request.product.images && request.product.images.length > 0 && (
              <img
                src={request.product.images[0]}
                alt={request.product.title}
                className="w-20 h-20 object-cover rounded-md"
              />
            )}
            
            {/* Price Information */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Original Price</p>
                <p className="font-semibold">{formatPrice(request.product.price)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offered Price</p>
                <p className="font-semibold text-green-600">{formatPrice(request.offeredPrice)}</p>
              </div>
            </div>

            {/* Message */}
            {request.message && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Message</p>
                <p className="text-sm bg-muted p-2 rounded">{request.message}</p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{request.buyerContact.email}</span>
                </div>
                {request.buyerContact.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{request.buyerContact.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isReceived && request.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateRequestStatus(request._id, 'accepted')}
                  disabled={updating === request._id}
                  className="flex-1"
                >
                  {updating === request._id ? 'Updating...' : 'Accept'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateRequestStatus(request._id, 'rejected')}
                  disabled={updating === request._id}
                  className="flex-1"
                >
                  {updating === request._id ? 'Updating...' : 'Reject'}
                </Button>
              </div>
            )}

            {!isReceived && request.status === 'accepted' && (
              <Button
                onClick={() => updateRequestStatus(request._id, 'completed')}
                disabled={updating === request._id}
                className="w-full"
              >
                {updating === request._id ? 'Updating...' : 'Mark as Completed'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading purchase requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Purchase Requests</h2>
        <p className="text-muted-foreground">
          Manage purchase requests for your listings and track your own requests
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Received ({receivedRequests.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Sent ({sentRequests.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          {receivedRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Purchase Requests</h3>
                <p className="text-muted-foreground">
                  You haven't received any purchase requests yet. Start selling items to receive requests from buyers.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {receivedRequests.map((request) => (
                <RequestCard key={request._id} request={request} isReceived={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Sent Requests</h3>
                <p className="text-muted-foreground">
                  You haven't made any purchase requests yet. Browse the marketplace to find items you want to buy.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {sentRequests.map((request) => (
                <RequestCard key={request._id} request={request} isReceived={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
