import { FormEvent, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Flash, Modal } from '@/components/Modal'
import { fieldClass, formatMoney, primaryBtnClass, secondaryBtnClass } from '@/lib/format'
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductInput,
  useErpStore,
} from '@/store/erp-store'

const emptyForm: ProductInput = {
  sku: '',
  name: '',
  category: 'Informática',
  description: '',
  price: 0,
  cost: 0,
  min: 0,
  initialStock: 0,
}

export default function ProductsPage() {
  const products = useErpStore((state) => state.products)
  const addProduct = useErpStore((state) => state.addProduct)
  const updateProduct = useErpStore((state) => state.updateProduct)
  const toggleProduct = useErpStore((state) => state.toggleProduct)
  const removeProduct = useErpStore((state) => state.removeProduct)

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductInput>(emptyForm)
  const [flash, setFlash] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null)

  const filtered = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()),
  )

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      cost: product.cost,
      min: product.min,
    })
    setOpen(true)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = editing ? updateProduct(editing.id, form) : addProduct(form)
    if (!result.ok) {
      setFlash({ text: result.error, kind: 'error' })
      return
    }
    setOpen(false)
    setFlash({ text: editing ? 'Produto atualizado.' : 'Produto cadastrado.', kind: 'ok' })
  }

  function onRemove(id: string) {
    if (!window.confirm('Excluir este produto?')) return
    const result = removeProduct(id)
    setFlash(result.ok ? { text: 'Produto excluído.', kind: 'ok' } : { text: result.error, kind: 'error' })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Catálogo de Produtos</h1>
          <p className="text-slate-500">Controle de SKU, preços, custos e estoque mínimo</p>
        </div>
        <button type="button" onClick={openCreate} className={primaryBtnClass}>
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <Flash message={flash?.text ?? null} kind={flash?.kind} />

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
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
              <th className="p-4">SKU</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono font-medium text-blue-600">{product.sku}</td>
                <td className="p-4 font-medium text-slate-800">{product.name}</td>
                <td className="p-4 text-slate-500">{product.category}</td>
                <td className="p-4 font-semibold text-slate-800">{formatMoney(product.price)}</td>
                <td className="p-4">
                  <span className={product.stock <= product.min ? 'font-semibold text-amber-600' : 'font-semibold'}>
                    {product.stock}
                  </span>{' '}
                  un
                  {product.stock <= product.min && (
                    <span className="ml-2 text-xs text-amber-600">mín. {product.min}</span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="space-x-2 p-4 text-right">
                  <button type="button" onClick={() => openEdit(product)} className="inline-flex rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Editar">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => toggleProduct(product.id)} className="text-xs font-medium text-slate-600 hover:underline">
                    {product.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                  </button>
                  <button type="button" onClick={() => onRemove(product.id)} className="inline-flex rounded p-1 text-red-500 hover:bg-red-50" aria-label="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing ? 'Editar produto' : 'Novo produto'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium text-slate-700">
              SKU
              <input className={`mt-1 ${fieldClass}`} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Categoria
              <select className={`mt-1 ${fieldClass}`} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Nome
            <input className={`mt-1 ${fieldClass}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Descrição
            <textarea className={`mt-1 ${fieldClass}`} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium text-slate-700">
              Preço
              <input type="number" min={0} step={0.01} className={`mt-1 ${fieldClass}`} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Custo
              <input type="number" min={0} step={0.01} className={`mt-1 ${fieldClass}`} value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Estoque mínimo
              <input type="number" min={0} className={`mt-1 ${fieldClass}`} value={form.min} onChange={(e) => setForm({ ...form, min: Number(e.target.value) })} />
            </label>
            {!editing && (
              <label className="text-sm font-medium text-slate-700">
                Estoque inicial
                <input type="number" min={0} className={`mt-1 ${fieldClass}`} value={form.initialStock ?? 0} onChange={(e) => setForm({ ...form, initialStock: Number(e.target.value) })} />
              </label>
            )}
          </div>
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
