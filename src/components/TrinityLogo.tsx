type Props = {
  /** Height in px; width follows the presentation logo aspect ratio. */
  size?: number
  className?: string
  /** Kept for compatibility; the PPTX logo already includes the TRINITY wordmark. */
  showWordmark?: boolean
}

/** Trinity logo from slide 1 of the ministry presentation. */
export function TrinityLogo({ size = 40, className = '', showWordmark = false }: Props) {
  const height = size
  const width = Math.round(size * (635 / 585))

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={`/trinity-logo.png?v=pptx-slide1`}
        alt="Trinity"
        width={width}
        height={height}
        className="shrink-0 object-contain"
        style={{ width, height }}
      />
      {showWordmark ? <span className="sr-only">Trinity</span> : null}
    </div>
  )
}
