using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VendaCore.Domain.Interfaces;
using VendaCore.Infrastructure.Identity;
using VendaCore.Infrastructure.Persistence;

namespace VendaCore.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ITenantProvider, TenantProvider>();

        services.AddDbContext<AppDbContext>(opts =>
            opts.UseNpgsql(
                configuration.GetConnectionString("Default"),
                b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddStackExchangeRedisCache(opts =>
            opts.Configuration = configuration["Redis:Connection"]);

        return services;
    }
}
