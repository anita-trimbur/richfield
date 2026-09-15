import { PageContainer } from "@/components/layout/PageContainer";
import { Timeline } from "@/components/timeline/Timeline";
import { timeline } from "@/content/timeline";

export default function Home() {
  return (
    <main>
      <PageContainer className="pb-12 sm:pb-24">
        <h1 className="sr-only">Work</h1>
        <Timeline sections={timeline} />
      </PageContainer>
    </main>
  );
}
