import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full max-w-4xl p-4 flex flex-col md:flex-row gap-4 items-center justify-start">
      {/* text part */}
      <div className="flex flex-col gap-4 max-w-md items-center justify-center">
        <h2 className="text-xl font-bold md:text-2xl mt-8">Page Not Found</h2>
        <p className="text-muted-foreground font-semibold">Sorry, We Misplaced That Page</p>
        <div>
          <Button size="lg" className="group gap-2" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>

      {/* svg part */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="w-150 h-150 relative">
          <Image src="/404.svg" fill sizes="50vw" alt="404" className="object-cover" loading="eager" />
        </div>
        <a href="https://storyset.com/web">Web illustrations by Storyset</a>
      </div>
    </div>
  );
}
