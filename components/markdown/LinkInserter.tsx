"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/I18nContext";

interface LinkInserterProps {
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

export function LinkInserter({ onInsert, onClose }: LinkInserterProps) {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!url) return;
    const linkText = text || url;
    onInsert(`[${linkText}](${url})`);
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t.editor.linkInserter.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>{t.editor.linkInserter.urlLabel}</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.editor.linkInserter.urlPlaceholder} />
        </div>
        <div className="space-y-2">
          <Label>{t.editor.linkInserter.textLabel}</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.editor.linkInserter.textPlaceholder} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>{t.editor.linkInserter.cancel}</Button>
        <Button onClick={handleSubmit} disabled={!url}>{t.editor.linkInserter.insert}</Button>
      </DialogFooter>
    </>
  );
}
