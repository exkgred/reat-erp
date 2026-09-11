import { FormEvent, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Flash, Modal } from '@/components/Modal'
import { fieldClass, primaryBtnClass, secondaryBtnClass } from '@/lib/format'
import { type Customer, type CustomerInput, type PersonType, useErpStore } from '@/store/erp-store'

const emptyForm: CustomerInput = {
  name: '',
  type: 'PJ',
  doc: '',
  email: '',
  phone: '',
  address: '',
}

export default function CustomersPage() {
  const customers = useErpStore((state) => state.customers)
  const addCustomer = useErpStore((state) => state.addCustomer)
  const updateCustomer = useErpStore((state) => state.updateCustomer)
  const toggleCustomer = useErpStore((state) => state.toggleCustomer)
  const removeCustomer = useErpStore((state) => state.removeCustomer)

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<CustomerInput>(emptyForm)
  const [flash, setFlash] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null)

  const filtered = customers.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) || item.doc.includes(search),
  )

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(customer: Customer) {
    setEditing(customer)
    setForm({
      name: customer.name,
      type: customer.type,
      doc: customer.doc,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    })
    setOpen(true)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = editing ? updateCustomer(editing.id, form) : addCustomer(form)
    if (!result.ok) {
      setFlash({ text: result.error, kind: 'error' })
      return
    }
    setOpen(false)
    setFlash({ text: editing ? 'Cliente atualizado.' : 'Cliente cadastrado.', kind: 'ok' })
  }

  function onRemove(id: string) {
    if (!window.confirm('Excluir este cliente?')) return
    const result = removeCustomer(id)
    setFlash(result.ok ? { text: 'Cliente excluído.', kind: 'ok' } : { text: result.error, kind: 'error' })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500">Cadastre, edite, inative ou exclua clientes</p>
        </div>
        <button type="button" onClick={openCreate} className={primaryBtnClass}>
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <Flash message={flash?.text ?? null} kind={flash?.kind} />

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={`pl-10 ${fieldClass}`}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Documento</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{customer.name}</td>
                <td className="p-4 text-slate-500">{customer.type}</td>
                <td className="p-4 text-slate-500">{customer.doc}</td>
                <td className="p-4 text-slate-500">{customer.email}</td>
                <td className="p-4 text-slate-500">{customer.phone}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      customer.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="space-x-2 whitespace-nowrap p-4 text-right">
                  <button type="button" onClick={() => openEdit(customer)} className="inline-flex rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Editar">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => toggleCustomer(customer.id)} className="text-xs font-medium text-slate-600 hover:underline">
                    {customer.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                  </button>
                  <button type="button" onClick={() => onRemove(customer.id)} className="inline-flex rounded p-1 text-red-500 hover:bg-red-50" aria-label="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing ? 'Editar cliente' : 'Novo cliente'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Nome
            <input className={`mt-1 ${fieldClass}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium text-slate-700">
              Tipo
              <select
                className={`mt-1 ${fieldClass}`}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PersonType })}
              >
                <option value="PJ">PJ</option>
                <option value="PF">PF</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              CPF/CNPJ
              <input className={`mt-1 ${fieldClass}`} value={form.doc} onChange={(e) => setForm({ ...form, doc: e.target.value })} />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            E-mail
            <input type="email" className={`mt-1 ${fieldClass}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Telefone
            <input className={`mt-1 ${fieldClass}`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Endereço
            <input className={`mt-1 ${fieldClass}`} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={secondaryBtnClass} onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={primaryBtnClass}>
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
