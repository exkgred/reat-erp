using VendaCore.Application.Abstractions;
using VendaCore.Application.Behaviors;
using VendaCore.Application.Common;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Application.Features.Sales.Commands;

[Transactional]
public record ApproveSaleOrderCommand(Guid OrderId) : ICommand;

public class ApproveSaleOrderCommandHandler : ICommandHandler<ApproveSaleOrderCommand>
{
    private readonly IRepository<SaleOrder> _orders;

    public ApproveSaleOrderCommandHandler(IRepository<SaleOrder> orders) => _orders = orders;

    public async Task<Result> Handle(ApproveSaleOrderCommand request, CancellationToken ct)
    {
        var order = await _orders.GetByIdAsync(request.OrderId, ct);
        if (order is null) return Result.Failure("Pedido não encontrado.");

        order.Approve();
        _orders.Update(order);
        await _orders.SaveChangesAsync(ct);
        return Result.Success();
    }
}
