import { Palette, Search, Bell, User, Zap, Activity, Filter, Eye } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  currentPath?: string;
}

export default function Header({ currentPath }: HeaderProps) {
  return (
    <header className="glass-effect cyber-border sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Palette className="w-10 h-10 text-neon transition-transform duration-300 group-hover:rotate-12 pulse-neon" />
                <Activity className="w-4 h-4 text-cyber-purple absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold hero-text">
                  VintageArt
                </span>
                <span className="text-xs text-cyber font-medium tracking-wider uppercase">
                  ELITE AUCTIONS
                </span>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/">
                <Button 
                  variant={currentPath === '/' ? 'default' : 'ghost'}
                  className={`px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 uppercase ${
                    currentPath === '/' 
                      ? 'btn-cyber neon-glow' 
                      : 'hover:bg-white/5 hover:text-neon text-muted-foreground neon-border'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Live Auctions
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  variant={currentPath === '/dashboard' ? 'default' : 'ghost'}
                  className={`px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 uppercase ${
                    currentPath === '/dashboard' 
                      ? 'btn-cyber neon-glow' 
                      : 'hover:bg-white/5 hover:text-neon text-muted-foreground neon-border'
                  }`}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Neural Net
                </Button>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-xl hover:bg-neon-purple/10 hover:scale-110 transition-all duration-300 cyber-border"
            >
              <Search className="w-5 h-5 text-neon-blue" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-xl hover:bg-neon-purple/10 hover:scale-110 transition-all duration-300 relative cyber-border"
            >
              <Bell className="w-5 h-5 text-neon-cyan" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-plasma-pink rounded-full animate-pulse cyber-glow"></div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-xl hover:bg-neon-purple/10 hover:scale-110 transition-all duration-300 cyber-border"
            >
              <User className="w-5 h-5 text-luxury-gold" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
