using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendaCore.Application.Features.Sales.Commands;

namespace VendaCore.API.Endpoints;

[ApiController]
[Route("api/v1/sales-orders")]
[Authorize]
public class SaleOrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public SaleOrdersController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSaleOrderCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        if (result.IsFailure) return BadRequest(result.Errors);
        return Created($"/api/v1/sales-orders/{result.Value}", result.Value);
    }

    [HttpPost("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new ApproveSaleOrderCommand(id), ct);
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    [HttpPost("{id:guid}/invoice")]
    public async Task<IActionResult> Invoice(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new InvoiceSaleOrderCommand(id), ct);
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
