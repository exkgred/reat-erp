using VendaCore.Application.Abstractions;
using VendaCore.Application.Behaviors;
using VendaCore.Application.Common;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Application.Features.Products.Commands;

[Transactional]
public record CreateProductCommand(
    string Sku,
    string Name,
    Guid CategoryId,
    decimal Price,
    decimal Cost,
    int MinimumStock,
    string? Description) : ICommand<Guid>;

public class CreateProductCommandHandler : ICommandHandler<CreateProductCommand, Guid>
{
    private readonly IRepository<Product> _products;
    private readonly ITenantProvider _tenant;

    public CreateProductCommandHandler(IRepository<Product> products, ITenantProvider tenant)
    {
        _products = products;
        _tenant = tenant;
    }

    public async Task<Result<Guid>> Handle(CreateProductCommand request, CancellationToken ct)
    {
        var product = Product.Create(
            _tenant.TenantId,
            request.Sku,
            request.Name,
            request.CategoryId,
            request.Price,
            request.Cost,
            request.MinimumStock,
            request.Description);

        await _products.AddAsync(product, ct);
        await _products.SaveChangesAsync(ct);
        return Result<Guid>.Success(product.Id);
    }
}
