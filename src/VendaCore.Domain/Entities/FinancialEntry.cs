using VendaCore.Domain.Common;
using VendaCore.Domain.Enums;
using VendaCore.Domain.ValueObjects;

namespace VendaCore.Domain.Entities;

public class FinancialEntry : Entity, IAggregateRoot
{
    public Guid TenantId { get; private set; }
    public FinancialEntryType Type { get; private set; }
    public FinancialEntryStatus Status { get; private set; } = FinancialEntryStatus.Pending;
    public string Description { get; private set; } = string.Empty;
    public Money Amount { get; private set; } = Money.Zero();
    public DateTime DueDate { get; private set; }
    public DateTime? PaidAt { get; private set; }
    public Guid? SaleOrderId { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private FinancialEntry() { }

    public static FinancialEntry Create(
        Guid tenantId, FinancialEntryType type, string description,
        decimal amount, DateTime dueDate, Guid? saleOrderId = null)
    {
        return new FinancialEntry
        {
            TenantId = tenantId,
            Type = type,
            Description = description.Trim(),
            Amount = new Money(amount),
            DueDate = dueDate,
            SaleOrderId = saleOrderId
        };
    }

    public void MarkAsPaid()
    {
        if (Status != FinancialEntryStatus.Pending)
            throw new DomainException("Apenas lançamentos pendentes podem ser marcados como pagos.");
        Status = FinancialEntryStatus.Paid;
        PaidAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status == FinancialEntryStatus.Paid)
            throw new DomainException("Lançamentos pagos não podem ser cancelados.");
        Status = FinancialEntryStatus.Canceled;
    }
}
