using VendaCore.Domain.Common;
using VendaCore.Domain.Events;
using VendaCore.Domain.ValueObjects;

namespace VendaCore.Domain.Entities;

public class Product : Entity, IAggregateRoot
{
    public Guid TenantId { get; private set; }
    public string Sku { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public Guid CategoryId { get; private set; }
    public Money Price { get; private set; } = Money.Zero();
    public Money Cost { get; private set; } = Money.Zero();
    public int StockQuantity { get; private set; }
    public int MinimumStock { get; private set; }
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private Product() { }

    public static Product Create(
        Guid tenantId,
        string sku,
        string name,
        Guid categoryId,
        decimal price,
        decimal cost,
        int minimumStock = 0,
        string? description = null)
    {
        if (tenantId == Guid.Empty) throw new DomainException("TenantId inválido.");
        if (string.IsNullOrWhiteSpace(sku)) throw new DomainException("SKU é obrigatório.");
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Nome do produto é obrigatório.");

        return new Product
        {
            TenantId = tenantId,
            Sku = sku.Trim().ToUpperInvariant(),
            Name = name.Trim(),
            Description = description,
            CategoryId = categoryId,
            Price = new Money(price),
            Cost = new Money(cost),
            MinimumStock = minimumStock
        };
    }

    public bool HasStock(int quantity) => StockQuantity >= quantity;
    public bool IsLowStock => StockQuantity <= MinimumStock;

    public void DebitStock(int quantity)
    {
        if (quantity <= 0) throw new DomainException("Quantidade deve ser positiva.");
        if (!HasStock(quantity)) throw new DomainException("Estoque insuficiente.");
        StockQuantity -= quantity;
        AddDomainEvent(new StockDebitedEvent(Id, quantity, StockQuantity));
    }

    public void CreditStock(int quantity)
    {
        if (quantity <= 0) throw new DomainException("Quantidade deve ser positiva.");
        StockQuantity += quantity;
    }

    public void AdjustStock(int newQuantity)
    {
        if (newQuantity < 0) throw new DomainException("Estoque não pode ser negativo.");
        StockQuantity = newQuantity;
    }

    public void Update(string name, string? description, decimal price, decimal cost, int minimumStock)
    {
        Name = name.Trim();
        Description = description;
        Price = new Money(price);
        Cost = new Money(cost);
        MinimumStock = minimumStock;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() { IsActive = false; UpdatedAt = DateTime.UtcNow; }
    public void Activate() { IsActive = true; UpdatedAt = DateTime.UtcNow; }
}
