import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DrugSearch } from "@/components/DrugSearch";

export default function SimpleSearchPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-4">
          <Heading title="Simple Drug Search" description="Search for drugs and get basic information" />
          <Separator />
          <DrugSearch />
        </div>
      </div>
    </div>
  );
}
