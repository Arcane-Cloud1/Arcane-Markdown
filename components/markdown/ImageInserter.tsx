"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/I18nContext";

interface ImageInserterProps {
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

export function ImageInserter({ onInsert, onClose }: ImageInserterProps) {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const handleSubmit = () => {
    if (!url) return;
    onInsert(`![${alt}](${url})`);
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t.editor.imageInserter.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>{t.editor.imageInserter.urlLabel}</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.editor.imageInserter.urlPlaceholder} />
        </div>
        <div className="space-y-2">
          <Label>{t.editor.imageInserter.altLabel}</Label>
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder={t.editor.imageInserter.altPlaceholder} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>{t.editor.imageInserter.cancel}</Button>
        <Button onClick={handleSubmit} disabled={!url}>{t.editor.imageInserter.insert}</Button>
      </DialogFooter>
    </>
  );
}
