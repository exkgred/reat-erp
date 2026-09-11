import { isDemo } from '@/lib/demo-mode'
import { useErpStore } from '@/store/erp-store'
import { Providers } from './providers'
import { AppRouter } from './router'

export function App() {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        {isDemo && (
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-blue-700 px-3 py-1.5 text-center text-[11px] text-blue-50 sm:text-xs">
            <span>Demo estática do VendaCore ERP — CRUDs no navegador, sem API .NET. Login: admin@vendacore.com / password123</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Restaurar os dados iniciais da demo?')) {
                  useErpStore.getState().resetDemo()
                }
              }}
              className="underline decoration-blue-200 underline-offset-2 hover:text-white"
            >
              Resetar dados
            </button>
          </div>
        )}
        <div className="flex min-h-0 flex-1 flex-col">
          <AppRouter />
        </div>
      </div>
    </Providers>
  )
}
