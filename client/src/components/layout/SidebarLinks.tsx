import { Home, Package, ShoppingCart, BarChart, Users, Settings } from 'lucide-react';
import type { SidebarLink } from '@/types';

export const sidebarLinks: SidebarLink[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <Home size={18} />,
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    path: '/products',
    label: 'Products',
    icon: <Package size={18} />,
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: <ShoppingCart size={18} />,
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: <Users size={18} />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: <BarChart size={18} />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <Settings size={18} />,
    roles: ['admin'],
  },
];