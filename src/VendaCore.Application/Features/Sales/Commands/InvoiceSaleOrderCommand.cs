using VendaCore.Application.Abstractions;
using VendaCore.Application.Behaviors;
using VendaCore.Application.Common;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Application.Features.Sales.Commands;

[Transactional]
public record InvoiceSaleOrderCommand(Guid OrderId) : ICommand;

public class InvoiceSaleOrderCommandHandler : ICommandHandler<InvoiceSaleOrderCommand>
{
    private readonly IRepository<SaleOrder> _orders;
    private readonly IRepository<Product> _products;

    public InvoiceSaleOrderCommandHandler(IRepository<SaleOrder> orders, IRepository<Product> products)
    {
        _orders = orders;
        _products = products;
    }

    public async Task<Result> Handle(InvoiceSaleOrderCommand request, CancellationToken ct)
    {
        var order = await _orders.GetByIdAsync(request.OrderId, ct);
        if (order is null) return Result.Failure("Pedido não encontrado.");

        foreach (var item in order.Items)
        {
            var product = await _products.GetByIdAsync(item.ProductId, ct);
            if (product is null) return Result.Failure($"Produto {item.ProductId} não encontrado.");
            if (!product.HasStock(item.Quantity))
                return Result.Failure($"Estoque insuficiente para {product.Name}.");
            product.DebitStock(item.Quantity);
            _products.Update(product);
        }

        order.Invoice();
        _orders.Update(order);
        await _orders.SaveChangesAsync(ct);
        return Result.Success();
    }
}
