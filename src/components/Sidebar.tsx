
import React from 'react';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { 
  Package, 
  BarChart4, 
  PlusCircle, 
  ShoppingCart, 
  FileText, 
  Bell, 
  Settings,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <BarChart4 className="w-5 h-5" />, path: '/' },
    { name: 'Inventory', icon: <Package className="w-5 h-5" />, path: '/inventory' },
    { name: 'Add Stock', icon: <PlusCircle className="w-5 h-5" />, path: '/add-stock' },
    { name: 'Sales', icon: <ShoppingCart className="w-5 h-5" />, path: '/sales' },
    { name: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/reports' },
    { name: 'Alerts', icon: <Bell className="w-5 h-5" />, path: '/alerts' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r transition-all duration-300 flex flex-col shadow-sm", 
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="md:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {!collapsed && (
          <h1 className="text-xl font-bold ml-2 text-company-blue">
            Aadish Trading
          </h1>
        )}
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">{item.icon}</span>
                {!collapsed && (
                  <span className="ml-3 text-gray-700">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        {!collapsed && (
          <div className="text-xs text-gray-500">
            Aadish Trading Company<br />
            Inventory System v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
