using FluentAssertions;
using VendaCore.Domain.Common;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Enums;
using VendaCore.Domain.Events;
using VendaCore.Domain.ValueObjects;
using Xunit;

namespace VendaCore.UnitTests.Domain;

public class SaleOrderTests
{
    private static SaleOrder CreateOrder() =>
        SaleOrder.Create(Guid.NewGuid(), Guid.NewGuid(), "SO-2026-00001");

    [Fact]
    public void Create_ShouldBeInDraftStatus()
    {
        var order = CreateOrder();
        order.Status.Should().Be(SaleOrderStatus.Draft);
        order.Items.Should().BeEmpty();
    }

    [Fact]
    public void AddItem_ShouldIncreaseTotal()
    {
        var order = CreateOrder();
        var productId = Guid.NewGuid();
        order.AddItem(productId, 2, new Money(100m), 0);
        order.Total.Amount.Should().Be(200m);
    }

    [Fact]
    public void AddItem_WithDiscount_ShouldApplyDiscount()
    {
        var order = CreateOrder();
        order.AddItem(Guid.NewGuid(), 1, new Money(100m), 10);
        order.Total.Amount.Should().Be(90m);
    }

    [Fact]
    public void Approve_WithItems_ShouldChangeStatus()
    {
        var order = CreateOrder();
        order.AddItem(Guid.NewGuid(), 1, new Money(50m));
        order.Approve();
        order.Status.Should().Be(SaleOrderStatus.Approved);
    }

    [Fact]
    public void Approve_WithoutItems_ShouldThrow()
    {
        var order = CreateOrder();
        var act = () => order.Approve();
        act.Should().Throw<DomainException>().WithMessage("*sem itens*");
    }

    [Fact]
    public void Approve_ShouldRaiseDomainEvent()
    {
        var order = CreateOrder();
        order.AddItem(Guid.NewGuid(), 1, new Money(50m));
        order.Approve();
        order.DomainEvents.Should().ContainSingle(e => e is SaleOrderApprovedEvent);
    }

    [Fact]
    public void Invoice_FromApprovedOrder_ShouldRaiseInvoicedEvent()
    {
        var order = CreateOrder();
        order.AddItem(Guid.NewGuid(), 1, new Money(100m));
        order.Approve();
        order.Invoice();
        order.Status.Should().Be(SaleOrderStatus.Invoiced);
        order.DomainEvents.Should().Contain(e => e is SaleOrderInvoicedEvent);
    }

    [Fact]
    public void Cancel_InvoicedOrder_ShouldThrow()
    {
        var order = CreateOrder();
        order.AddItem(Guid.NewGuid(), 1, new Money(100m));
        order.Approve();
        order.Invoice();
        var act = () => order.Cancel("motivo");
        act.Should().Throw<DomainException>();
    }
}
