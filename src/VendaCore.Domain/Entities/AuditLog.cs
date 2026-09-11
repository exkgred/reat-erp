using VendaCore.Domain.Common;

namespace VendaCore.Domain.Entities;

public class AuditLog : Entity
{
    public Guid TenantId { get; private set; }
    public Guid UserId { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public string EntityType { get; private set; } = string.Empty;
    public Guid EntityId { get; private set; }
    public string? OldValues { get; private set; }
    public string? NewValues { get; private set; }
    public string? IpAddress { get; private set; }
    public DateTime OccurredAt { get; private set; } = DateTime.UtcNow;

    private AuditLog() { }

    public static AuditLog Create(
        Guid tenantId, Guid userId, string action,
        string entityType, Guid entityId,
        string? oldValues = null, string? newValues = null, string? ipAddress = null)
    {
        return new AuditLog
        {
            TenantId = tenantId,
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = ipAddress
        };
    }
}
