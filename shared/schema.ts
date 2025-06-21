import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const paintings = pgTable("paintings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  startingBid: decimal("starting_bid", { precision: 10, scale: 2 }).notNull(),
  currentBid: decimal("current_bid", { precision: 10, scale: 2 }).notNull(),
  auctionEndTime: timestamp("auction_end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  paintingId: integer("painting_id").notNull().references(() => paintings.id),
  bidderName: text("bidder_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertPaintingSchema = createInsertSchema(paintings).omit({
  id: true,
  createdAt: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  timestamp: true,
});

export type InsertPainting = z.infer<typeof insertPaintingSchema>;
export type Painting = typeof paintings.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;

// For client-side data types
export interface PaintingWithBidCount extends Painting {
  bidCount?: number;
  timeRemaining?: string;
}

export interface BidWithPainting extends Bid {
  painting?: Painting;
}
