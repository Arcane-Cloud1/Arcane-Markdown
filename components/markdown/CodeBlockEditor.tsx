'use client';

import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-yaml';

interface CodeBlockEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CodeBlockEditor({ code, language, onChange, className }: CodeBlockEditorProps) {
  const highlight = (code: string) => {
    let lang = language?.toLowerCase() || 'text';
    // Map common aliases
    if (lang === 'js') lang = 'javascript';
    if (lang === 'ts') lang = 'typescript';
    if (lang === 'py') lang = 'python';
    if (lang === 'sh') lang = 'bash';

    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    }
    // Fallback to plain text if language not found
    return code; // Or use Prism.util.encode(code) if needed, but simple return is usually fine for plain text in this editor
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // Find start of current line
      const lastNewLine = value.lastIndexOf('\n', start - 1);
      const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
      const currentLine = value.substring(lineStart, start);

      // Calculate indentation
      const match = currentLine.match(/^(\s*)/);
      const indentation = match ? match[1] : '';

      // Insert new line with indentation
      const newValue = value.substring(0, start) + '\n' + indentation + value.substring(end);

      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indentation.length;
      });
    }
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        onKeyDown={handleKeyDown}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: 'transparent',
          minHeight: '100px',
        }}
        textareaClassName="focus:outline-none"
      />
    </div>
  );
}
