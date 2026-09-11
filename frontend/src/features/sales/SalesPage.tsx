import { FormEvent, useMemo, useState } from 'react'
import { Ban, CheckCircle, FileText, Plus, Trash2 } from 'lucide-react'
import { Flash, Modal } from '@/components/Modal'
import { fieldClass, formatDate, formatMoney, primaryBtnClass, secondaryBtnClass } from '@/lib/format'
import { type OrderStatus, useErpStore } from '@/store/erp-store'

const STATUS_LABEL: Record<OrderStatus, string> = {
  Draft: 'Rascunho',
  Approved: 'Aprovado',
  Invoiced: 'Faturado',
  Canceled: 'Cancelado',
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  Draft: 'bg-amber-100 text-amber-700',
  Approved: 'bg-blue-100 text-blue-700',
  Invoiced: 'bg-emerald-100 text-emerald-700',
  Canceled: 'bg-slate-200 text-slate-600',
}

interface DraftItem {
  productId: string
  qty: number
  price: number
}

export default function SalesPage() {
  const orders = useErpStore((state) => state.orders)
  const customers = useErpStore((state) => state.customers)
  const products = useErpStore((state) => state.products)
  const addOrder = useErpStore((state) => state.addOrder)
  const approveOrder = useErpStore((state) => state.approveOrder)
  const invoiceOrder = useErpStore((state) => state.invoiceOrder)
  const cancelOrder = useErpStore((state) => state.cancelOrder)

  const activeCustomers = customers.filter((item) => item.status === 'Ativo')
  const activeProducts = products.filter((item) => item.status === 'Ativo')

  const [open, setOpen] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<DraftItem[]>([])
  const [pickProduct, setPickProduct] = useState('')
  const [pickQty, setPickQty] = useState(1)
  const [flash, setFlash] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null)

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.price, 0),
    [items],
  )

  function openCreate() {
    setCustomerId(activeCustomers[0]?.id ?? '')
    setNotes('')
    setItems([])
    setPickProduct(activeProducts[0]?.id ?? '')
    setPickQty(1)
    setOpen(true)
  }

  function addItem() {
    const product = products.find((item) => item.id === pickProduct)
    if (!product) return
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + pickQty } : item,
        )
      }
      return [...current, { productId: product.id, qty: pickQty, price: product.price }]
    })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = addOrder({ customerId, notes, items })
    if (!result.ok) {
      setFlash({ text: result.error, kind: 'error' })
      return
    }
    setOpen(false)
    setFlash({ text: 'Pedido criado em rascunho.', kind: 'ok' })
  }

  function run(action: (id: string) => { ok: true } | { ok: false; error: string }, id: string, okText: string) {
    const result = action(id)
    setFlash(result.ok ? { text: okText, kind: 'ok' } : { text: result.error, kind: 'error' })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pedidos de Venda</h1>
          <p className="text-slate-500">Fluxo: rascunho → aprovação → faturamento (baixa estoque e gera contas a receber)</p>
        </div>
        <button type="button" onClick={openCreate} className={primaryBtnClass}>
          <Plus size={18} /> Novo Pedido
        </button>
      </div>

      <Flash message={flash?.text ?? null} kind={flash?.kind} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="p-4">Número</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Itens</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Nenhum pedido cadastrado.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono font-medium text-blue-600">{order.number}</td>
                <td className="p-4 text-slate-800">{order.customer}</td>
                <td className="p-4 text-slate-500">{formatDate(order.createdAt)}</td>
                <td className="p-4 text-slate-500">{order.items.length}</td>
                <td className="p-4 font-bold text-slate-800">{formatMoney(order.total)}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="space-x-2 whitespace-nowrap p-4 text-right">
                  {order.status === 'Draft' && (
                    <button
                      type="button"
                      onClick={() => run(approveOrder, order.id, 'Pedido aprovado.')}
                      className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                    >
                      <CheckCircle size={14} /> Aprovar
                    </button>
                  )}
                  {order.status === 'Approved' && (
                    <button
                      type="button"
                      onClick={() => run(invoiceOrder, order.id, 'Pedido faturado. Estoque baixado e conta a receber gerada.')}
                      className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
                    >
                      <FileText size={14} /> Faturar
                    </button>
                  )}
                  {(order.status === 'Draft' || order.status === 'Approved') && (
                    <button
                      type="button"
                      onClick={() => run(cancelOrder, order.id, 'Pedido cancelado.')}
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                    >
                      <Ban size={14} /> Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Novo pedido" onClose={() => setOpen(false)} wide>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Cliente
            <select className={`mt-1 ${fieldClass}`} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Selecione...</option>
              {activeCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-sm font-medium text-slate-700">Itens</p>
            <div className="mb-3 flex flex-wrap items-end gap-2">
              <label className="min-w-[200px] flex-1 text-xs text-slate-600">
                Produto
                <select className={`mt-1 ${fieldClass}`} value={pickProduct} onChange={(e) => setPickProduct(e.target.value)}>
                  {activeProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.sku} — {product.name} ({formatMoney(product.price)})
                    </option>
                  ))}
                </select>
              </label>
              <label className="w-24 text-xs text-slate-600">
                Qtd
                <input type="number" min={1} className={`mt-1 ${fieldClass}`} value={pickQty} onChange={(e) => setPickQty(Number(e.target.value))} />
              </label>
              <button type="button" onClick={addItem} className={secondaryBtnClass}>
                Adicionar
              </button>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhum item ainda.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {items.map((item) => {
                    const product = products.find((entry) => entry.id === item.productId)
                    return (
                      <tr key={item.productId} className="border-t border-slate-100">
                        <td className="py-2">{product?.name}</td>
                        <td className="py-2">{item.qty} un</td>
                        <td className="py-2">{formatMoney(item.price)}</td>
                        <td className="py-2 font-medium">{formatMoney(item.qty * item.price)}</td>
                        <td className="py-2 text-right">
                          <button type="button" onClick={() => setItems((current) => current.filter((line) => line.productId !== item.productId))} aria-label="Remover item">
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
            <p className="mt-3 text-right text-sm font-semibold text-slate-800">Total {formatMoney(total)}</p>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Observações
            <textarea className={`mt-1 ${fieldClass}`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={secondaryBtnClass} onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={primaryBtnClass}>
              Salvar rascunho
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
