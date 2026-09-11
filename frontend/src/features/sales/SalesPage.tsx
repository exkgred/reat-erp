import { Plus, CheckCircle, FileText } from 'lucide-react'

export default function SalesPage() {
  const orders = [
    { number: 'SO-2026-00042', customer: 'Tech Solutions Ltda', total: 8900.00, status: 'Draft', date: '11/09/2026' },
    { number: 'SO-2026-00041', customer: 'Carlos Eduardo Santos', total: 2450.00, status: 'Approved', date: '10/09/2026' },
    { number: 'SO-2026-00040', customer: 'Indústria Metalúrgica Sul', total: 15300.00, status: 'Invoiced', date: '09/09/2026' },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pedidos de Venda</h1>
          <p className="text-slate-500">Fluxo completo: Orçamento → Aprovação → Faturamento com baixa de estoque</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm">
          <Plus size={18} /> Novo Pedido
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
            <tr>
              <th className="p-4">Número</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(o => (
              <tr key={o.number} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono font-medium text-blue-600">{o.number}</td>
                <td className="p-4 text-slate-800">{o.customer}</td>
                <td className="p-4 text-slate-500">{o.date}</td>
                <td className="p-4 font-bold text-slate-800">R$ {o.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    o.status === 'Invoiced' ? 'bg-emerald-100 text-emerald-700' :
                    o.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {o.status === 'Draft' && (
                    <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-medium inline-flex items-center gap-1">
                      <CheckCircle size={14} /> Aprovar
                    </button>
                  )}
                  {o.status === 'Approved' && (
                    <button className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100 font-medium inline-flex items-center gap-1">
                      <FileText size={14} /> Faturar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
