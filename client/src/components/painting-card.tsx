import { Clock, User, Calendar, Brush, DollarSign } from "lucide-react";
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

  return (
    <Card 
      className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group overflow-hidden"
      onClick={() => onClick(painting)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={painting.imageUrl || "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&w=800&h=600&fit=crop"}
          alt={`${painting.title} by ${painting.artist}`}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className="absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-500 text-white">
          <Clock className="w-4 h-4 mr-1" />
          {timeRemaining}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {painting.title}
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-2 text-primary/70" />
            <span>{painting.artist}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary/70" />
            <span>{painting.year}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Brush className="w-4 h-4 mr-2 text-primary/70" />
            <span>{painting.type}</span>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
              <p className="text-2xl font-bold text-primary flex items-center">
                <DollarSign className="w-5 h-5 mr-1" />
                {formatCurrency(painting.currentBid)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Bids</p>
              <p className="text-lg font-semibold text-foreground">
                {painting.bidCount || 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
