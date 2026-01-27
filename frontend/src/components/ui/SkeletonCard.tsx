import { Skeleton } from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div
      style={{
        padding: "16px",
        background: "#fff",
        borderRadius: "8px",
        minWidth: "160px"
      }}
    >
      <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={28} />
    </div>
  );
}
