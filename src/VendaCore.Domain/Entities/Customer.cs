using VendaCore.Domain.Common;
using VendaCore.Domain.Enums;
using VendaCore.Domain.ValueObjects;

namespace VendaCore.Domain.Entities;

public class Customer : Entity, IAggregateRoot
{
    public Guid TenantId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public PersonType PersonType { get; private set; }
    public string Document { get; private set; } = string.Empty;
    public Email? Email { get; private set; }
    public string? Phone { get; private set; }
    public string? Address { get; private set; }
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private Customer() { }

    public static Customer Create(
        Guid tenantId,
        string name,
        PersonType personType,
        string document,
        string? email = null,
        string? phone = null,
        string? address = null)
    {
        if (tenantId == Guid.Empty) throw new DomainException("TenantId inválido.");
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Nome do cliente é obrigatório.");
        if (string.IsNullOrWhiteSpace(document)) throw new DomainException("Documento é obrigatório.");

        return new Customer
        {
            TenantId = tenantId,
            Name = name.Trim(),
            PersonType = personType,
            Document = document.Trim(),
            Email = email is not null ? new Email(email) : null,
            Phone = phone,
            Address = address
        };
    }

    public void Update(string name, string? email, string? phone, string? address)
    {
        Name = name.Trim();
        Email = email is not null ? new Email(email) : null;
        Phone = phone;
        Address = address;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() { IsActive = false; UpdatedAt = DateTime.UtcNow; }
    public void Activate() { IsActive = true; UpdatedAt = DateTime.UtcNow; }
}
