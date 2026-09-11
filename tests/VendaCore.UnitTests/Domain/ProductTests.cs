using FluentAssertions;
using VendaCore.Domain.Common;
using VendaCore.Domain.Entities;
using Xunit;

namespace VendaCore.UnitTests.Domain;

public class ProductTests
{
    private static Product CreateProduct(int stock = 10) =>
        Product.Create(Guid.NewGuid(), "SKU-001", "Test Product",
            Guid.NewGuid(), 100m, 50m, minimumStock: 2);

    [Fact]
    public void Create_WithValidData_ShouldSucceed()
    {
        var product = CreateProduct();
        product.Sku.Should().Be("SKU-001");
        product.IsActive.Should().BeTrue();
    }

    [Fact]
    public void DebitStock_WithSufficientStock_ShouldDecrease()
    {
        var product = CreateProduct();
        product.CreditStock(10);
        product.DebitStock(5);
        product.StockQuantity.Should().Be(5);
    }

    [Fact]
    public void DebitStock_WithInsufficientStock_ShouldThrowDomainException()
    {
        var product = CreateProduct();
        var act = () => product.DebitStock(999);
        act.Should().Throw<DomainException>().WithMessage("*Estoque insuficiente*");
    }

    [Fact]
    public void DebitStock_ShouldAddDomainEvent()
    {
        var product = CreateProduct();
        product.CreditStock(10);
        product.DebitStock(3);
        product.DomainEvents.Should().ContainSingle();
    }

    [Fact]
    public void Create_WithEmptySku_ShouldThrowDomainException()
    {
        var act = () => Product.Create(Guid.NewGuid(), "", "Test", Guid.NewGuid(), 10m, 5m);
        act.Should().Throw<DomainException>();
    }
}
