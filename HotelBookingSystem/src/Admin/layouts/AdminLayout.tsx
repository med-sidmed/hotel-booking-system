import { Outlet } from 'react-router-dom';
import { AdminHeader } from '../components/AdminHeader';
import { AdminSidebar } from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#FDF8F3] overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FDF8F3] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
