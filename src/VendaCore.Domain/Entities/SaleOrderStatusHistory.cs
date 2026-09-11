using VendaCore.Domain.Common;
using VendaCore.Domain.Enums;

namespace VendaCore.Domain.Entities;

public class SaleOrderStatusHistory : Entity
{
    public Guid SaleOrderId { get; private set; }
    public SaleOrderStatus Status { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public DateTime OccurredAt { get; private set; } = DateTime.UtcNow;

    private SaleOrderStatusHistory() { }

    public static SaleOrderStatusHistory Create(Guid saleOrderId, SaleOrderStatus status, string description)
        => new() { SaleOrderId = saleOrderId, Status = status, Description = description };
}
