import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, User, Calendar, Brush, Clock, History, Crown, Award, Zap, Eye, Heart, Share, BookOpen } from "lucide-react";
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
        setBidHistory(prev => [{...lastMessage.bid! , paintingId : paintingId}, ...prev]);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-gold-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Header />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          onClick={handleBack}
          variant="ghost"
          className="flex items-center glass-effect hover:bg-white/20 text-foreground mb-8 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          <span className="font-medium">Back to Gallery</span>
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Painting Details - Larger Section */}
          <div className="xl:col-span-2 space-y-8">
            <Card className="glass-effect premium-shadow elegant-border overflow-hidden">
              <div className="relative">
                <img 
                  src={painting.imageUrl || "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&w=800&h=600&fit=crop"}
                  alt={`${painting.title} by ${painting.artist}`}
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <Badge 
                    className={`${connected ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-red-500 hover:bg-red-500'} text-white border-0 px-4 py-2 text-sm font-semibold`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-white animate-pulse' : 'bg-white/70'}`}></div>
                    {connected ? 'LIVE AUCTION' : 'CONNECTION LOST'}
                  </Badge>
                </div>

                {/* Time remaining badge */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-black/70 text-white border-0 px-4 py-2 text-sm font-semibold">
                    <Clock className="w-4 h-4 mr-2" />
                    {timeRemaining}
                  </Badge>
                </div>

                {/* Action buttons overlay */}
                {/* <div className="absolute bottom-6 left-6 flex space-x-3">
                  <Button size="sm" className="glass-effect hover:bg-white/20 text-white border-white/20">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" className="glass-effect hover:bg-white/20 text-white border-white/20">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div> */}
              </div>
              
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Crown className="w-6 h-6 text-luxury-gold" />
                      <Badge className="bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20 font-semibold">
                        AUTHENTICATED MASTERPIECE
                      </Badge>
                    </div>
                    <h1 className="font-serif text-4xl font-bold hero-text mb-3 leading-tight">
                      {painting.title}
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium">
                      by {painting.artist}
                    </p>
                  </div>
                </div>

                {/* Artist and artwork details grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 glass-effect rounded-xl">
                    <User className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Artist</p>
                    <p className="font-semibold text-foreground">{painting.artist}</p>
                  </div>
                  
                  <div className="text-center p-4 glass-effect rounded-xl">
                    <Calendar className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Year</p>
                    <p className="font-semibold text-foreground">{painting.year}</p>
                  </div>
                  
                  <div className="text-center p-4 glass-effect rounded-xl">
                    <Brush className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Medium</p>
                    <p className="font-semibold text-foreground">{painting.type}</p>
                  </div>
                  
                  <div className="text-center p-4 glass-effect rounded-xl">
                    <Award className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bids</p>
                    <p className="font-semibold text-foreground">{bidHistory.length}</p>
                  </div>
                </div>

                {painting.description && (
                  <div className="mb-8">
                    <h3 className="flex items-center font-serif text-xl font-semibold text-foreground mb-4">
                      <BookOpen className="w-5 h-5 mr-2 text-luxury-gold" />
                      Artwork Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{painting.description}</p>
                  </div>
                )}

                {/* Current Bid Display - Enhanced */}
                <Card className="luxury-gradient text-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm mb-2 font-medium uppercase tracking-wide">Current Highest Bid</p>
                        <p className="text-4xl font-bold text-white">
                          {formatCurrency(currentBid)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-5 h-5 text-white" />
                          <span className="text-white/90 text-sm font-medium uppercase tracking-wide">Activity</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {bidHistory.length} bids
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Bid History Section */}
            <Card className="glass-effect premium-shadow elegant-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl font-serif font-bold text-foreground">
                  <History className="w-6 h-6 mr-3 text-luxury-gold" />
                  Bidding History
                </CardTitle>
                <p className="text-muted-foreground">Real-time auction activity</p>
              </CardHeader>
              <CardContent>
                {bidHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">No bids placed yet</p>
                    <p className="text-sm text-muted-foreground">Be the first to place a bid on this masterpiece</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bidHistory.map((bid, index) => (
                      <div key={bid.id} className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-primary/10 to-gold-primary/10 border border-primary/20' 
                          : 'glass-effect hover:bg-white/5'
                      }`}>
                        <div className="flex items-center space-x-4">
                          {index === 0 && <Crown className="w-5 h-5 text-luxury-gold" />}
                          <div>
                            <p className="font-semibold text-foreground">{bid.bidderName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimestamp(bid.timestamp)}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-luxury-gold text-xl">
                          {formatCurrency(bid.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bidding Section - Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <BidForm 
                painting={{...painting, currentBid}} 
                onBidSuccess={handleBidSuccess}
              />
            </div>
          </div>
        </div>
      </div>
      
      <VoiceAssistant />
    </div>
  );
}
