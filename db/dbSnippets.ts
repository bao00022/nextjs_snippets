import { DbClient, type Snippet } from "./dbClient";

const client = DbClient.getInstance();

export interface SnippetResponse {
  success: boolean;
  message: string;
  id: number;
}

export async function getAllSnippets(): Promise<Snippet[]> {
  try {
    const db = await client.getConnection();
    const query = "SELECT id, title, code FROM snippets";
    const snippets = await db.all(query);
    return snippets;
  } catch (error) {
    throw error;
  }
}

export async function getSnippetById(id: number): Promise<Snippet | undefined> {
  try {
    const db = await client.getConnection();
    const query = "SELECT id, title, code FROM snippets WHERE id = ?";
    const snippet = await db.get(query, [id]);
    return snippet;
  } catch (error) {
    throw error;
  }
}

export async function createSnippet(title: string, code: string): Promise<SnippetResponse> {
  try {
    const db = await client.getConnection();
    const query = "INSERT INTO snippets (title, code) VALUES (?, ?)";
    const result = await db.run(query, [title, code]);
    if (result.lastID === undefined) {
      throw new Error("Failed to retrieve the last inserted ID.");
    } else {
      return {
        success: true,
        message: `Snippet ${result.lastID} added successfully.`,
        id: result.lastID,
      };
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteSnippetById(id: number): Promise<SnippetResponse> {
  try {
    const db = await client.getConnection();
    const query = "DELETE FROM snippets WHERE id = ?";
    const result = await db.run(query, [id]);
    if (result.changes === 0) {
      throw new Error(`Snippet with id ${id} not found.`);
    } else {
      return { success: true, message: `Snippet ${id} deleted successfully.`, id };
    }
  } catch (error) {
    throw error;
  }
}

export async function updateSnippetById(id: number, title: string, code: string): Promise<SnippetResponse> {
  try {
    const db = await client.getConnection();
    const query = "UPDATE snippets SET title = ?, code = ? WHERE id = ?";
    const result = await db.run(query, [title, code, id]);
    if (result.changes === 0) {
      throw new Error(`Snippet with id ${id} not found.`);
    } else {
      return { success: true, message: `Snippet ${id} updated successfully.`, id };
    }
  } catch (error) {
    throw error;
  }
}
