using System.Text.RegularExpressions;
using VendaCore.Domain.Common;

namespace VendaCore.Domain.ValueObjects;

public class Email : ValueObject
{
    private static readonly Regex EmailRegex =
        new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; }

    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("E-mail não pode ser vazio.");
        if (!EmailRegex.IsMatch(value))
            throw new DomainException($"E-mail inválido: {value}.");
        Value = value.ToLowerInvariant().Trim();
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;
    public static implicit operator string(Email email) => email.Value;
}
