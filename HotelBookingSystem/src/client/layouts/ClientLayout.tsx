import { Outlet } from 'react-router-dom';
import { ClientSidebar } from '../components/ClientSidebar';
import { ClientHeader } from '../components/ClientHeader';
 
export default function ClientLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
