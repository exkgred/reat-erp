using FluentValidation;

namespace VendaCore.Application.Features.Customers.Commands;

public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Document).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Email).EmailAddress().When(x => x.Email is not null);
        RuleFor(x => x.Phone).MaximumLength(20).When(x => x.Phone is not null);
    }
}
