export default function FinancePage() {
  const entries = [
    { desc: 'Faturamento Pedido SO-2026-00040', type: 'Receber', amount: 15300.00, due: '25/09/2026', status: 'Pendente' },
    { desc: 'Fornecedor Dell Computadores', type: 'Pagar', amount: 8400.00, due: '15/09/2026', status: 'Pago' },
  ]

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Contas a Pagar e Receber</h1>
      <p className="text-slate-500">Controle financeiro integrado às vendas e compras</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
            <tr>
              <th className="p-4">Descrição</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Vencimento</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((e, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-800">{e.desc}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    e.type === 'Receber' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {e.type}
                  </span>
                </td>
                <td className="p-4 font-bold text-slate-800">R$ {e.amount.toFixed(2)}</td>
                <td className="p-4 text-slate-500">{e.due}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    e.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
