namespace VendaCore.Application.Common;

public class Result<T>
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public T? Value { get; }
    public string? Error { get; }
    public IEnumerable<string> Errors { get; }

    private Result(T? value, bool isSuccess, string? error, IEnumerable<string>? errors)
    {
        Value = value;
        IsSuccess = isSuccess;
        Error = error;
        Errors = errors ?? [];
    }

    public static Result<T> Success(T value) => new(value, true, null, null);
    public static Result<T> Failure(string error) => new(default, false, error, null);
    public static Result<T> Failure(IEnumerable<string> errors) => new(default, false, null, errors);
}

public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string? Error { get; }
    public IEnumerable<string> Errors { get; }

    private Result(bool isSuccess, string? error, IEnumerable<string>? errors)
    {
        IsSuccess = isSuccess;
        Error = error;
        Errors = errors ?? [];
    }

    public static Result Success() => new(true, null, null);
    public static Result Failure(string error) => new(false, error, null);
    public static Result Failure(IEnumerable<string> errors) => new(false, null, errors);
}
