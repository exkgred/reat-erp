using VendaCore.Domain.Interfaces;

namespace VendaCore.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    public UnitOfWork(AppDbContext context) => _context = context;
    public Task<int> CommitAsync(CancellationToken ct = default) => _context.SaveChangesAsync(ct);
}
