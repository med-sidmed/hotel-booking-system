export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg text-[#6B5434]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <span className="text-sm font-medium text-gray-400">Total Hôtels</span>
           </div>
           <h3 className="text-2xl font-bold text-gray-800">64</h3>
           <p className="text-sm text-green-500 mt-2 flex items-center">
             <span className="mr-1">↑</span> +12% ce mois
           </p>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg text-[#6B5434]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <span className="text-sm font-medium text-gray-400">Total Chambres</span>
           </div>
           <h3 className="text-2xl font-bold text-gray-800">357</h3>
           <p className="text-sm text-green-500 mt-2 flex items-center">
             <span className="mr-1">↑</span> +5% ce mois
           </p>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg text-[#6B5434]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-sm font-medium text-gray-400">Réservations</span>
           </div>
           <h3 className="text-2xl font-bold text-gray-800">480</h3>
           <p className="text-sm text-green-500 mt-2 flex items-center">
             <span className="mr-1">↑</span> +24% ce mois
           </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg text-[#6B5434]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm font-medium text-gray-400">Revenus</span>
           </div>
           <h3 className="text-2xl font-bold text-gray-800">124,594$</h3>
           <p className="text-sm text-green-500 mt-2 flex items-center">
             <span className="mr-1">↑</span> +18% ce mois
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Section (Mock) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-orange-100">
             <h3 className="text-lg font-bold text-gray-800 mb-6">Aperçu des Réservations</h3>
             <div className="h-64 flex items-end justify-between space-x-2 px-4">
                {/* Mock Bars */}
                {[30, 45, 25, 60, 75, 50, 80, 55, 70, 65, 90, 85].map((height, i) => (
                    <div key={i} className="w-full bg-[#E8DCC8] rounded-t hover:bg-[#6B5434] transition-colors relative group" style={{ height: `${height}%` }}>
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                          {height * 10}
                       </div>
                    </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-xs text-gray-500">
                <span>Jan</span><span>Fev</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
                <span>Juil</span><span>Aou</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
             </div>
          </div>

           {/* Stats Donut (Mock) */}
           <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-orange-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Statut des Réservations</h3>
              <div className="flex items-center justify-center relative h-56">
                 {/* CSS Pie Chart Mock */}
                 <div className="w-40 h-40 rounded-full border-[16px] border-[#6B5434] border-l-[#C6A87C] border-b-[#E8DCC8] transform rotate-45"></div>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-gray-800">85%</span>
                    <span className="text-xs text-gray-500">Complété</span>
                 </div>
              </div>
              <div className="mt-8 space-y-3">
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#6B5434] mr-2"></div>Complété</div>
                    <span className="font-bold">60%</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#C6A87C] mr-2"></div>En attente</div>
                    <span className="font-bold">30%</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#E8DCC8] mr-2"></div>Annulé</div>
                    <span className="font-bold">10%</span>
                 </div>
              </div>
           </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Activité Récente</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-[#FAF6F1] text-gray-700 font-medium">
                      <tr>
                          <th className="px-6 py-3">Client</th>
                          <th className="px-6 py-3">Type Chambre</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Montant</th>
                          <th className="px-6 py-3">Statut</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Sophie Martin</td>
                          <td className="px-6 py-4">Suite Deluxe</td>
                          <td className="px-6 py-4">16 Jan 2026</td>
                          <td className="px-6 py-4">350€</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Confirmé</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Pierre Dupont</td>
                          <td className="px-6 py-4">Chambre Standard</td>
                          <td className="px-6 py-4">15 Jan 2026</td>
                          <td className="px-6 py-4">180€</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">En attente</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Marie Currie</td>
                          <td className="px-6 py-4">Villa Océan</td>
                          <td className="px-6 py-4">14 Jan 2026</td>
                          <td className="px-6 py-4">450€</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Confirmé</span></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}
