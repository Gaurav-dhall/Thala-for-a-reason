import { Palette, Search, Bell, User, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentPath?: string;
}

export default function Header({ currentPath }: HeaderProps) {
  return (
    <header className="glass-effect shadow-2xl border-b border-white/20 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Palette className="w-10 h-10 text-luxury-gold transition-transform duration-300 group-hover:rotate-12" />
                <Sparkles className="w-4 h-4 text-gold-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold hero-text">
                  VintageArt
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  LUXURY AUCTIONS
                </span>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/">
                <Button 
                  variant={currentPath === '/' ? 'default' : 'ghost'}
                  className={`px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
                    currentPath === '/' 
                      ? 'btn-luxury shadow-lg' 
                      : 'hover:bg-white/10 hover:text-primary'
                  }`}
                >
                  Live Auctions
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  variant={currentPath === '/dashboard' ? 'default' : 'ghost'}
                  className={`px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
                    currentPath === '/dashboard' 
                      ? 'btn-luxury shadow-lg' 
                      : 'hover:bg-white/10 hover:text-primary'
                  }`}
                >
                  Analytics
                </Button>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-xl hover:bg-white/10 hover:scale-110 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-xl hover:bg-white/10 hover:scale-110 transition-all duration-300 relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="w-12 h-12 rounded-xl hover:bg-white/10 hover:scale-110 transition-all duration-300"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
