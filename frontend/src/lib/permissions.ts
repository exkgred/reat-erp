import { useAuthStore } from '@/features/auth/hooks/useAuthStore'

export type Permission =
  | 'customers.read'
  | 'customers.write'
  | 'products.read'
  | 'products.write'
  | 'sales.create'
  | 'sales.approve'
  | 'sales.invoice'
  | 'stock.read'
  | 'stock.adjust'
  | 'finance.read'
  | 'finance.write'
  | 'reports.export'
  | 'users.manage'

const rolePermissions: Record<string, Permission[]> = {
  Admin: [
    'customers.read', 'customers.write',
    'products.read', 'products.write',
    'sales.create', 'sales.approve', 'sales.invoice',
    'stock.read', 'stock.adjust',
    'finance.read', 'finance.write',
    'reports.export', 'users.manage',
  ],
  Manager: [
    'customers.read', 'customers.write',
    'products.read', 'products.write',
    'sales.create', 'sales.approve', 'sales.invoice',
    'stock.read', 'stock.adjust',
    'finance.read', 'reports.export',
  ],
  Seller: ['customers.read', 'products.read', 'sales.create'],
  Stockkeeper: ['products.read', 'stock.read', 'stock.adjust'],
  Financial: ['finance.read', 'finance.write', 'reports.export'],
}

export function usePermission(permission: Permission): boolean {
  const role = useAuthStore((s) => s.user?.role)
  if (!role) return false
  return rolePermissions[role]?.includes(permission) ?? false
}
