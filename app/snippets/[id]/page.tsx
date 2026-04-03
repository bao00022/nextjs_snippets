import { getSnippetById } from "@/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import CodeViewer from "@/components/CodeViewer";

interface SnippetPageProps {
  params: Promise<{ id: string }>;
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const { id } = await params;
  const snippet = await getSnippetById(Number(id));
  if (!snippet) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl p-4 flex flex-col gap-4">
      <Link href="/" className="text-blue-500 hover:underline">
        &lt; &lt; Back to Home
      </Link>
      <h2 className="text-2xl font-bold">{snippet.title}</h2>
      <CodeViewer code={snippet.code} />
    </div>
  );
}
