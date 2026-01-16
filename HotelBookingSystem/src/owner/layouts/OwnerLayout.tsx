import { Outlet } from 'react-router-dom';
import { OwnerHeader } from '../components/OwnerHeader';
import { OwnerSidebar } from '../components/OwnerSidebar';

export default function OwnerLayout() {
  return (
    <div className="flex h-screen bg-[#FDF8F3] overflow-hidden">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OwnerHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FDF8F3] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
