using VendaCore.Domain.Common;

namespace VendaCore.Domain.Entities;

public class Tenant : Entity, IAggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private Tenant() { }

    public static Tenant Create(string name, string slug)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Nome do tenant é obrigatório.");
        if (string.IsNullOrWhiteSpace(slug)) throw new DomainException("Slug do tenant é obrigatório.");
        return new Tenant { Name = name.Trim(), Slug = slug.ToLowerInvariant().Trim() };
    }

    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;
}
