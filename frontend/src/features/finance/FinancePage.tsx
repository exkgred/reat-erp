import { FormEvent, useState } from 'react'
import { Plus } from 'lucide-react'
import { Flash, Modal } from '@/components/Modal'
import { fieldClass, formatDate, formatMoney, primaryBtnClass, secondaryBtnClass } from '@/lib/format'
import { type FinanceType, useErpStore } from '@/store/erp-store'

export default function FinancePage() {
  const entries = useErpStore((state) => state.finance)
  const addFinance = useErpStore((state) => state.addFinance)
  const markFinancePaid = useErpStore((state) => state.markFinancePaid)
  const cancelFinance = useErpStore((state) => state.cancelFinance)

  const [open, setOpen] = useState(false)
  const [desc, setDesc] = useState('')
  const [type, setType] = useState<FinanceType>('Receber')
  const [amount, setAmount] = useState(0)
  const [due, setDue] = useState('')
  const [flash, setFlash] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null)

  const receivable = entries.filter((item) => item.type === 'Receber' && item.status === 'Pendente').reduce((sum, item) => sum + item.amount, 0)
  const payable = entries.filter((item) => item.type === 'Pagar' && item.status === 'Pendente').reduce((sum, item) => sum + item.amount, 0)

  function openCreate() {
    setDesc('')
    setType('Receber')
    setAmount(0)
    setDue(new Date().toISOString().slice(0, 10))
    setOpen(true)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = addFinance({ desc, type, amount, due })
    if (!result.ok) {
      setFlash({ text: result.error, kind: 'error' })
      return
    }
    setOpen(false)
    setFlash({ text: 'Lançamento criado.', kind: 'ok' })
  }

  function pay(id: string) {
    const result = markFinancePaid(id)
    setFlash(result.ok ? { text: 'Lançamento marcado como pago.', kind: 'ok' } : { text: result.error, kind: 'error' })
  }

  function cancel(id: string) {
    const result = cancelFinance(id)
    setFlash(result.ok ? { text: 'Lançamento cancelado.', kind: 'ok' } : { text: result.error, kind: 'error' })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Contas a Pagar e Receber</h1>
          <p className="text-slate-500">Lançamentos manuais e títulos gerados no faturamento</p>
        </div>
        <button type="button" onClick={openCreate} className={primaryBtnClass}>
          <Plus size={18} /> Novo lançamento
        </button>
      </div>

      <Flash message={flash?.text ?? null} kind={flash?.kind} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">A receber (pendente)</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{formatMoney(receivable)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">A pagar (pendente)</p>
          <p className="mt-1 text-2xl font-bold text-orange-700">{formatMoney(payable)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="p-4">Descrição</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Vencimento</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Nenhum lançamento.
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{entry.desc}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.type === 'Receber' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {entry.type}
                  </span>
                </td>
                <td className="p-4 font-bold text-slate-800">{formatMoney(entry.amount)}</td>
                <td className="p-4 text-slate-500">{formatDate(entry.due)}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      entry.status === 'Pago'
                        ? 'bg-emerald-100 text-emerald-700'
                        : entry.status === 'Cancelado'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="space-x-2 whitespace-nowrap p-4 text-right">
                  {entry.status === 'Pendente' && (
                    <>
                      <button type="button" onClick={() => pay(entry.id)} className="text-xs font-medium text-emerald-700 hover:underline">
                        Marcar pago
                      </button>
                      <button type="button" onClick={() => cancel(entry.id)} className="text-xs font-medium text-slate-500 hover:underline">
                        Cancelar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Novo lançamento" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Descrição
            <input className={`mt-1 ${fieldClass}`} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium text-slate-700">
              Tipo
              <select className={`mt-1 ${fieldClass}`} value={type} onChange={(e) => setType(e.target.value as FinanceType)}>
                <option value="Receber">Receber</option>
                <option value="Pagar">Pagar</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Valor
              <input type="number" min={0} step={0.01} className={`mt-1 ${fieldClass}`} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Vencimento
            <input type="date" className={`mt-1 ${fieldClass}`} value={due} onChange={(e) => setDue(e.target.value)} />
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
