"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  defaultValue: string;
}

export default function CodeEditor({ defaultValue }: CodeEditorProps) {
  const [code, setCode] = useState(defaultValue);

  const handleChange = (value: string | undefined) => {
    const newValue = value || "";
    setCode(newValue);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Monaco Editor */}
      <Editor
        height="40vh"
        language="typescript"
        defaultValue={code}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
        }}
      />

      {/* real input，form will read value from here */}
      <input type="hidden" name="code" value={code} />
    </div>
  );
}
