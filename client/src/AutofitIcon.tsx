interface AutofitIconProps {
  enabled: boolean
}

export function AutofitIcon({ enabled }: AutofitIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity={enabled ? 1 : 0.5} stroke="currentColor" strokeWidth="1.5" fill="none">
        {/* Four corners of a frame */}
        <path d="M 3 3 L 3 7 M 3 3 L 7 3" />
        <path d="M 17 3 L 17 7 M 17 3 L 13 3" />
        <path d="M 3 17 L 3 13 M 3 17 L 7 17" />
        <path d="M 17 17 L 17 13 M 17 17 L 13 17" />
      </g>
    </svg>
  )
}
