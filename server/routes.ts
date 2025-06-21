import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertBidSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time bidding
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<WebSocket, { paintingId?: number }>();

  wss.on('connection', (ws) => {
    clients.set(ws, {});
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'joinRoom' && data.paintingId) {
          const clientData = clients.get(ws);
          if (clientData) {
            clientData.paintingId = data.paintingId;
            clients.set(ws, clientData);
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Broadcast bid update to relevant clients
  function broadcastBidUpdate(paintingId: number, bidData: any) {
    clients.forEach((clientData, ws) => {
      if (ws.readyState === WebSocket.OPEN && clientData.paintingId === paintingId) {
        ws.send(JSON.stringify({
          type: 'bidUpdate',
          paintingId,
          ...bidData
        }));
      }
    });
  }

  // API Routes
  
  // GET /api/auctions - Get all paintings
  app.get('/api/auctions', async (req, res) => {
    try {
      const paintings = await storage.getAllPaintings();
      res.json(paintings);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      res.status(500).json({ message: 'Failed to fetch auctions' });
    }
  });

  // GET /api/auctions/:id - Get specific painting
  app.get('/api/auctions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid painting ID' });
      }

      const painting = await storage.getPaintingById(id);
      if (!painting) {
        return res.status(404).json({ message: 'Painting not found' });
      }

      const bids = await storage.getBidsForPainting(id);
      res.json({ ...painting, bids });
    } catch (error) {
      console.error('Error fetching painting:', error);
      res.status(500).json({ message: 'Failed to fetch painting details' });
    }
  });

  // GET /api/auctions/:id/bids - Get bids for specific painting
  app.get('/api/auctions/:id/bids', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid painting ID' });
      }

      const bids = await storage.getBidsForPainting(id);
      res.json(bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      res.status(500).json({ message: 'Failed to fetch bids' });
    }
  });

  // POST /api/auctions/:id/bid - Place a bid
  app.post('/api/auctions/:id/bid', async (req, res) => {
    try {
      const paintingId = parseInt(req.params.id);
      if (isNaN(paintingId)) {
        return res.status(400).json({ message: 'Invalid painting ID' });
      }

      // Validate request body
      const bidValidation = insertBidSchema.extend({
        paintingId: z.number(),
        bidderName: z.string().min(1, 'Bidder name is required'),
        amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Invalid bid amount')
      }).safeParse({ ...req.body, paintingId });

      if (!bidValidation.success) {
        return res.status(400).json({ 
          message: 'Invalid bid data', 
          errors: bidValidation.error.errors 
        });
      }

      const painting = await storage.getPaintingById(paintingId);
      if (!painting) {
        return res.status(404).json({ message: 'Painting not found' });
      }

      const bidAmount = parseFloat(bidValidation.data.amount);
      const currentBid = parseFloat(painting.currentBid);

      if (bidAmount <= currentBid) {
        return res.status(400).json({ 
          message: `Bid must be higher than current bid of $${currentBid.toLocaleString()}` 
        });
      }

      // Check if auction has ended
      if (new Date() > painting.auctionEndTime) {
        return res.status(400).json({ message: 'Auction has ended' });
      }

      const bid = await storage.createBid(bidValidation.data);

      // Broadcast bid update to WebSocket clients
      broadcastBidUpdate(paintingId, {
        bid: {
          id: bid.id,
          bidderName: bid.bidderName,
          amount: bid.amount,
          timestamp: bid.timestamp
        },
        currentBid: bid.amount
      });

      res.status(201).json(bid);
    } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ message: 'Failed to place bid' });
    }
  });

  // GET /api/dashboard - Get dashboard analytics
  app.get('/api/dashboard', async (req, res) => {
    try {
      const paintings = await storage.getAllPaintings();
      const allBids = await storage.getAllBids();

      const totalBids = allBids.length;
      const highestBid = Math.max(...paintings.map(p => parseFloat(p.currentBid)));
      const avgBidsPerItem = totalBids / paintings.length;

      const topPaintings = paintings
        .sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0))
        .slice(0, 3);

      res.json({
        totalBids,
        highestBid,
        activeAuctions: paintings.length,
        avgBidsPerItem: Math.round(avgBidsPerItem),
        topPaintings
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
  });

  return httpServer;
}
