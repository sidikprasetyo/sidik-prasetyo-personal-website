"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Import ReactQuill secara dinamis supaya tidak bentrok dengan SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // teks styling
      [{ list: "ordered" }, { list: "bullet" }], // list
      ["link"], // hyperlink
      ["clean"], // clear formatting
    ],
  };

  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Description"
      />
    </div>
  );
}
