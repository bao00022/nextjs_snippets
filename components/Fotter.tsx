import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full border-b h-24 bg-neutral-200 flex items-center justify-center">
      <div className="w-full max-w-4xl flex justify-center items-center gap-2 p-4">
        <p className="text-2xl">©</p>
        <p>2026 Yan live demo.</p>
      </div>
    </div>
  );
}
