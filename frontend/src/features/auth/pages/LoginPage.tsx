import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { isDemo } from '@/lib/demo-mode'
import { useAuthStore } from '../hooks/useAuthStore'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@vendacore.com', password: 'password123' },
  })

  const onSubmit = (data: LoginForm) => {
    login(
      { id: '1', name: 'Admin Demo', email: data.email, role: 'Admin', tenantId: 'tenant-1' },
      'mock-jwt-token'
    )
    navigate('/')
  }

  return (
    <div className="flex h-full min-h-full items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-2">V</div>
          <h1 className="text-2xl font-bold text-slate-800">ERP VendaCore</h1>
          <p className="text-sm text-slate-500">Acesse com suas credenciais de tenant</p>
          {isDemo && (
            <p className="mt-2 text-xs text-slate-400">
              Demo estática: use admin@vendacore.com / password123 (já preenchido)
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-medium hover:bg-blue-700 transition"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  )
}
