export default function StockPage() {
  const movements = [
    { date: '11/09/2026 10:45', type: 'Saída', qty: 2, before: 17, after: 15, ref: 'SO-2026-00042', product: 'Notebook Pro 15' },
    { date: '10/09/2026 15:30', type: 'Entrada', qty: 10, before: 20, after: 30, ref: 'NF Fornecedor 4501', product: 'Teclado Mecânico RGB' },
  ]

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Movimentações de Estoque</h1>
      <p className="text-slate-500">Histórico de entradas, saídas automáticas por faturamento e ajustes manuais</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
            <tr>
              <th className="p-4">Data/Hora</th>
              <th className="p-4">Produto</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Quantidade</th>
              <th className="p-4">Saldo Anterior</th>
              <th className="p-4">Saldo Posterior</th>
              <th className="p-4">Referência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-4 text-slate-500">{m.date}</td>
                <td className="p-4 font-medium text-slate-800">{m.product}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    m.type === 'Entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {m.type}
                  </span>
                </td>
                <td className="p-4 font-bold">{m.qty} un</td>
                <td className="p-4 text-slate-500">{m.before}</td>
                <td className="p-4 font-semibold text-slate-800">{m.after}</td>
                <td className="p-4 text-slate-500">{m.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
