using FluentValidation;
using MediatR;
using VendaCore.Application.Common;

namespace VendaCore.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
    where TResponse : class
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        => _validators = validators;

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var failures = _validators
            .Select(v => v.Validate(context))
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (!failures.Any()) return await next();

        var errors = failures.Select(f => f.ErrorMessage);

        var responseType = typeof(TResponse);
        if (responseType.IsGenericType && responseType.GetGenericTypeDefinition() == typeof(Result<>))
        {
            var genericArg = responseType.GetGenericArguments()[0];
            var failureMethod = typeof(Result<>)
                .MakeGenericType(genericArg)
                .GetMethod(nameof(Result<object>.Failure), [typeof(IEnumerable<string>)])!;
            return (TResponse)failureMethod.Invoke(null, [errors])!;
        }

        if (responseType == typeof(Result))
            return (TResponse)(object)Result.Failure(errors);

        throw new ValidationException(failures);
    }
}
