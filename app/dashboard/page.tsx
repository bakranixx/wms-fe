import { useT } from "@/hooks/use-translations";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsOverview } from "./_components/stats-overview";
import { ChartsSection } from "./_components/charts-section";
import { DataTablesSection } from "./_components/data-tables-section";
import { ActivitySection } from "./_components/activity-section";
import { BottomStats } from "./_components/bottom-stats";

export default function DashboardPage() {
  const t = useT();
  return (
    <DashboardLayout>
      <StatsOverview />
      <ChartsSection />
      <DataTablesSection />
      <ActivitySection />
      <BottomStats />
    </DashboardLayout>
  );
}
