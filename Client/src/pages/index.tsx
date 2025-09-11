import { CategoryTabs } from "@/components/category-tabs";
import Videogrid from "@/components/videogrid";
import { Suspense } from "react";


export default function Home() {
  return (
   <main className="flex-1">
    <CategoryTabs/>
    <Suspense fallback={<div>Loading videos...</div>}>
      <Videogrid/>
    </Suspense>
   </main>
  );
}
