using VendaCore.Application.Abstractions;
using VendaCore.Application.Common;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Application.Features.Customers.Queries;

public record CustomerDto(
    Guid Id, string Name, string PersonType, string Document,
    string? Email, string? Phone, bool IsActive, DateTime CreatedAt);

public record GetCustomersQuery(
    string? Search = null,
    bool? IsActive = null,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedList<CustomerDto>>;

public class GetCustomersQueryHandler : IQueryHandler<GetCustomersQuery, PagedList<CustomerDto>>
{
    private readonly IRepository<Customer> _customers;

    public GetCustomersQueryHandler(IRepository<Customer> customers)
        => _customers = customers;

    public async Task<Result<PagedList<CustomerDto>>> Handle(GetCustomersQuery request, CancellationToken ct)
    {
        var all = await _customers.GetAllAsync(ct);

        var query = all.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(c =>
                c.Name.Contains(request.Search, StringComparison.OrdinalIgnoreCase) ||
                c.Document.Contains(request.Search));

        if (request.IsActive.HasValue)
            query = query.Where(c => c.IsActive == request.IsActive.Value);

        var total = query.Count();
        var items = query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c => new CustomerDto(
                c.Id, c.Name, c.PersonType.ToString(), c.Document,
                c.Email?.Value, c.Phone, c.IsActive, c.CreatedAt))
            .ToList();

        return Result<PagedList<CustomerDto>>.Success(
            new PagedList<CustomerDto>(items, total, request.Page, request.PageSize));
    }
}
