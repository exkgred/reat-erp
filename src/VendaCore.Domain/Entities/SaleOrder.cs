using VendaCore.Domain.Common;
using VendaCore.Domain.Enums;
using VendaCore.Domain.Events;
using VendaCore.Domain.ValueObjects;

namespace VendaCore.Domain.Entities;

public class SaleOrder : Entity, IAggregateRoot
{
    public Guid TenantId { get; private set; }
    public string Number { get; private set; } = string.Empty;
    public Guid CustomerId { get; private set; }
    public SaleOrderStatus Status { get; private set; } = SaleOrderStatus.Draft;
    public string? Notes { get; private set; }
    public Money Total { get; private set; } = Money.Zero();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private readonly List<SaleOrderItem> _items = new();
    public IReadOnlyCollection<SaleOrderItem> Items => _items.AsReadOnly();

    private readonly List<SaleOrderStatusHistory> _statusHistory = new();
    public IReadOnlyCollection<SaleOrderStatusHistory> StatusHistory => _statusHistory.AsReadOnly();

    private SaleOrder() { }

    public static SaleOrder Create(Guid tenantId, Guid customerId, string number, string? notes = null)
    {
        if (tenantId == Guid.Empty) throw new DomainException("TenantId inválido.");
        if (customerId == Guid.Empty) throw new DomainException("Cliente inválido.");
        if (string.IsNullOrWhiteSpace(number)) throw new DomainException("Número do pedido é obrigatório.");

        var order = new SaleOrder
        {
            TenantId = tenantId,
            CustomerId = customerId,
            Number = number,
            Notes = notes
        };
        order.AddStatusHistory(SaleOrderStatus.Draft, "Pedido criado.");
        return order;
    }

    public void AddItem(Guid productId, int quantity, Money unitPrice, decimal discountPercent = 0)
    {
        if (Status != SaleOrderStatus.Draft)
            throw new DomainException("Só é possível alterar pedidos em rascunho.");
        if (quantity <= 0) throw new DomainException("Quantidade deve ser positiva.");

        var existing = _items.FirstOrDefault(i => i.ProductId == productId);
        if (existing is not null)
            _items.Remove(existing);

        _items.Add(SaleOrderItem.Create(Id, productId, quantity, unitPrice, discountPercent));
        RecalculateTotal();
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveItem(Guid productId)
    {
        if (Status != SaleOrderStatus.Draft)
            throw new DomainException("Só é possível alterar pedidos em rascunho.");
        var item = _items.FirstOrDefault(i => i.ProductId == productId)
            ?? throw new DomainException("Item não encontrado no pedido.");
        _items.Remove(item);
        RecalculateTotal();
    }

    public void Approve()
    {
        if (Status != SaleOrderStatus.Draft)
            throw new DomainException("Apenas pedidos em rascunho podem ser aprovados.");
        if (!_items.Any())
            throw new DomainException("Pedido sem itens não pode ser aprovado.");
        Status = SaleOrderStatus.Approved;
        AddStatusHistory(SaleOrderStatus.Approved, "Pedido aprovado.");
        AddDomainEvent(new SaleOrderApprovedEvent(Id, TenantId));
        UpdatedAt = DateTime.UtcNow;
    }

    public void Invoice()
    {
        if (Status != SaleOrderStatus.Approved)
            throw new DomainException("Apenas pedidos aprovados podem ser faturados.");
        Status = SaleOrderStatus.Invoiced;
        AddStatusHistory(SaleOrderStatus.Invoiced, "Pedido faturado.");
        AddDomainEvent(new SaleOrderInvoicedEvent(Id, TenantId, CustomerId, Total));
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel(string reason)
    {
        if (Status == SaleOrderStatus.Invoiced)
            throw new DomainException("Pedidos faturados não podem ser cancelados.");
        Status = SaleOrderStatus.Canceled;
        AddStatusHistory(SaleOrderStatus.Canceled, reason);
        UpdatedAt = DateTime.UtcNow;
    }

    private void RecalculateTotal() =>
        Total = new Money(_items.Sum(i => i.Subtotal.Amount));

    private void AddStatusHistory(SaleOrderStatus status, string description) =>
        _statusHistory.Add(SaleOrderStatusHistory.Create(Id, status, description));
}
