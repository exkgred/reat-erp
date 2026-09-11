import { Plus } from 'lucide-react'

export default function ProductsPage() {
  const products = [
    { sku: 'PROD-001', name: 'Notebook Pro 15', category: 'Informática', price: 4500.00, stock: 15, min: 5 },
    { sku: 'PROD-002', name: 'Monitor 27 4K', category: 'Monitores', price: 2100.00, stock: 8, min: 3 },
    { sku: 'PROD-003', name: 'Teclado Mecânico RGB', category: 'Periféricos', price: 350.00, stock: 30, min: 10 },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Catálogo de Produtos</h1>
          <p className="text-slate-500">Controle de SKU, preços, custos e estoque mínimo</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm">
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.sku} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono font-medium text-blue-600">{p.sku}</td>
                <td className="p-4 font-medium text-slate-800">{p.name}</td>
                <td className="p-4 text-slate-500">{p.category}</td>
                <td className="p-4 font-semibold text-slate-800">R$ {p.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className="font-semibold">{p.stock}</span> un
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
