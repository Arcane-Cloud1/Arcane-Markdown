'use client';

import { useI18n } from '@/lib/i18n/I18nContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={locale === 'zh' ? '切换语言' : 'Switch Language'}
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale('zh')} className="cursor-pointer">
          <span className={locale === 'zh' ? 'font-bold' : ''}>中文</span>
          {locale === 'zh' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('en')} className="cursor-pointer">
          <span className={locale === 'en' ? 'font-bold' : ''}>English</span>
          {locale === 'en' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
