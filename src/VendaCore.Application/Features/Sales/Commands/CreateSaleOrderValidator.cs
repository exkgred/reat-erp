using FluentValidation;

namespace VendaCore.Application.Features.Sales.Commands;

public class CreateSaleOrderCommandValidator : AbstractValidator<CreateSaleOrderCommand>
{
    public CreateSaleOrderCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Items).NotEmpty().WithMessage("O pedido deve ter pelo menos um item.");
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId).NotEmpty();
            item.RuleFor(i => i.Quantity).GreaterThan(0);
            item.RuleFor(i => i.Discount).InclusiveBetween(0, 100);
        });
    }
}
