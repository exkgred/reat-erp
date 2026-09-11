using VendaCore.Domain.Common;

namespace VendaCore.Domain.Entities;

public class Category : Entity, IAggregateRoot
{
    public Guid TenantId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Category() { }

    public static Category Create(Guid tenantId, string name, string? description = null)
    {
        if (tenantId == Guid.Empty) throw new DomainException("TenantId inválido.");
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Nome da categoria é obrigatório.");
        return new Category { TenantId = tenantId, Name = name.Trim(), Description = description };
    }

    public void Update(string name, string? description)
    {
        Name = name.Trim();
        Description = description;
    }

    public void Deactivate() => IsActive = false;
}
