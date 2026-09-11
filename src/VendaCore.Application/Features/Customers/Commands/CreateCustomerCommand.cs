using VendaCore.Application.Abstractions;
using VendaCore.Application.Behaviors;
using VendaCore.Application.Common;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Enums;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Application.Features.Customers.Commands;

[Transactional]
public record CreateCustomerCommand(
    string Name,
    PersonType PersonType,
    string Document,
    string? Email,
    string? Phone,
    string? Address) : ICommand<Guid>;

public class CreateCustomerCommandHandler : ICommandHandler<CreateCustomerCommand, Guid>
{
    private readonly IRepository<Customer> _customers;
    private readonly ITenantProvider _tenant;

    public CreateCustomerCommandHandler(IRepository<Customer> customers, ITenantProvider tenant)
    {
        _customers = customers;
        _tenant = tenant;
    }

    public async Task<Result<Guid>> Handle(CreateCustomerCommand request, CancellationToken ct)
    {
        var customer = Customer.Create(
            _tenant.TenantId,
            request.Name,
            request.PersonType,
            request.Document,
            request.Email,
            request.Phone,
            request.Address);

        await _customers.AddAsync(customer, ct);
        await _customers.SaveChangesAsync(ct);
        return Result<Guid>.Success(customer.Id);
    }
}
