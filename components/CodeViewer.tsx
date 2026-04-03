"use client";

import Editor from "@monaco-editor/react";

interface CodeViewerProps {
  code: string;
}

export default function CodeViewer({ code }: CodeViewerProps) {
  return (
    <Editor
      height="40vh"
      language="typescript"
      value={code}
      theme="vs-dark"
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
      }}
    />
  );
}
