import {
  Bold,
  Italic,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Strikethrough,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/I18nContext';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: () => void;
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  const { t } = useI18n();

  const ToolbarButton = ({ icon: Icon, title, onClick }: ToolbarButtonProps) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0"
      title={title}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  const Divider = () => <div className="bg-border mx-1 h-4 w-px" />;

  return (
    <div className="bg-muted/20 flex flex-wrap items-center gap-0.5 rounded-t-md border-b p-1">
      <ToolbarButton
        icon={Bold}
        title={t.editor.toolbar.bold}
        onClick={() => onInsert('**', '**')}
      />
      <ToolbarButton
        icon={Italic}
        title={t.editor.toolbar.italic}
        onClick={() => onInsert('*', '*')}
      />
      <ToolbarButton
        icon={Strikethrough}
        title={t.editor.toolbar.strike}
        onClick={() => onInsert('~~', '~~')}
      />
      <Divider />
      <ToolbarButton icon={Quote} title={t.editor.toolbar.quote} onClick={() => onInsert('\n> ')} />
      <ToolbarButton
        icon={Code}
        title={t.editor.toolbar.code}
        onClick={() => onInsert('```\n', '\n```')}
      />
      <Divider />
      <ToolbarButton icon={List} title={t.editor.toolbar.listUl} onClick={() => onInsert('\n- ')} />
      <ToolbarButton
        icon={ListOrdered}
        title={t.editor.toolbar.listOl}
        onClick={() => onInsert('\n1. ')}
      />
      <Divider />
      <ToolbarButton icon={Heading1} title={t.editor.toolbar.h1} onClick={() => onInsert('\n# ')} />
      <ToolbarButton
        icon={Heading2}
        title={t.editor.toolbar.h2}
        onClick={() => onInsert('\n## ')}
      />
      <Divider />
      <ToolbarButton
        icon={LinkIcon}
        title={t.editor.toolbar.link}
        onClick={() => onInsert('[', '](url)')}
      />
      <ToolbarButton
        icon={ImageIcon}
        title={t.editor.toolbar.image}
        onClick={() => onInsert('![alt](', ')')}
      />
    </div>
  );
}
