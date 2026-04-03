import { getSnippetById, updateSnippetById } from "@/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import MonacoEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

interface EditSnippetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSnippetPage({ params }: EditSnippetPageProps) {
  const { id } = await params;
  const snippet = await getSnippetById(Number(id));

  if (!snippet) {
    return notFound();
  }

  async function actionUpdateSnippet(formData: FormData): Promise<void> {
    "use server";
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;
    const response = await updateSnippetById(Number(id), title, code);
    redirect(`/snippets/${id}`);
  }

  return (
    <form action={actionUpdateSnippet} className="w-full max-w-4xl p-4 flex flex-col gap-4">
      <Link href="/" className="text-blue-500 hover:underline">
        &lt; &lt; Back to Home
      </Link>

      <h2 className="text-2xl font-bold">Edit Snippet</h2>

      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" name="title" type="text" placeholder="title..." required defaultValue={snippet.title} />
      </Field>

      <MonacoEditor defaultValue={snippet.code} />
      <div className="flex justify-end">
        <Button variant="outline" type="submit" className="cursor-pointer">
          Update Snippet
        </Button>
      </div>
    </form>
  );
}
