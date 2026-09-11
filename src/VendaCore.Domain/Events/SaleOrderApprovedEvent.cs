using MediatR;

namespace VendaCore.Domain.Events;

public record SaleOrderApprovedEvent(Guid SaleOrderId, Guid TenantId) : INotification;
