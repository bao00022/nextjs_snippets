import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full border-b h-24 bg-neutral-200 flex items-center justify-center">
      <div className="w-full max-w-4xl flex justify-between p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold hover:text-gray-600">Welcome to the Snippets App</h1>
          <p className="hidden md:block">A project-based path to introduce the fundamentals of Next.js</p>
        </Link>
        <Button asChild>
          <Link href="/snippets">New Snippets</Link>
        </Button>
      </div>
    </div>
  );
}
