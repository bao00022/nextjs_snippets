import test, { describe, before, after } from "node:test";
import assert from "node:assert";
import { getAllSnippets, getSnippetById, createSnippet, deleteSnippetById, updateSnippetById } from "./dbSnippets";

describe("dbSnippets Module", () => {
  // log created snippet IDs for cleanup
  let createdIds: number[] = [];

  before(() => {
    console.log("🧪🧪🧪 Starting test suite...");
  });

  after(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    // ensure all async operations are complete before cleanup
    console.log("🧹🧹🧹 Cleaning up test data...");
    // delete any snippets that were created during tests
    for (const id of createdIds) {
      await deleteSnippetById(id);
    }
    createdIds = [];
  });

  test("createSnippet should add a new snippet", async () => {
    const response = await createSnippet("Test Snippet", "console.log('Hello, World!');");
    assert(response.success, "create snippet should be successful");
    createdIds.push(response.id);
    console.log("✓ Create Snippet Response:", response);
  });

  test("getAllSnippets should retrieve all snippets", async () => {
    const snippets = await getAllSnippets();
    assert(Array.isArray(snippets), "snippets should be an array");
    console.log("✓ All Snippets:", snippets);
  });

  test("getSnippetById should retrieve a snippet by ID", async () => {
    const created = await createSnippet("Test Snippet", "code");
    createdIds.push(created.id);
    const snippet = await getSnippetById(created.id);
    assert(snippet !== undefined, "snippet should exist");
    assert(snippet.id === created.id, "snippet id should match");
    console.log("✓ Snippet with ID:", snippet);
  });

  test("updateSnippetById should update a snippet", async () => {
    const created = await createSnippet("Original", "code1");
    createdIds.push(created.id);

    const response = await updateSnippetById(created.id, "Updated Title", "code2");
    assert(response.success === true, "update should succeed");

    const updatedSnippet = await getSnippetById(created.id);
    assert(updatedSnippet !== undefined, "updated snippet should exist");
    assert(updatedSnippet.title === "Updated Title", "title should be updated");
    assert(updatedSnippet.code === "code2", "code should be updated");
    console.log("✓ Update Snippet Response:", response);
  });

  test("deleteSnippetById should delete a snippet", async () => {
    const created = await createSnippet("To Delete", "code");
    createdIds.push(created.id);

    const response = await deleteSnippetById(created.id);
    assert(response.success === true, "delete should succeed");

    createdIds = createdIds.filter((id) => id !== created.id);
    console.log("✓ Delete Snippet Response:", response);
  });
});
