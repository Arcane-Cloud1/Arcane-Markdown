"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/I18nContext";

interface CodeInserterProps {
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

export function CodeInserter({ onInsert, onClose }: CodeInserterProps) {
  const { t } = useI18n();
  const [language, setLanguage] = useState("text");
  const [code, setCode] = useState("");

  const LANGUAGES = [
    { value: "text", label: t.editor.codeInserter.text },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash / Shell" },
    { value: "markdown", label: "Markdown" },
  ];

  const handleSubmit = () => {
    if (!code) return;
    const lang = language === "text" ? "" : language;
    onInsert(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t.editor.codeInserter.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>{t.editor.codeInserter.languageLabel}</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.editor.codeInserter.languagePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t.editor.codeInserter.codeLabel}</Label>
          <textarea
            className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.editor.codeInserter.codePlaceholder}
            spellCheck={false}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>{t.editor.codeInserter.cancel}</Button>
        <Button onClick={handleSubmit} disabled={!code}>{t.editor.codeInserter.insert}</Button>
      </DialogFooter>
    </>
  );
}
