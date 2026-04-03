import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  id: number;
  action: (formData: FormData) => Promise<void>;
}

export default function DeleteButton({ id, action }: DeleteButtonProps) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button variant="destructive" type="submit">
        Delete
      </Button>
    </form>
  );
}
