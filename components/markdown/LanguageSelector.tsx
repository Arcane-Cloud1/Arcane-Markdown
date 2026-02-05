'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/lib/i18n/I18nContext';

const POPULAR_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c++',
  'c#',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'html',
  'css',
  'sql',
  'bash',
  'json',
  'yaml',
  'markdown',
];

interface LanguageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (language: string) => void;
}

export function LanguageSelector({ open, onOpenChange, onSelect }: LanguageSelectorProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');

  const filteredLanguages = POPULAR_LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.editor.languageSelector.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder={t.editor.languageSelector.placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="grid max-h-[300px] grid-cols-3 gap-2 overflow-y-auto p-1">
            {filteredLanguages.map((lang) => (
              <Button
                key={lang}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  onSelect(lang);
                  onOpenChange(false);
                  setSearch(''); // Reset search
                }}
              >
                {lang}
              </Button>
            ))}
            {filteredLanguages.length === 0 && (
              <div className="text-muted-foreground col-span-3 py-4 text-center">
                {t.editor.languageSelector.notFound}
                <Button
                  variant="link"
                  className="h-auto p-0"
                  onClick={() => {
                    onSelect(search);
                    onOpenChange(false);
                    setSearch('');
                  }}
                >
                  {t.editor.languageSelector.use} &quot;{search}&quot;
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
