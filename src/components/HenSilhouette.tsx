export default function HenSilhouette({
  color,
  className = "",
  title,
  outline = false,
}: {
  color: string;
  className?: string;
  title?: string;
  outline?: boolean;
}) {
  const fill = outline ? "none" : "currentColor";
  const stroke = outline ? "currentColor" : "none";
  const strokeWidth = outline ? 2.5 : 0;

  return (
    <svg
      viewBox="0 0 220 180"
      className={className}
      style={{ color }}
      role="img"
      aria-label={title ?? "Hen on nest"}
    >
      {title && <title>{title}</title>}

      {/* Nest base — soft ellipse */}
      <ellipse
        cx="110"
        cy="150"
        rx="86"
        ry="16"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={outline ? 0.7 : 0.55}
      />

      {/* Hen body — rounded, settled on nest */}
      <path
        d="
          M 40 132
          C 34 104, 48 80, 76 74
          C 80 56, 96 46, 118 48
          C 146 50, 162 68, 164 90
          C 182 96, 186 118, 178 134
          C 172 146, 150 152, 110 152
          C 68 152, 46 146, 40 132
          Z
        "
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Wing suggestion — soft curve on body */}
      <path
        d="M 70 112 C 88 108, 118 108, 150 118"
        fill="none"
        stroke={outline ? "currentColor" : "rgba(0,0,0,0.18)"}
        strokeWidth={outline ? 1.8 : 2}
        strokeLinecap="round"
        opacity={outline ? 0.55 : 1}
      />

      {/* Comb — three-lobed */}
      <path
        d="M 110 48 Q 106 36 112 30 Q 116 38 118 46 Q 122 36 128 34 Q 128 44 124 50"
        fill="#9B1B30"
        opacity={outline ? 0.85 : 1}
      />

      {/* Beak */}
      <path d="M 160 88 L 176 86 L 168 96 Z" fill="#C8922A" />

      {/* Wattle */}
      <path d="M 152 94 Q 150 102 156 104 Q 160 102 158 94 Z" fill="#9B1B30" opacity="0.9" />

      {/* Eye */}
      <circle cx="146" cy="82" r="3" fill="#2C2418" />
      <circle cx="147" cy="81" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}
