import { 
  Bold, Italic, Link as LinkIcon, Code, 
  List, ListOrdered, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nContext";

interface SimpleMarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

export function SimpleMarkdownToolbar({ onInsert }: SimpleMarkdownToolbarProps) {
  const { t } = useI18n();
  
  const ToolbarButton = ({ 
    icon: Icon, 
    title, 
    onClick,
  }: { 
    icon: any, 
    title: string, 
    onClick: () => void,
  }) => (
    <Button 
      type="button" 
      variant="ghost" 
      size="sm" 
      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted" 
      title={title}
      onClick={onClick}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1 bg-muted/30 border-b rounded-t-md">
      <ToolbarButton icon={Bold} title={t.editor.toolbar.bold} onClick={() => onInsert("**", "**")} />
      <ToolbarButton icon={Italic} title={t.editor.toolbar.italic} onClick={() => onInsert("*", "*")} />
      <ToolbarButton icon={Quote} title={t.editor.toolbar.quote} onClick={() => onInsert("\n> ")} />
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarButton icon={List} title={t.editor.toolbar.listUl} onClick={() => onInsert("\n- ")} />
      <ToolbarButton icon={ListOrdered} title={t.editor.toolbar.listOl} onClick={() => onInsert("\n1. ")} />
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarButton icon={LinkIcon} title={t.editor.toolbar.link} onClick={() => onInsert("[", "](url)")} />
      <ToolbarButton icon={Code} title={t.editor.toolbar.code} onClick={() => onInsert("`", "`")} />
    </div>
  );
}
