interface BrandMarkProps {
  size?: number
  className?: string
  wordmark?: boolean
}

export function BrandMark({ size = 32, className, wordmark = true }: BrandMarkProps) {
  return (
    <span className={['inline-flex items-center gap-2 font-semibold tracking-tight', className].filter(Boolean).join(' ')}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="shrink-0"
        style={{ width: size, height: size }}
      >
        <rect width="32" height="32" rx="8" fill="#1d4ed8" />
        <path d="M9 24 16 7.8 23 24h-3.2L16 14.6 12.2 24H9Z" fill="white" />
        <rect x="11.2" y="20.2" width="9.6" height="2" rx="1" fill="#93c5fd" />
      </svg>
      {wordmark ? <span>VendaCore</span> : null}
    </span>
  )
}
