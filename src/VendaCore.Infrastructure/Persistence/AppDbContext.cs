using Microsoft.EntityFrameworkCore;
using VendaCore.Domain.Entities;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    private readonly ITenantProvider _tenant;

    public AppDbContext(DbContextOptions<AppDbContext> options, ITenantProvider tenant)
        : base(options)
    {
        _tenant = tenant;
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<SaleOrder> SaleOrders => Set<SaleOrder>();
    public DbSet<SaleOrderItem> SaleOrderItems => Set<SaleOrderItem>();
    public DbSet<SaleOrderStatusHistory> SaleOrderStatusHistories => Set<SaleOrderStatusHistory>();
    public DbSet<FinancialEntry> FinancialEntries => Set<FinancialEntry>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.Entity<Customer>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);
        modelBuilder.Entity<Supplier>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);
        modelBuilder.Entity<Category>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);
        modelBuilder.Entity<Product>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);
        modelBuilder.Entity<StockMovement>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);
        modelBuilder.Entity<SaleOrder>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);
        modelBuilder.Entity<FinancialEntry>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);
        modelBuilder.Entity<AuditLog>().HasQueryFilter(e => e.TenantId == _tenant.TenantId);

        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var domainEntities = ChangeTracker.Entries<Domain.Common.Entity>()
            .Where(e => e.Entity.DomainEvents.Any())
            .ToList();

        var domainEvents = domainEntities
            .SelectMany(e => e.Entity.DomainEvents)
            .ToList();

        domainEntities.ForEach(e => e.Entity.ClearDomainEvents());

        var result = await base.SaveChangesAsync(ct);
        return result;
    }
}
