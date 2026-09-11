using VendaCore.Domain.Common;
using VendaCore.Domain.Enums;

namespace VendaCore.Domain.Entities;

public class StockMovement : Entity
{
    public Guid TenantId { get; private set; }
    public Guid ProductId { get; private set; }
    public StockMovementType Type { get; private set; }
    public int Quantity { get; private set; }
    public int QuantityBefore { get; private set; }
    public int QuantityAfter { get; private set; }
    public string? Reference { get; private set; }
    public string? Notes { get; private set; }
    public Guid CreatedByUserId { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private StockMovement() { }

    public static StockMovement Create(
        Guid tenantId, Guid productId, StockMovementType type,
        int quantity, int quantityBefore,
        Guid createdByUserId, string? reference = null, string? notes = null)
    {
        return new StockMovement
        {
            TenantId = tenantId,
            ProductId = productId,
            Type = type,
            Quantity = quantity,
            QuantityBefore = quantityBefore,
            QuantityAfter = type == StockMovementType.Out
                ? quantityBefore - quantity
                : quantityBefore + quantity,
            Reference = reference,
            Notes = notes,
            CreatedByUserId = createdByUserId
        };
    }
}
