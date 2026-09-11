using MediatR;
using VendaCore.Domain.ValueObjects;

namespace VendaCore.Domain.Events;

public record SaleOrderInvoicedEvent(
    Guid SaleOrderId,
    Guid TenantId,
    Guid CustomerId,
    Money Total) : INotification;
