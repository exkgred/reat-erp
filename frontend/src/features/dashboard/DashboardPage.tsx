import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { formatMoney } from '@/lib/format'
import { useDashboardMetrics } from '@/store/erp-store'

export default function DashboardPage() {
  const summary = useDashboardMetrics()

  const kpis = [
    { label: 'Faturamento do mês', value: formatMoney(summary.revenueThisMonth), icon: DollarSign, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Pedidos faturados', value: summary.totalSales, icon: ShoppingCart, color: 'text-blue-600 bg-blue-100' },
    { label: 'Clientes ativos', value: summary.totalCustomers, icon: Users, color: 'text-indigo-600 bg-indigo-100' },
    { label: 'Produtos ativos', value: summary.totalProducts, icon: Package, color: 'text-amber-600 bg-amber-100' },
  ]

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Painel Principal</h1>
        <p className="text-slate-500">
          Métricas ao vivo dos cadastros e do fluxo de venda. {summary.pendingOrders} pedido(s) em rascunho ou aprovação.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{kpi.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${kpi.color}`}>
                <Icon size={24} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Volume faturado nos últimos 7 dias</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value) => formatMoney(Number(value ?? 0))} />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
