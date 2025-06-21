import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, User, Calendar, Brush, Clock, History } from "lucide-react";
import Header from "@/components/header";
import BidForm from "@/components/bid-form";
import VoiceAssistant from "@/components/voice-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/hooks/use-socket";
import { formatCurrency, formatTimeRemaining, formatTimestamp } from "@/lib/utils";
import type { Painting, Bid } from "@shared/schema";

interface PaintingWithBids extends Painting {
  bids: Bid[];
}

export default function AuctionDetailPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { connected, lastMessage, joinRoom } = useSocket();
  const [currentBid, setCurrentBid] = useState<string>("");
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);

  const paintingId = params.id ? parseInt(params.id) : 0;

  const { data: painting, isLoading, error } = useQuery<PaintingWithBids>({
    queryKey: [`/api/auctions/${paintingId}`],
    enabled: !!paintingId,
  });

  // Initialize current bid and bid history when painting data loads
  useEffect(() => {
    if (painting) {
      setCurrentBid(painting.currentBid);
      setBidHistory(painting.bids || []);
      
      // Join WebSocket room for this painting
      if (connected) {
        joinRoom(paintingId);
      }
    }
  }, [painting, connected, paintingId, joinRoom]);

  // Handle real-time bid updates
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'bidUpdate' && lastMessage.paintingId === paintingId) {
      if (lastMessage.currentBid) {
        setCurrentBid(lastMessage.currentBid);
      }
      if (lastMessage.bid) {
        setBidHistory(prev => [lastMessage.bid!, ...prev]);
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/auctions/${paintingId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/auctions'] });
    }
  }, [lastMessage, paintingId, queryClient]);

  const handleBack = () => {
    setLocation('/');
  };

  const handleBidSuccess = () => {
    // Refresh painting data after successful bid
    queryClient.invalidateQueries({ queryKey: [`/api/auctions/${paintingId}`] });
    queryClient.invalidateQueries({ queryKey: ['/api/auctions'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Loading auction details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive font-medium">Failed to load auction details</p>
            <p className="text-muted-foreground">The painting may not exist or there was an error</p>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Auctions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const timeRemaining = formatTimeRemaining(painting.auctionEndTime);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          onClick={handleBack}
          variant="ghost"
          className="flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Auctions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Painting Details */}
          <div>
            <Card className="bg-card shadow-lg overflow-hidden mb-6">
              <img 
                src={painting.imageUrl || "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&w=800&h=600&fit=crop"}
                alt={`${painting.title} by ${painting.artist}`}
                className="w-full h-96 object-cover"
              />
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="font-serif text-3xl font-bold text-foreground">
                    {painting.title}
                  </h1>
                  <Badge 
                    variant={connected ? "default" : "destructive"}
                    className="flex items-center"
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {connected ? 'Live' : 'Offline'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <User className="w-5 h-5 mr-3 text-primary/70" />
                    <div>
                      <p className="text-sm text-muted-foreground">Artist</p>
                      <p className="font-medium text-foreground">{painting.artist}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-5 h-5 mr-3 text-primary/70" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium text-foreground">{painting.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Brush className="w-5 h-5 mr-3 text-primary/70" />
                    <div>
                      <p className="text-sm text-muted-foreground">Medium</p>
                      <p className="font-medium text-foreground">{painting.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-5 h-5 mr-3 text-primary/70" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time Left</p>
                      <p className="font-medium text-amber-600">{timeRemaining}</p>
                    </div>
                  </div>
                </div>

                {painting.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2">Description</h3>
                    <p className="text-muted-foreground">{painting.description}</p>
                  </div>
                )}

                {/* Current Bid Display */}
                <Card className="bg-secondary/50">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Current Highest Bid</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(currentBid)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {bidHistory.length} bids placed
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Bidding Section */}
          <div className="space-y-6">
            {/* Bid Form */}
            <BidForm 
              painting={{...painting, currentBid}} 
              onBidSuccess={handleBidSuccess}
            />

            {/* Bid History */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-foreground">
                  <History className="w-5 h-5 mr-2 text-primary" />
                  Bid History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bidHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No bids placed yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bidHistory.map((bid) => (
                      <div key={bid.id} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{bid.bidderName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTimestamp(bid.timestamp)}
                          </p>
                        </div>
                        <p className="font-bold text-primary text-lg">
                          {formatCurrency(bid.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <VoiceAssistant />
    </div>
  );
}
