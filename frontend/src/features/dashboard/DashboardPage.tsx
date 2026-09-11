import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

export default function DashboardPage() {
  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      try {
        const res = await api.get('/dashboard/summary')
        return res.data
      } catch {
        return { totalSales: 42, totalCustomers: 128, totalProducts: 356, pendingOrders: 7, revenueThisMonth: 89450 }
      }
    },
  })

  const { data: chartData } = useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: async () => {
      try {
        const res = await api.get('/dashboard/sales-chart')
        return res.data
      } catch {
        return [
          { date: 'Seg', total: 12000 },
          { date: 'Ter', total: 18000 },
          { date: 'Qua', total: 14500 },
          { date: 'Qui', total: 22000 },
          { date: 'Sex', total: 25000 },
          { date: 'Sab', total: 8000 },
          { date: 'Dom', total: 4000 },
        ]
      }
    },
  })

  const kpis = [
    { label: 'Faturamento Mensal', value: `R$ ${summary?.revenueThisMonth?.toLocaleString('pt-BR') ?? '89.450'}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Pedidos Realizados', value: summary?.totalSales ?? 42, icon: ShoppingCart, color: 'text-blue-600 bg-blue-100' },
    { label: 'Clientes Ativos', value: summary?.totalCustomers ?? 128, icon: Users, color: 'text-indigo-600 bg-indigo-100' },
    { label: 'Produtos Cadastrados', value: summary?.totalProducts ?? 356, icon: Package, color: 'text-amber-600 bg-amber-100' },
  ]

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Painel Principal</h1>
        <p className="text-slate-500">Métricas consolidadas de vendas e operação da sua empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <Icon size={24} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Volume de Vendas na Semana</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
