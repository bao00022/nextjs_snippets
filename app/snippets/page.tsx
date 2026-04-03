import { createSnippet } from "@/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import MonacoEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { revalidatePath } from "next/cache";

export default function CreateSnippetPage() {
  async function actionCreateSnippet(formData: FormData): Promise<void> {
    "use server";
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;
    const response = await createSnippet(title, code);
    console.log("Create Snippet Response:", response);
    revalidatePath("/");
    redirect("/");
  }

  return (
    <form action={actionCreateSnippet} className="w-full max-w-4xl p-4 flex flex-col gap-4">
      <Link href="/" className="text-blue-500 hover:underline">
        &lt; &lt; Back to Home
      </Link>

      <h2 className="text-2xl font-bold">Create a Snippet</h2>

      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" name="title" type="text" placeholder="title..." required />
      </Field>

      <MonacoEditor defaultValue="// Write your code here" />
      <div className="flex justify-end">
        <Button variant="outline" type="submit" className="cursor-pointer">
          Create Snippet
        </Button>
      </div>
    </form>
  );
}
