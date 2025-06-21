import { paintings, bids, type Painting, type InsertPainting, type Bid, type InsertBid, type PaintingWithBidCount } from "@shared/schema";

export interface IStorage {
  getAllPaintings(): Promise<PaintingWithBidCount[]>;
  getPaintingById(id: number): Promise<Painting | undefined>;
  createPainting(painting: InsertPainting): Promise<Painting>;
  updatePaintingBid(id: number, newBid: number): Promise<void>;
  getBidsForPainting(paintingId: number): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  getAllBids(): Promise<Bid[]>;
}

export class MemStorage implements IStorage {
  private paintings: Map<number, Painting>;
  private bids: Map<number, Bid>;
  private currentPaintingId: number;
  private currentBidId: number;

  constructor() {
    this.paintings = new Map();
    this.bids = new Map();
    this.currentPaintingId = 1;
    this.currentBidId = 1;
    
    // Initialize with sample paintings
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const samplePaintings: Omit<Painting, 'id' | 'createdAt'>[] = [
      {
        title: "Sunset Over Venice",
        artist: "Giovanni Canaletto",
        year: 1756,
        type: "Oil on Canvas",
        description: "A magnificent view of the Grand Canal at sunset",
        imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&w=800&h=600&fit=crop",
        startingBid: "100000",
        currentBid: "125000",
        auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000), // 2h 15m from now
      },
      {
        title: "Morning Garden",
        artist: "Claude Monet",
        year: 1873,
        type: "Oil on Canvas",
        description: "Impressionist masterpiece featuring garden flowers",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=800&h=600&fit=crop",
        startingBid: "500000",
        currentBid: "875000",
        auctionEndTime: new Date(Date.now() + 1 * 60 * 60 * 1000 + 42 * 60 * 1000), // 1h 42m from now
      },
      {
        title: "Portrait of Lady Catherine",
        artist: "Thomas Gainsborough",
        year: 1785,
        type: "Oil on Canvas",
        description: "Elegant portrait of aristocratic lady",
        imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&w=800&h=600&fit=crop",
        startingBid: "300000",
        currentBid: "450000",
        auctionEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000 + 28 * 60 * 1000), // 3h 28m from now
      },
      {
        title: "Still Life with Fruit",
        artist: "Paul Cézanne",
        year: 1879,
        type: "Oil on Canvas",
        description: "Classic still life composition",
        imageUrl: "https://images.unsplash.com/photo-1578662015616-7ed633a97b50?ixlib=rb-4.0.3&w=800&h=600&fit=crop",
        startingBid: "200000",
        currentBid: "320000",
        auctionEndTime: new Date(Date.now() + 45 * 60 * 1000), // 45m from now
      },
      {
        title: "Windmill Landscape",
        artist: "Jacob van Ruisdael",
        year: 1665,
        type: "Oil on Panel",
        description: "Dutch Golden Age landscape painting",
        imageUrl: "https://images.unsplash.com/photo-1578662996486-8a7b4cbe72ae?ixlib=rb-4.0.3&w=800&h=600&fit=crop",
        startingBid: "150000",
        currentBid: "210000",
        auctionEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000 + 12 * 60 * 1000), // 4h 12m from now
      },
      {
        title: "Dancing Figures",
        artist: "Edgar Degas",
        year: 1884,
        type: "Pastel on Paper",
        description: "Ballet dancers in motion",
        imageUrl: "https://images.unsplash.com/photo-1578662996488-ac4a8db28cbb?ixlib=rb-4.0.3&w=800&h=600&fit=crop",
        startingBid: "400000",
        currentBid: "680000",
        auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 55 * 60 * 1000), // 2h 55m from now
      }
    ];

    samplePaintings.forEach(painting => {
      const id = this.currentPaintingId++;
      this.paintings.set(id, {
        ...painting,
        id,
        createdAt: new Date(),
      });
    });

    // Add some sample bids
    const sampleBids = [
      { paintingId: 1, bidderName: "Anonymous Collector", amount: "125000" },
      { paintingId: 1, bidderName: "Art Enthusiast 47", amount: "120000" },
      { paintingId: 1, bidderName: "Gallery Owner NYC", amount: "115000" },
      { paintingId: 2, bidderName: "Museum Foundation", amount: "875000" },
      { paintingId: 2, bidderName: "Private Collector", amount: "850000" },
    ];

    sampleBids.forEach(bid => {
      const id = this.currentBidId++;
      this.bids.set(id, {
        ...bid,
        id,
        timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000), // Random time in last hour
      });
    });
  }

  async getAllPaintings(): Promise<PaintingWithBidCount[]> {
    const paintingsArray = Array.from(this.paintings.values());
    return paintingsArray.map(painting => {
      const bidCount = Array.from(this.bids.values()).filter(bid => bid.paintingId === painting.id).length;
      const timeRemaining = this.calculateTimeRemaining(painting.auctionEndTime);
      return { ...painting, bidCount, timeRemaining };
    });
  }

  async getPaintingById(id: number): Promise<Painting | undefined> {
    return this.paintings.get(id);
  }

  async createPainting(paintingData: InsertPainting): Promise<Painting> {
    const id = this.currentPaintingId++;
    const painting: Painting = {
      ...paintingData,
      id,
      createdAt: new Date(),
    };
    this.paintings.set(id, painting);
    return painting;
  }

  async updatePaintingBid(id: number, newBid: number): Promise<void> {
    const painting = this.paintings.get(id);
    if (painting) {
      painting.currentBid = newBid.toString();
      this.paintings.set(id, painting);
    }
  }

  async getBidsForPainting(paintingId: number): Promise<Bid[]> {
    return Array.from(this.bids.values())
      .filter(bid => bid.paintingId === paintingId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createBid(bidData: InsertBid): Promise<Bid> {
    const id = this.currentBidId++;
    const bid: Bid = {
      ...bidData,
      id,
      timestamp: new Date(),
    };
    this.bids.set(id, bid);
    
    // Update painting's current bid
    await this.updatePaintingBid(bidData.paintingId, parseFloat(bidData.amount));
    
    return bid;
  }

  async getAllBids(): Promise<Bid[]> {
    return Array.from(this.bids.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private calculateTimeRemaining(endTime: Date): string {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

export const storage = new MemStorage();
