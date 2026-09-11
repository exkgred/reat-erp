using VendaCore.Domain.Common;
using VendaCore.Domain.Enums;
using VendaCore.Domain.ValueObjects;

namespace VendaCore.Domain.Entities;

public class Supplier : Entity, IAggregateRoot
{
    public Guid TenantId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public PersonType PersonType { get; private set; }
    public string Document { get; private set; } = string.Empty;
    public Email? Email { get; private set; }
    public string? Phone { get; private set; }
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private Supplier() { }

    public static Supplier Create(
        Guid tenantId, string name, PersonType personType,
        string document, string? email = null, string? phone = null)
    {
        if (tenantId == Guid.Empty) throw new DomainException("TenantId inválido.");
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Nome do fornecedor é obrigatório.");
        return new Supplier
        {
            TenantId = tenantId,
            Name = name.Trim(),
            PersonType = personType,
            Document = document.Trim(),
            Email = email is not null ? new Email(email) : null,
            Phone = phone
        };
    }

    public void Deactivate() => IsActive = false;
}
