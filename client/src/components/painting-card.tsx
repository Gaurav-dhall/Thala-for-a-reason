import { Clock, User, Calendar, Brush, DollarSign, Zap, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils";
import type { PaintingWithBidCount } from "@shared/schema";

interface PaintingCardProps {
  painting: PaintingWithBidCount;
  onClick: (painting: PaintingWithBidCount) => void;
}

export default function PaintingCard({ painting, onClick }: PaintingCardProps) {
  const timeRemaining = painting.auctionEndTime 
    ? formatTimeRemaining(painting.auctionEndTime)
    : painting.timeRemaining || "Unknown";

  const isEndingSoon = timeRemaining.includes('m') && !timeRemaining.includes('h');

  return (
    <Card 
      className="glass-effect premium-shadow card-hover cursor-pointer group overflow-hidden elegant-border relative"
      onClick={() => onClick(painting)}
    >
      {/* Premium badge overlay */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-black/70 text-white border-0 font-medium tracking-wide">
          AUTHENTICATED
        </Badge>
      </div>

      {/* Time remaining badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`border-0 font-semibold ${
          isEndingSoon 
            ? 'bg-red-500 hover:bg-red-500 text-white animate-pulse' 
            : 'bg-emerald-500 hover:bg-emerald-500 text-white'
        }`}>
          <Clock className="w-4 h-4 mr-1" />
          {timeRemaining}
        </Badge>
      </div>

      {/* Image with overlay effects */}
      <div className="relative overflow-hidden">
        <img 
          src={painting.imageUrl || "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&w=800&h=600&fit=crop"}
          alt={`${painting.title} by ${painting.artist}`}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Hover action button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-800">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </div>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
      </div>
      
      <CardContent className="p-6 relative">
        {/* Title with luxury styling */}
        <h3 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
          {painting.title}
        </h3>
        
        {/* Artist and details grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-luxury-gold flex-shrink-0" />
            <span className="font-medium text-gray-700 truncate">{painting.artist}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-luxury-gold flex-shrink-0" />
            <span className="font-medium text-gray-700">{painting.year}</span>
          </div>
          
          <div className="flex items-center text-sm col-span-2">
            <Brush className="w-4 h-4 mr-2 text-luxury-gold flex-shrink-0" />
            <span className="font-medium text-gray-700">{painting.type}</span>
          </div>
        </div>
        
        {/* Bid information with luxury styling */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-gold-primary/5 rounded-xl"></div>
          <div className="relative p-4 rounded-xl border border-gold-primary/20">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">Current Bid</p>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-1 text-luxury-gold" />
                  <p className="text-2xl font-bold text-luxury-gold">
                    {formatCurrency(painting.currentBid)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">Activity</p>
                <div className="flex items-center justify-end space-x-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <p className="text-lg font-bold text-foreground">
                    {painting.bidCount || 0}
                  </p>
                  <span className="text-sm text-muted-foreground">bids</span>
                </div>
              </div>
            </div>
            
            {/* Bid activity indicator */}
            {(painting.bidCount || 0) > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-gold-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((painting.bidCount || 0) * 20, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-primary font-semibold">
                  {(painting.bidCount || 0) > 5 ? 'HOT' : 'ACTIVE'}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
