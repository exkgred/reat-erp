using VendaCore.Domain.Common;
using VendaCore.Domain.ValueObjects;

namespace VendaCore.Domain.Entities;

public class SaleOrderItem : Entity
{
    public Guid SaleOrderId { get; private set; }
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public Money UnitPrice { get; private set; } = Money.Zero();
    public decimal DiscountPercent { get; private set; }
    public Money Subtotal { get; private set; } = Money.Zero();

    private SaleOrderItem() { }

    public static SaleOrderItem Create(
        Guid saleOrderId, Guid productId, int quantity, Money unitPrice, decimal discountPercent)
    {
        var discountedPrice = unitPrice.Multiply(1 - discountPercent / 100);
        return new SaleOrderItem
        {
            SaleOrderId = saleOrderId,
            ProductId = productId,
            Quantity = quantity,
            UnitPrice = unitPrice,
            DiscountPercent = discountPercent,
            Subtotal = discountedPrice.Multiply(quantity)
        };
    }
}
