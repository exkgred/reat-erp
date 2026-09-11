using MediatR;

namespace VendaCore.Domain.Events;

public record StockDebitedEvent(Guid ProductId, int QuantityDebited, int RemainingStock) : INotification;
