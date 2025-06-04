// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet /> {/* 👈 THIS displays the nested routes like Dashboard, POS, etc. */}
      </main>
    </div>
  );
}
