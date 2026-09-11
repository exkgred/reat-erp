using VendaCore.Application.Abstractions;
using VendaCore.Application.Behaviors;
using VendaCore.Application.Common;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Application.Features.Sales.Commands;

public record SaleOrderItemDto(Guid ProductId, int Quantity, decimal Discount);

[Transactional]
public record CreateSaleOrderCommand(
    Guid CustomerId,
    IEnumerable<SaleOrderItemDto> Items,
    string? Notes) : ICommand<Guid>;

public class CreateSaleOrderCommandHandler : ICommandHandler<CreateSaleOrderCommand, Guid>
{
    private readonly IRepository<SaleOrder> _orders;
    private readonly IRepository<Product> _products;
    private readonly ITenantProvider _tenant;

    public CreateSaleOrderCommandHandler(
        IRepository<SaleOrder> orders,
        IRepository<Product> products,
        ITenantProvider tenant)
    {
        _orders = orders;
        _products = products;
        _tenant = tenant;
    }

    public async Task<Result<Guid>> Handle(CreateSaleOrderCommand request, CancellationToken ct)
    {
        var allOrders = await _orders.GetAllAsync(ct);
        var number = $"SO-{DateTime.UtcNow.Year}-{(allOrders.Count + 1):D5}";

        var order = SaleOrder.Create(_tenant.TenantId, request.CustomerId, number, request.Notes);

        foreach (var item in request.Items)
        {
            var product = await _products.GetByIdAsync(item.ProductId, ct);
            if (product is null) return Result<Guid>.Failure($"Produto {item.ProductId} não encontrado.");

            order.AddItem(product.Id, item.Quantity, product.Price, item.Discount);
        }

        await _orders.AddAsync(order, ct);
        await _orders.SaveChangesAsync(ct);
        return Result<Guid>.Success(order.Id);
    }
}
