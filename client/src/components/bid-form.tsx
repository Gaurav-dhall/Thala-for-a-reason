import { useState } from "react";
import { Gavel, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { Painting } from "@shared/schema";

interface BidFormProps {
  painting: Painting;
  onBidSuccess: () => void;
}

export default function BidForm({ painting, onBidSuccess }: BidFormProps) {
  const [formData, setFormData] = useState({ bidderName: '', amount: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const currentBid = parseFloat(painting.currentBid);
  const minimumBid = currentBid + 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.bidderName.trim()) {
      newErrors.bidderName = 'Name is required';
    }

    const bidAmount = parseFloat(formData.amount);
    if (!bidAmount || bidAmount <= currentBid) {
      newErrors.amount = `Bid must be higher than current bid of ${formatCurrency(currentBid)}`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      try {
        await apiRequest('POST', `/api/auctions/${painting.id}/bid`, {
          bidderName: formData.bidderName,
          amount: bidAmount.toString()
        });

        toast({
          title: "Bid Placed Successfully!",
          description: `Your bid of ${formatCurrency(bidAmount)} has been placed.`,
        });

        setFormData({ bidderName: '', amount: '' });
        onBidSuccess();
      } catch (error) {
        toast({
          title: "Error Placing Bid",
          description: error instanceof Error ? error.message : "Failed to place bid",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-foreground">
          <Gavel className="w-5 h-5 mr-2 text-primary" />
          Place Your Bid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bidderName" className="text-sm font-medium text-foreground">
              Your Name
            </Label>
            <Input
              id="bidderName"
              type="text"
              value={formData.bidderName}
              onChange={(e) => setFormData({...formData, bidderName: e.target.value})}
              className={`mt-2 ${errors.bidderName ? 'border-destructive' : ''}`}
              placeholder="Enter your name"
            />
            {errors.bidderName && (
              <p className="text-destructive text-sm mt-1">{errors.bidderName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-foreground">
              Bid Amount (USD)
            </Label>
            <div className="relative mt-2">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className={`pl-10 ${errors.amount ? 'border-destructive' : ''}`}
                placeholder={`Minimum: ${formatCurrency(minimumBid)}`}
                min={minimumBid}
                step="1000"
              />
            </div>
            {errors.amount && (
              <p className="text-destructive text-sm mt-1">{errors.amount}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Current highest bid: <span className="font-semibold text-primary">{formatCurrency(currentBid)}</span>
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Placing Bid...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Place Bid
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
