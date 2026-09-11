import { FormEvent, useState } from 'react'
import { Plus } from 'lucide-react'
import { Flash, Modal } from '@/components/Modal'
import { fieldClass, formatDateTime, primaryBtnClass, secondaryBtnClass } from '@/lib/format'
import { useErpStore } from '@/store/erp-store'

export default function StockPage() {
  const movements = useErpStore((state) => state.movements)
  const products = useErpStore((state) => state.products)
  const addStockMovement = useErpStore((state) => state.addStockMovement)

  const [open, setOpen] = useState(false)
  const [productId, setProductId] = useState('')
  const [type, setType] = useState<'Entrada' | 'Ajuste'>('Entrada')
  const [qty, setQty] = useState(1)
  const [ref, setRef] = useState('')
  const [flash, setFlash] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null)

  function openCreate() {
    setProductId(products[0]?.id ?? '')
    setType('Entrada')
    setQty(1)
    setRef('')
    setOpen(true)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = addStockMovement({ productId, type, qty, ref })
    if (!result.ok) {
      setFlash({ text: result.error, kind: 'error' })
      return
    }
    setOpen(false)
    setFlash({ text: type === 'Ajuste' ? 'Estoque ajustado.' : 'Entrada registrada.', kind: 'ok' })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Movimentações de Estoque</h1>
          <p className="text-slate-500">Entradas, saídas automáticas no faturamento e ajustes manuais</p>
        </div>
        <button type="button" onClick={openCreate} className={primaryBtnClass}>
          <Plus size={18} /> Nova movimentação
        </button>
      </div>

      <Flash message={flash?.text ?? null} kind={flash?.kind} />

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-mono text-blue-600">{product.sku}</p>
            <p className="font-medium text-slate-800">{product.name}</p>
            <p className={`mt-2 text-2xl font-bold ${product.stock <= product.min ? 'text-amber-600' : 'text-slate-800'}`}>
              {product.stock} <span className="text-sm font-medium text-slate-500">un</span>
            </p>
            <p className="text-xs text-slate-400">mínimo {product.min}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
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
            {movements.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Nenhuma movimentação.
                </td>
              </tr>
            )}
            {movements.map((movement) => (
              <tr key={movement.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-500">{formatDateTime(movement.date)}</td>
                <td className="p-4 font-medium text-slate-800">{movement.product}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      movement.type === 'Entrada'
                        ? 'bg-emerald-100 text-emerald-700'
                        : movement.type === 'Ajuste'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {movement.type}
                  </span>
                </td>
                <td className="p-4 font-bold">{movement.qty} un</td>
                <td className="p-4 text-slate-500">{movement.before}</td>
                <td className="p-4 font-semibold text-slate-800">{movement.after}</td>
                <td className="p-4 text-slate-500">{movement.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Movimentar estoque" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Produto
            <select className={`mt-1 ${fieldClass}`} value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} — {product.name} (saldo {product.stock})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Tipo
            <select className={`mt-1 ${fieldClass}`} value={type} onChange={(e) => setType(e.target.value as 'Entrada' | 'Ajuste')}>
              <option value="Entrada">Entrada</option>
              <option value="Ajuste">Ajuste (define o saldo)</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {type === 'Ajuste' ? 'Novo saldo' : 'Quantidade'}
            <input type="number" min={0} className={`mt-1 ${fieldClass}`} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Referência
            <input className={`mt-1 ${fieldClass}`} placeholder="NF, lote, motivo..." value={ref} onChange={(e) => setRef(e.target.value)} />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={secondaryBtnClass} onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={primaryBtnClass}>
              Confirmar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
