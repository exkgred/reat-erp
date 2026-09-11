using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VendaCore.API.Endpoints;

[ApiController]
[Route("api/v1/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        return Ok(new
        {
            totalSales = 42,
            totalCustomers = 128,
            totalProducts = 356,
            pendingOrders = 7,
            revenueThisMonth = 89450.00
        });
    }

    [HttpGet("sales-chart")]
    public IActionResult GetSalesChart()
    {
        return Ok(new[]
        {
            new { date = "Seg", total = 12000 },
            new { date = "Ter", total = 18000 },
            new { date = "Qua", total = 14500 },
            new { date = "Qui", total = 22000 },
            new { date = "Sex", total = 25000 },
            new { date = "Sab", total = 8000 },
            new { date = "Dom", total = 4000 }
        });
    }
}
