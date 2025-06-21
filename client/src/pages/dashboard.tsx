import { useQuery } from "@tanstack/react-query";
import { TrendingUp, DollarSign, Gavel, BarChart, Award } from "lucide-react";
import Header from "@/components/header";
import VoiceAssistant from "@/components/voice-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PaintingWithBidCount } from "@shared/schema";

interface DashboardData {
  totalBids: number;
  highestBid: number;
  activeAuctions: number;
  avgBidsPerItem: number;
  topPaintings: PaintingWithBidCount[];
}

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPath="/dashboard" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPath="/dashboard" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive font-medium">Failed to load dashboard</p>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Auction Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time insights into current auction performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Bids</p>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardData.totalBids}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Highest Bid</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(dashboardData.highestBid)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Auctions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardData.activeAuctions}
                  </p>
                </div>
                <Gavel className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. Bids/Item</p>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardData.avgBidsPerItem}
                  </p>
                </div>
                <BarChart className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Most Active Paintings */}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-foreground">
              <Award className="w-5 h-5 mr-2 text-primary" />
              Most Active Auctions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.topPaintings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No auction data available</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.topPaintings.map((painting, index) => (
                  <div key={painting.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-primary' : 
                          index === 1 ? 'bg-gray-400' : 
                          'bg-orange-400'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <img
                          src={painting.imageUrl || "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&w=60&h=60&fit=crop"}
                          alt={painting.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-foreground">{painting.title}</h3>
                          <p className="text-sm text-muted-foreground">{painting.artist}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{painting.bidCount || 0} bids</p>
                      <p className="text-sm text-primary">{formatCurrency(painting.currentBid)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <VoiceAssistant />
    </div>
  );
}
