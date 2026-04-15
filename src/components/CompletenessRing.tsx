import { useNavigate } from "react-router-dom";
import { HON_COLORS } from "@/data/colors";
import type { CollectionItem } from "@/api/types";

interface Props {
  collection: CollectionItem[];
  size?: number;
}

export default function CompletenessRing({ collection, size = 260 }: Props) {
  const navigate = useNavigate();
  const ownedIds = new Set(collection.map((c) => c.honColorId));
  const segments = HON_COLORS.sort((a, b) => a.displayOrder - b.displayOrder);
  const n = segments.length;
  const gap = 2; // degrees
  const arc = 360 / n - gap;
  const radius = size / 2 - 22;
  const cx = size / 2;
  const cy = size / 2;
  const owned = segments.filter((s) => ownedIds.has(s.id)).length;

  const polar = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  const arcPath = (startDeg: number, endDeg: number, r: number) => {
    const [x1, y1] = polar(startDeg, r);
    const [x2, y2] = polar(endDeg, r);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-sm"
        role="img"
        aria-label={`${owned} of ${n} colors collected`}
      >
        <defs>
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {segments.map((s, i) => {
          const start = i * (360 / n) + gap / 2;
          const end = start + arc;
          const isOwned = ownedIds.has(s.id);
          return (
            <g
              key={s.id}
              style={{ cursor: "pointer", animation: `ringIn 600ms ${i * 35}ms both` }}
              onClick={() => navigate(`/hen/${s.slug}`)}
            >
              <path
                d={arcPath(start, end, radius)}
                stroke={isOwned ? s.hexColor : "rgba(61,43,31,0.35)"}
                strokeWidth={isOwned ? 16 : 3}
                strokeLinecap="round"
                strokeDasharray={isOwned ? undefined : "2 4"}
                fill="none"
                filter={isOwned ? "url(#ringGlow)" : undefined}
                opacity={isOwned ? 1 : 0.65}
              >
                <title>{s.name}</title>
              </path>
            </g>
          );
        })}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="font-serif"
          style={{ fontSize: size * 0.18, fill: "var(--text-primary)", fontWeight: 600 }}
        >
          {owned}/{n}
        </text>
        <text
          x={cx}
          y={cy + size * 0.1}
          textAnchor="middle"
          style={{
            fontSize: size * 0.05,
            fill: "var(--text-secondary)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          colors collected
        </text>
      </svg>
      <style>{`
        @keyframes ringIn {
          from { opacity: 0; transform: rotate(-8deg); transform-origin: ${cx}px ${cy}px; }
          to   { opacity: 1; transform: rotate(0); }
        }
      `}</style>
    </div>
  );
}
