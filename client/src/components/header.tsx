import { Palette, Search, Bell, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentPath?: string;
}

export default function Header({ currentPath }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Palette className="w-8 h-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-foreground">
                VintageArt
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/">
                <Button 
                  variant={currentPath === '/' ? 'default' : 'ghost'}
                  className="px-3 py-2 text-sm font-medium"
                >
                  Auctions
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  variant={currentPath === '/dashboard' ? 'default' : 'ghost'}
                  className="px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Button>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
