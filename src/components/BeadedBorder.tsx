export default function BeadedBorder({ className = "" }: { className?: string }) {
  return <div className={`beaded-border ${className}`} aria-hidden />;
}
