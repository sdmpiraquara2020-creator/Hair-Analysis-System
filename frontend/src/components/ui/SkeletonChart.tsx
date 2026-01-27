import { Skeleton } from "./Skeleton";

export default function SkeletonChart() {
  return (
    <div style={{ marginBottom: "32px" }}>
      <Skeleton width="30%" height={18} style={{ marginBottom: 12 }} />
      <Skeleton height={180} borderRadius={8} />
    </div>
  );
}
