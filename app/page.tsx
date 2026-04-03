import Link from "next/link";
import { getAllSnippets, deleteSnippetById } from "@/db";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";
import { revalidatePath } from "next/cache";

async function deleteSnippet(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  await deleteSnippetById(id);
  revalidatePath("/");
}

export default async function Home() {
  const snippets = await getAllSnippets();

  return (
    <div className="w-full max-w-4xl p-4">
      <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Live demo notice: snippet data is automatically reset every 5 minutes.
      </div>
      <ul className="flex flex-col gap-4">
        {snippets.map((s) => (
          <div key={s.id} className="px-4 py-2 border rounded flex items-center justify-between">
            <h2 className="text-lg font-semibold">{s.title}</h2>

            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href={`/snippets/${s.id}/edit`} className="flex items-center gap-2">
                  Edit
                </Link>
              </Button>
              {/* server action */}
              <DeleteButton id={s.id} action={deleteSnippet} />

              <Button variant="outline" asChild>
                <Link href={`/snippets/${s.id}`}>View</Link>
              </Button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
