using MediatR;
using Microsoft.Extensions.Logging;
using VendaCore.Domain.Interfaces;

namespace VendaCore.Application.Behaviors;

[AttributeUsage(AttributeTargets.Class)]
public class TransactionalAttribute : Attribute { }

public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IUnitOfWork _uow;
    private readonly ILogger<TransactionBehavior<TRequest, TResponse>> _logger;

    public TransactionBehavior(IUnitOfWork uow, ILogger<TransactionBehavior<TRequest, TResponse>> logger)
    {
        _uow = uow;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!typeof(TRequest).IsDefined(typeof(TransactionalAttribute), false))
            return await next();

        _logger.LogDebug("[Transaction] Starting for {Request}", typeof(TRequest).Name);
        var response = await next();
        await _uow.CommitAsync(ct);
        _logger.LogDebug("[Transaction] Committed for {Request}", typeof(TRequest).Name);
        return response;
    }
}
