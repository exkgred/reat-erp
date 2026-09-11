namespace VendaCore.Domain.Interfaces;

public interface ITenantProvider
{
    Guid TenantId { get; }
    Guid UserId { get; }
    string UserEmail { get; }
    string UserRole { get; }
}
