using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendaCore.Application.Features.Customers.Commands;
using VendaCore.Application.Features.Customers.Queries;

namespace VendaCore.API.Endpoints;

[ApiController]
[Route("api/v1/customers")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await _mediator.Send(new GetCustomersQuery(search, isActive, page, pageSize), ct);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateCustomerCommand command,
        CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        if (result.IsFailure) return BadRequest(result.Errors);
        return CreatedAtAction(nameof(GetAll), new { id = result.Value }, result.Value);
    }
}
