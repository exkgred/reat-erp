import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PersonType = 'PF' | 'PJ'
export type ActiveStatus = 'Ativo' | 'Inativo'
export type OrderStatus = 'Draft' | 'Approved' | 'Invoiced' | 'Canceled'
export type MovementType = 'Entrada' | 'Saída' | 'Ajuste'
export type FinanceType = 'Receber' | 'Pagar'
export type FinanceStatus = 'Pendente' | 'Pago' | 'Cancelado'

export interface Customer {
  id: string
  name: string
  type: PersonType
  doc: string
  email: string
  phone: string
  address: string
  status: ActiveStatus
}

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  description: string
  price: number
  cost: number
  stock: number
  min: number
  status: ActiveStatus
}

export interface SaleItem {
  productId: string
  sku: string
  name: string
  qty: number
  price: number
}

export interface SaleOrder {
  id: string
  number: string
  customerId: string
  customer: string
  items: SaleItem[]
  total: number
  status: OrderStatus
  createdAt: string
  notes: string
}

export interface StockMovement {
  id: string
  date: string
  type: MovementType
  qty: number
  before: number
  after: number
  ref: string
  productId: string
  product: string
}

export interface FinanceEntry {
  id: string
  desc: string
  type: FinanceType
  amount: number
  due: string
  status: FinanceStatus
  saleOrderId?: string
}

export interface CustomerInput {
  name: string
  type: PersonType
  doc: string
  email: string
  phone: string
  address: string
}

export interface ProductInput {
  sku: string
  name: string
  category: string
  description: string
  price: number
  cost: number
  min: number
  initialStock?: number
}

export interface SaleInput {
  customerId: string
  notes: string
  items: Array<{ productId: string; qty: number; price: number }>
}

export interface StockInput {
  productId: string
  type: 'Entrada' | 'Ajuste'
  qty: number
  ref: string
}

export interface FinanceInput {
  desc: string
  type: FinanceType
  amount: number
  due: string
}

type ActionResult = { ok: true } | { ok: false; error: string }

interface ErpState {
  customers: Customer[]
  products: Product[]
  orders: SaleOrder[]
  movements: StockMovement[]
  finance: FinanceEntry[]
  nextOrderSeq: number
  addCustomer: (input: CustomerInput) => ActionResult
  updateCustomer: (id: string, input: CustomerInput) => ActionResult
  toggleCustomer: (id: string) => ActionResult
  removeCustomer: (id: string) => ActionResult
  addProduct: (input: ProductInput) => ActionResult
  updateProduct: (id: string, input: ProductInput) => ActionResult
  toggleProduct: (id: string) => ActionResult
  removeProduct: (id: string) => ActionResult
  addOrder: (input: SaleInput) => ActionResult
  approveOrder: (id: string) => ActionResult
  invoiceOrder: (id: string) => ActionResult
  cancelOrder: (id: string) => ActionResult
  addStockMovement: (input: StockInput) => ActionResult
  addFinance: (input: FinanceInput) => ActionResult
  markFinancePaid: (id: string) => ActionResult
  cancelFinance: (id: string) => ActionResult
  resetDemo: () => void
}

function uid(): string {
  return crypto.randomUUID()
}

function nowIso(): string {
  return new Date().toISOString()
}

function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function daysAgo(days: number, hours = 12): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hours, 30, 0, 0)
  return date.toISOString()
}

function required(value: string, label: string): string | null {
  if (!value.trim()) return `${label} é obrigatório.`
  return null
}

export const PRODUCT_CATEGORIES = ['Informática', 'Monitores', 'Periféricos', 'Serviços', 'Outros']

function seed(): Omit<
  ErpState,
  | 'addCustomer'
  | 'updateCustomer'
  | 'toggleCustomer'
  | 'removeCustomer'
  | 'addProduct'
  | 'updateProduct'
  | 'toggleProduct'
  | 'removeProduct'
  | 'addOrder'
  | 'approveOrder'
  | 'invoiceOrder'
  | 'cancelOrder'
  | 'addStockMovement'
  | 'addFinance'
  | 'markFinancePaid'
  | 'cancelFinance'
  | 'resetDemo'
> {
  return {
    customers: [
      {
        id: 'cust-1',
        name: 'Tech Solutions Ltda',
        type: 'PJ',
        doc: '12.345.678/0001-90',
        email: 'contato@techsolutions.com',
        phone: '(11) 98765-4321',
        address: 'Av. Paulista, 1000 — São Paulo/SP',
        status: 'Ativo',
      },
      {
        id: 'cust-2',
        name: 'Carlos Eduardo Santos',
        type: 'PF',
        doc: '123.456.789-00',
        email: 'carlos.santos@email.com',
        phone: '(21) 97654-3210',
        address: 'Rua das Laranjeiras, 50 — Rio de Janeiro/RJ',
        status: 'Ativo',
      },
      {
        id: 'cust-3',
        name: 'Indústria Metalúrgica Sul',
        type: 'PJ',
        doc: '98.765.432/0001-11',
        email: 'vendas@metalsul.com.br',
        phone: '(41) 3344-5566',
        address: 'Rua Industrial, 200 — Curitiba/PR',
        status: 'Ativo',
      },
    ],
    products: [
      {
        id: 'prod-1',
        sku: 'PROD-001',
        name: 'Notebook Pro 15',
        category: 'Informática',
        description: 'Notebook 15" para uso corporativo',
        price: 4500,
        cost: 3200,
        stock: 15,
        min: 5,
        status: 'Ativo',
      },
      {
        id: 'prod-2',
        sku: 'PROD-002',
        name: 'Monitor 27 4K',
        category: 'Monitores',
        description: 'Monitor 27 polegadas 4K',
        price: 2100,
        cost: 1400,
        stock: 8,
        min: 3,
        status: 'Ativo',
      },
      {
        id: 'prod-3',
        sku: 'PROD-003',
        name: 'Teclado Mecânico RGB',
        category: 'Periféricos',
        description: 'Teclado mecânico com iluminação RGB',
        price: 350,
        cost: 180,
        stock: 30,
        min: 10,
        status: 'Ativo',
      },
    ],
    orders: [
      {
        id: 'so-42',
        number: 'SO-2026-00042',
        customerId: 'cust-1',
        customer: 'Tech Solutions Ltda',
        items: [{ productId: 'prod-1', sku: 'PROD-001', name: 'Notebook Pro 15', qty: 2, price: 4500 }],
        total: 9000,
        status: 'Draft',
        createdAt: daysAgo(0, 10),
        notes: 'Aguardando confirmação do cliente',
      },
      {
        id: 'so-41',
        number: 'SO-2026-00041',
        customerId: 'cust-2',
        customer: 'Carlos Eduardo Santos',
        items: [{ productId: 'prod-2', sku: 'PROD-002', name: 'Monitor 27 4K', qty: 1, price: 2100 }],
        total: 2100,
        status: 'Approved',
        createdAt: daysAgo(1, 15),
        notes: '',
      },
      {
        id: 'so-40',
        number: 'SO-2026-00040',
        customerId: 'cust-3',
        customer: 'Indústria Metalúrgica Sul',
        items: [
          { productId: 'prod-1', sku: 'PROD-001', name: 'Notebook Pro 15', qty: 2, price: 4500 },
          { productId: 'prod-3', sku: 'PROD-003', name: 'Teclado Mecânico RGB', qty: 18, price: 350 },
        ],
        total: 15300,
        status: 'Invoiced',
        createdAt: daysAgo(2, 9),
        notes: '',
      },
    ],
    movements: [
      {
        id: 'mov-1',
        date: daysAgo(0, 10),
        type: 'Saída',
        qty: 2,
        before: 17,
        after: 15,
        ref: 'SO-2026-00040',
        productId: 'prod-1',
        product: 'Notebook Pro 15',
      },
      {
        id: 'mov-2',
        date: daysAgo(1, 15),
        type: 'Entrada',
        qty: 10,
        before: 20,
        after: 30,
        ref: 'NF Fornecedor 4501',
        productId: 'prod-3',
        product: 'Teclado Mecânico RGB',
      },
    ],
    finance: [
      {
        id: 'fin-1',
        desc: 'Faturamento Pedido SO-2026-00040',
        type: 'Receber',
        amount: 15300,
        due: daysFromNow(14),
        status: 'Pendente',
        saleOrderId: 'so-40',
      },
      {
        id: 'fin-2',
        desc: 'Fornecedor Dell Computadores',
        type: 'Pagar',
        amount: 8400,
        due: daysFromNow(4),
        status: 'Pago',
      },
    ],
    nextOrderSeq: 43,
  }
}

export const useErpStore = create<ErpState>()(
  persist(
    (set, get) => ({
      ...seed(),

      addCustomer: (input) => {
        const nameError = required(input.name, 'Nome')
        const docError = required(input.doc, 'Documento')
        if (nameError) return { ok: false, error: nameError }
        if (docError) return { ok: false, error: docError }
        if (get().customers.some((item) => item.doc === input.doc.trim())) {
          return { ok: false, error: 'Já existe cliente com este documento.' }
        }
        const customer: Customer = {
          id: uid(),
          name: input.name.trim(),
          type: input.type,
          doc: input.doc.trim(),
          email: input.email.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          status: 'Ativo',
        }
        set({ customers: [customer, ...get().customers] })
        return { ok: true }
      },

      updateCustomer: (id, input) => {
        const nameError = required(input.name, 'Nome')
        const docError = required(input.doc, 'Documento')
        if (nameError) return { ok: false, error: nameError }
        if (docError) return { ok: false, error: docError }
        if (get().customers.some((item) => item.id !== id && item.doc === input.doc.trim())) {
          return { ok: false, error: 'Já existe cliente com este documento.' }
        }
        set({
          customers: get().customers.map((item) =>
            item.id === id
              ? {
                  ...item,
                  name: input.name.trim(),
                  type: input.type,
                  doc: input.doc.trim(),
                  email: input.email.trim(),
                  phone: input.phone.trim(),
                  address: input.address.trim(),
                }
              : item,
          ),
          orders: get().orders.map((order) =>
            order.customerId === id ? { ...order, customer: input.name.trim() } : order,
          ),
        })
        return { ok: true }
      },

      toggleCustomer: (id) => {
        set({
          customers: get().customers.map((item) =>
            item.id === id ? { ...item, status: item.status === 'Ativo' ? 'Inativo' : 'Ativo' } : item,
          ),
        })
        return { ok: true }
      },

      removeCustomer: (id) => {
        if (get().orders.some((order) => order.customerId === id)) {
          return { ok: false, error: 'Cliente vinculado a pedidos. Inative em vez de excluir.' }
        }
        set({ customers: get().customers.filter((item) => item.id !== id) })
        return { ok: true }
      },

      addProduct: (input) => {
        const skuError = required(input.sku, 'SKU')
        const nameError = required(input.name, 'Nome')
        if (skuError) return { ok: false, error: skuError }
        if (nameError) return { ok: false, error: nameError }
        if (input.price < 0 || input.cost < 0) return { ok: false, error: 'Preço e custo não podem ser negativos.' }
        const sku = input.sku.trim().toUpperCase()
        if (get().products.some((item) => item.sku === sku)) {
          return { ok: false, error: 'Já existe produto com este SKU.' }
        }
        const initialStock = Math.max(0, input.initialStock ?? 0)
        const product: Product = {
          id: uid(),
          sku,
          name: input.name.trim(),
          category: input.category.trim() || 'Outros',
          description: input.description.trim(),
          price: input.price,
          cost: input.cost,
          stock: initialStock,
          min: Math.max(0, input.min),
          status: 'Ativo',
        }
        const movements = [...get().movements]
        if (initialStock > 0) {
          movements.unshift({
            id: uid(),
            date: nowIso(),
            type: 'Entrada',
            qty: initialStock,
            before: 0,
            after: initialStock,
            ref: 'Saldo inicial',
            productId: product.id,
            product: product.name,
          })
        }
        set({ products: [product, ...get().products], movements })
        return { ok: true }
      },

      updateProduct: (id, input) => {
        const skuError = required(input.sku, 'SKU')
        const nameError = required(input.name, 'Nome')
        if (skuError) return { ok: false, error: skuError }
        if (nameError) return { ok: false, error: nameError }
        const sku = input.sku.trim().toUpperCase()
        if (get().products.some((item) => item.id !== id && item.sku === sku)) {
          return { ok: false, error: 'Já existe produto com este SKU.' }
        }
        set({
          products: get().products.map((item) =>
            item.id === id
              ? {
                  ...item,
                  sku,
                  name: input.name.trim(),
                  category: input.category.trim() || 'Outros',
                  description: input.description.trim(),
                  price: input.price,
                  cost: input.cost,
                  min: Math.max(0, input.min),
                }
              : item,
          ),
        })
        return { ok: true }
      },

      toggleProduct: (id) => {
        set({
          products: get().products.map((item) =>
            item.id === id ? { ...item, status: item.status === 'Ativo' ? 'Inativo' : 'Ativo' } : item,
          ),
        })
        return { ok: true }
      },

      removeProduct: (id) => {
        if (get().orders.some((order) => order.items.some((item) => item.productId === id))) {
          return { ok: false, error: 'Produto usado em pedidos. Inative em vez de excluir.' }
        }
        set({
          products: get().products.filter((item) => item.id !== id),
          movements: get().movements.filter((item) => item.productId !== id),
        })
        return { ok: true }
      },

      addOrder: (input) => {
        const customer = get().customers.find((item) => item.id === input.customerId)
        if (!customer) return { ok: false, error: 'Selecione um cliente.' }
        if (customer.status !== 'Ativo') return { ok: false, error: 'Cliente inativo não pode receber pedido.' }
        if (input.items.length === 0) return { ok: false, error: 'Inclua ao menos um item no pedido.' }
        const items: SaleItem[] = []
        for (const line of input.items) {
          const product = get().products.find((item) => item.id === line.productId)
          if (!product || product.status !== 'Ativo') {
            return { ok: false, error: 'Produto inválido ou inativo.' }
          }
          if (line.qty <= 0) return { ok: false, error: 'Quantidade deve ser positiva.' }
          items.push({
            productId: product.id,
            sku: product.sku,
            name: product.name,
            qty: line.qty,
            price: line.price,
          })
        }
        const seq = get().nextOrderSeq
        const order: SaleOrder = {
          id: uid(),
          number: `SO-2026-${String(seq).padStart(5, '0')}`,
          customerId: customer.id,
          customer: customer.name,
          items,
          total: items.reduce((sum, item) => sum + item.qty * item.price, 0),
          status: 'Draft',
          createdAt: nowIso(),
          notes: input.notes.trim(),
        }
        set({ nextOrderSeq: seq + 1, orders: [order, ...get().orders] })
        return { ok: true }
      },

      approveOrder: (id) => {
        const order = get().orders.find((item) => item.id === id)
        if (!order) return { ok: false, error: 'Pedido não encontrado.' }
        if (order.status !== 'Draft') return { ok: false, error: 'Apenas pedidos em rascunho podem ser aprovados.' }
        if (order.items.length === 0) return { ok: false, error: 'Pedido sem itens não pode ser aprovado.' }
        set({
          orders: get().orders.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item)),
        })
        return { ok: true }
      },

      invoiceOrder: (id) => {
        const order = get().orders.find((item) => item.id === id)
        if (!order) return { ok: false, error: 'Pedido não encontrado.' }
        if (order.status !== 'Approved') return { ok: false, error: 'Apenas pedidos aprovados podem ser faturados.' }

        for (const line of order.items) {
          const product = get().products.find((item) => item.id === line.productId)
          if (!product) return { ok: false, error: `Produto ${line.name} não encontrado.` }
          if (product.stock < line.qty) {
            return { ok: false, error: `Estoque insuficiente para ${product.name}.` }
          }
        }

        const movements = [...get().movements]
        const products = get().products.map((product) => {
          const line = order.items.find((item) => item.productId === product.id)
          if (!line) return product
          const before = product.stock
          const after = before - line.qty
          movements.unshift({
            id: uid(),
            date: nowIso(),
            type: 'Saída',
            qty: line.qty,
            before,
            after,
            ref: order.number,
            productId: product.id,
            product: product.name,
          })
          return { ...product, stock: after }
        })

        const entry: FinanceEntry = {
          id: uid(),
          desc: `Faturamento Pedido ${order.number}`,
          type: 'Receber',
          amount: order.total,
          due: daysFromNow(14),
          status: 'Pendente',
          saleOrderId: order.id,
        }

        set({
          products,
          movements,
          finance: [entry, ...get().finance],
          orders: get().orders.map((item) => (item.id === id ? { ...item, status: 'Invoiced' } : item)),
        })
        return { ok: true }
      },

      cancelOrder: (id) => {
        const order = get().orders.find((item) => item.id === id)
        if (!order) return { ok: false, error: 'Pedido não encontrado.' }
        if (order.status === 'Invoiced') return { ok: false, error: 'Pedidos faturados não podem ser cancelados.' }
        set({
          orders: get().orders.map((item) => (item.id === id ? { ...item, status: 'Canceled' } : item)),
        })
        return { ok: true }
      },

      addStockMovement: (input) => {
        const product = get().products.find((item) => item.id === input.productId)
        if (!product) return { ok: false, error: 'Selecione um produto.' }
        if (input.qty < 0) return { ok: false, error: 'Quantidade inválida.' }
        if (input.type === 'Entrada' && input.qty <= 0) return { ok: false, error: 'Quantidade deve ser positiva.' }

        const before = product.stock
        const after = input.type === 'Ajuste' ? input.qty : before + input.qty
        if (after < 0) return { ok: false, error: 'Estoque não pode ficar negativo.' }

        const movement: StockMovement = {
          id: uid(),
          date: nowIso(),
          type: input.type,
          qty: input.type === 'Ajuste' ? Math.abs(after - before) : input.qty,
          before,
          after,
          ref: input.ref.trim() || (input.type === 'Ajuste' ? 'Ajuste manual' : 'Entrada de estoque'),
          productId: product.id,
          product: product.name,
        }

        set({
          products: get().products.map((item) => (item.id === product.id ? { ...item, stock: after } : item)),
          movements: [movement, ...get().movements],
        })
        return { ok: true }
      },

      addFinance: (input) => {
        const descError = required(input.desc, 'Descrição')
        if (descError) return { ok: false, error: descError }
        if (input.amount <= 0) return { ok: false, error: 'Valor deve ser positivo.' }
        if (!input.due) return { ok: false, error: 'Vencimento é obrigatório.' }
        const entry: FinanceEntry = {
          id: uid(),
          desc: input.desc.trim(),
          type: input.type,
          amount: input.amount,
          due: new Date(input.due).toISOString(),
          status: 'Pendente',
        }
        set({ finance: [entry, ...get().finance] })
        return { ok: true }
      },

      markFinancePaid: (id) => {
        const entry = get().finance.find((item) => item.id === id)
        if (!entry) return { ok: false, error: 'Lançamento não encontrado.' }
        if (entry.status !== 'Pendente') return { ok: false, error: 'Apenas lançamentos pendentes podem ser pagos.' }
        set({
          finance: get().finance.map((item) => (item.id === id ? { ...item, status: 'Pago' } : item)),
        })
        return { ok: true }
      },

      cancelFinance: (id) => {
        const entry = get().finance.find((item) => item.id === id)
        if (!entry) return { ok: false, error: 'Lançamento não encontrado.' }
        if (entry.status === 'Pago') return { ok: false, error: 'Lançamentos pagos não podem ser cancelados.' }
        set({
          finance: get().finance.map((item) => (item.id === id ? { ...item, status: 'Cancelado' } : item)),
        })
        return { ok: true }
      },

      resetDemo: () => set(seed()),
    }),
    { name: 'vendacore-erp-v1' },
  ),
)

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function useDashboardMetrics() {
  const customers = useErpStore((state) => state.customers)
  const products = useErpStore((state) => state.products)
  const orders = useErpStore((state) => state.orders)

  const invoiced = orders.filter((order) => order.status === 'Invoiced')
  const now = new Date()
  const monthRevenue = invoiced
    .filter((order) => {
      const date = new Date(order.createdAt)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((sum, order) => sum + order.total, 0)

  const chart = Array.from({ length: 7 }, (_, index) => {
    const day = new Date()
    day.setDate(now.getDate() - (6 - index))
    day.setHours(0, 0, 0, 0)
    const next = new Date(day)
    next.setDate(day.getDate() + 1)
    const total = invoiced
      .filter((order) => {
        const date = new Date(order.createdAt)
        return date >= day && date < next
      })
      .reduce((sum, order) => sum + order.total, 0)
    return { date: WEEKDAYS[day.getDay()], total }
  })

  return {
    revenueThisMonth: monthRevenue,
    totalSales: invoiced.length,
    totalCustomers: customers.filter((item) => item.status === 'Ativo').length,
    totalProducts: products.filter((item) => item.status === 'Ativo').length,
    pendingOrders: orders.filter((order) => order.status === 'Draft' || order.status === 'Approved').length,
    chart,
  }
}
