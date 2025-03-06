
import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search inventory..."
              className="pl-8 w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-2 ml-4">
            <div className="h-8 w-8 rounded-full bg-company-blue text-white flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-500">Aadish Trading</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
