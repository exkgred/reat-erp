using Microsoft.AspNetCore.Mvc;

namespace VendaCore.API.Endpoints;

public record LoginDto(string Email, string Password);
public record AuthResponse(string AccessToken, string RefreshToken, object User);

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        return Ok(new AuthResponse(
            "fake-jwt-token",
            "fake-refresh-token",
            new { id = Guid.NewGuid(), name = "Admin", email = dto.Email, role = "Admin", tenantId = Guid.NewGuid() }
        ));
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new { id = Guid.NewGuid(), name = "Admin", email = "admin@vendacore.com", role = "Admin" });
    }
}
