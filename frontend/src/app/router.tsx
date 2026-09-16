import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/hooks/useAuthStore'
import { LayoutDashboard, Users, Package, ShoppingCart, Archive, DollarSign, LogOut } from 'lucide-react'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const CustomersPage = lazy(() => import('@/features/customers/CustomersPage'))
const ProductsPage = lazy(() => import('@/features/products/ProductsPage'))
const SalesPage = lazy(() => import('@/features/sales/SalesPage'))
const StockPage = lazy(() => import('@/features/stock/StockPage'))
const FinancePage = lazy(() => import('@/features/finance/FinancePage'))

function navClass(active: boolean): string {
  return `flex items-center gap-3 px-3 py-2 rounded-md transition ${active ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  return (
    <div className="flex h-full min-h-0 flex-1 bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">V</div>
          <span className="text-lg font-bold">VendaCore ERP</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/" className={navClass(location.pathname === '/')}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/customers" className={navClass(location.pathname === '/customers')}>
            <Users size={18} /> Clientes
          </Link>
          <Link to="/products" className={navClass(location.pathname === '/products')}>
            <Package size={18} /> Produtos
          </Link>
          <Link to="/sales" className={navClass(location.pathname === '/sales')}>
            <ShoppingCart size={18} /> Vendas
          </Link>
          <Link to="/stock" className={navClass(location.pathname === '/stock')}>
            <Archive size={18} /> Estoque
          </Link>
          <Link to="/finance" className={navClass(location.pathname === '/finance')}>
            <DollarSign size={18} /> Financeiro
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium">{user?.name || 'Administrador'}</p>
            <p className="text-xs text-slate-400">{user?.role || 'Admin'}</p>
          </div>
          <button onClick={logout} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex min-h-0 flex-1 flex-col">
        <Suspense fallback={<div className="flex h-full items-center justify-center">Carregando...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
            <Route path="/customers" element={<RequireAuth><CustomersPage /></RequireAuth>} />
            <Route path="/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
            <Route path="/sales" element={<RequireAuth><SalesPage /></RequireAuth>} />
            <Route path="/stock" element={<RequireAuth><StockPage /></RequireAuth>} />
            <Route path="/finance" element={<RequireAuth><FinancePage /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}
