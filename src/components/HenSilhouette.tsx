export default function HenSilhouette({
  color,
  className = "",
  title,
}: {
  color: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      style={{ color }}
      role="img"
      aria-label={title ?? "Hen silhouette"}
    >
      {title && <title>{title}</title>}
      <path
        d="M40 120 Q30 70 70 60 Q75 32 100 32 Q140 32 148 66 Q170 78 160 120 Q150 140 100 140 Q50 140 40 120 Z"
        fill="currentColor"
      />
      <circle cx="132" cy="62" r="3.5" fill="#000" fillOpacity="0.75" />
      <path d="M140 66 L158 62 L150 74 Z" fill="#9B1B30" />
      <path d="M100 32 Q96 20 100 14 Q104 20 104 32" fill="#9B1B30" />
      <g fill="currentColor" opacity="0.95">
        {[44, 60, 76, 92, 108, 124, 140, 156].map((cx, i) => (
          <circle key={i} cx={cx} cy={138 - Math.abs(4 - i) * 0.6} r="3" />
        ))}
      </g>
    </svg>
  );
}
