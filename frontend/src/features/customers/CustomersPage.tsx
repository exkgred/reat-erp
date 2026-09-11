import { useState } from 'react'
import { Search, Plus } from 'lucide-react'

export default function CustomersPage() {
  const [search, setSearch] = useState('')

  const customers = [
    { id: '1', name: 'Tech Solutions Ltda', doc: '12.345.678/0001-90', type: 'PJ', email: 'contato@techsolutions.com', phone: '(11) 98765-4321', status: 'Ativo' },
    { id: '2', name: 'Carlos Eduardo Santos', doc: '123.456.789-00', type: 'PF', email: 'carlos.santos@email.com', phone: '(21) 97654-3210', status: 'Ativo' },
    { id: '3', name: 'Indústria Metalúrgica Sul', doc: '98.765.432/0001-11', type: 'PJ', email: 'vendas@metalsul.com.br', phone: '(41) 3344-5566', status: 'Ativo' },
  ]

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.doc.includes(search))

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500">Gerencie clientes cadastrados e contatos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm">
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Documento</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-800">{c.name}</td>
                <td className="p-4 text-slate-500">{c.type}</td>
                <td className="p-4 text-slate-500">{c.doc}</td>
                <td className="p-4 text-slate-500">{c.email}</td>
                <td className="p-4 text-slate-500">{c.phone}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
