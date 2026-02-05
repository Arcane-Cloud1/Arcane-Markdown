'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Download,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Image as ImageIcon,
  Minus,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Table,
  CheckSquare,
  Sigma,
  Network,
  FoldVertical,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownToolbar } from '@/components/markdown/MarkdownToolbar';
import { MermaidBuilder } from '@/components/markdown/MermaidBuilder';
import { LanguageSelector } from '@/components/markdown/LanguageSelector';
import { CodeBlockEditor } from '@/components/markdown/CodeBlockEditor';
import { useI18n } from '@/lib/i18n/I18nContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// --- Types ---
type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'quote'
  | 'list-ul'
  | 'list-ol'
  | 'checklist'
  | 'image'
  | 'divider'
  | 'code'
  | 'math'
  | 'mermaid'
  | 'table'
  | 'details'
  | 'callout-info'
  | 'callout-warning'
  | 'callout-success'
  | 'callout-error';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

interface ArcaneEditorProps {
  initialData?: {
    title?: string;
    slug?: string;
    content?: string;
  };
  isEditing?: boolean;
}

// --- Module Definitions moved inside component ---

// --- Helpers ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const parseMarkdown = (md: string): Block[] => {
  if (!md) return [];
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  // Simplistic parser
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Callouts
    if (line.startsWith('> ℹ️ **提示**')) {
      blocks.push({ id: generateId(), type: 'callout-info', content: '' });
      continue;
    }
    if (line.startsWith('> ⚠️ **警告**')) {
      blocks.push({ id: generateId(), type: 'callout-warning', content: '' });
      continue;
    }
    if (line.startsWith('> ✅ **成功**')) {
      blocks.push({ id: generateId(), type: 'callout-success', content: '' });
      continue;
    }
    if (line.startsWith('> ❌ **错误**')) {
      blocks.push({ id: generateId(), type: 'callout-error', content: '' });
      continue;
    }
    if (currentBlock && (currentBlock as Block).type.startsWith('callout-')) {
      if (line.trim() === '>' || line.trim() === '') continue;
      if (line.startsWith('> ')) {
        (currentBlock as Block).content +=
          ((currentBlock as Block).content ? '\n' : '') + line.substring(2);
        continue;
      }
      currentBlock = null; // End of callout
    }

    if (line.startsWith('# ')) {
      blocks.push({ id: generateId(), type: 'heading1', content: line.substring(2) });
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ id: generateId(), type: 'heading2', content: line.substring(3) });
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ id: generateId(), type: 'heading3', content: line.substring(4) });
      continue;
    }
    if (line.startsWith('> ')) {
      blocks.push({ id: generateId(), type: 'quote', content: line.substring(2) });
      continue;
    }
    if (line.startsWith('- [ ] ')) {
      blocks.push({
        id: generateId(),
        type: 'checklist',
        content: line.substring(6),
        metadata: { checked: false },
      });
      continue;
    }
    if (line.startsWith('- [x] ')) {
      blocks.push({
        id: generateId(),
        type: 'checklist',
        content: line.substring(6),
        metadata: { checked: true },
      });
      continue;
    }
    if (line.startsWith('- ')) {
      blocks.push({ id: generateId(), type: 'list-ul', content: line.substring(2) });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      blocks.push({ id: generateId(), type: 'list-ol', content: line.replace(/^\d+\.\s/, '') });
      continue;
    }
    if (line.startsWith('---')) {
      blocks.push({ id: generateId(), type: 'divider', content: '' });
      continue;
    }
    if (line.startsWith('$$')) {
      let mathContent = '';
      if (line.trim() === '$$') {
        let j = i + 1;
        while (j < lines.length && lines[j].trim() !== '$$') {
          mathContent += lines[j] + '\n';
          j++;
        }
        blocks.push({ id: generateId(), type: 'math', content: mathContent.trim() });
        i = j;
        continue;
      } else {
        // Inline block math $$...$$
        blocks.push({
          id: generateId(),
          type: 'math',
          content: line.replace(/^\$\$/, '').replace(/\$\$$/, ''),
        });
        continue;
      }
    }
    if (line.startsWith('```mermaid')) {
      let mermaidContent = '';
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('```')) {
        mermaidContent += lines[j] + '\n';
        j++;
      }
      blocks.push({ id: generateId(), type: 'mermaid', content: mermaidContent.trim() });
      i = j;
      continue;
    }
    if (line.startsWith('<details>')) {
      let detailsContent = '';
      let summary = 'Details';
      let j = i + 1;
      // Try to find summary
      if (j < lines.length && lines[j].includes('<summary>')) {
        summary = lines[j].replace(/.*?<summary>(.*?)<\/summary>.*/, '$1');
        j++;
      }
      while (j < lines.length && !lines[j].startsWith('</details>')) {
        detailsContent += lines[j] + '\n';
        j++;
      }
      blocks.push({
        id: generateId(),
        type: 'details',
        content: detailsContent.trim(),
        metadata: { summary },
      });
      i = j;
      continue;
    }
    if (line.startsWith('```')) {
      const language = line.substring(3).trim();
      let codeContent = '';
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('```')) {
        codeContent += lines[j] + '\n';
        j++;
      }
      blocks.push({
        id: generateId(),
        type: 'code',
        content: codeContent.trim(),
        metadata: { language },
      });
      i = j;
      continue;
    }

    // Table handling
    if (line.trim().startsWith('|')) {
      const tableLines = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        tableLines.push(lines[j]);
        j++;
      }

      if (tableLines.length > 0) {
        const data = tableLines
          .filter((l) => {
            // Filter out separator lines (containing dashes and only separator chars)
            const isSeparator = /^[\s|:-]+$/.test(l) && l.includes('-');
            return !isSeparator;
          })
          .map((l) => {
            const row = l.split('|').map((c) => c.trim());
            // Standard markdown table often has leading/trailing pipes
            if (row[0] === '') row.shift();
            if (row[row.length - 1] === '') row.pop();
            return row;
          });

        // Normalize column count based on header
        if (data.length > 0) {
          const cols = data[0].length;
          const normalizedData = data.map((row) => {
            while (row.length < cols) row.push('');
            return row.slice(0, cols);
          });
          blocks.push({
            id: generateId(),
            type: 'table',
            content: '',
            metadata: { data: normalizedData },
          });
          i = j - 1;
          continue;
        }
      }
    }
    const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      blocks.push({
        id: generateId(),
        type: 'image',
        content: imgMatch[2],
        metadata: { alt: imgMatch[1] },
      });
      continue;
    }

    if (line.trim() !== '') {
      blocks.push({ id: generateId(), type: 'paragraph', content: line });
    }
  }
  return blocks;
};

const serializeMarkdown = (blocks: Block[]): string => {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'heading1':
          return `# ${block.content}`;
        case 'heading2':
          return `## ${block.content}`;
        case 'heading3':
          return `### ${block.content}`;
        case 'quote':
          return `> ${block.content}`;
        case 'list-ul':
          return `- ${block.content}`;
        case 'list-ol':
          return `1. ${block.content}`;
        case 'checklist':
          return `- [${block.metadata?.checked ? 'x' : ' '}] ${block.content}`;
        case 'divider':
          return `---`;
        case 'image':
          return `![${block.metadata?.alt || 'image'}](${block.content})`;
        case 'code':
          return `\`\`\`${block.metadata?.language || ''}\n${block.content}\n\`\`\``;
        case 'math':
          return `$$\n${block.content}\n$$`;
        case 'mermaid':
          return `\`\`\`mermaid\n${block.content}\n\`\`\``;
        case 'details':
          return `<details>\n<summary>${block.metadata?.summary || 'Details'}</summary>\n${block.content}\n</details>`;
        case 'table':
          const data = block.metadata?.data;
          if (!data || !Array.isArray(data) || data.length === 0) return '';
          const header = data[0];
          const body = data.slice(1);
          const cols = header.length;
          const rowToMd = (row: string[]) => `| ${row.join(' | ')} |`;
          const separator = Array(cols).fill('---');

          let md = rowToMd(header) + '\n' + rowToMd(separator);
          if (body.length > 0) {
            md += '\n' + body.map(rowToMd).join('\n');
          }
          return md;
        case 'callout-info':
          return `> ℹ️ **提示**\n> \n> ${block.content.replace(/\n/g, '\n> ')}`;
        case 'callout-warning':
          return `> ⚠️ **警告**\n> \n> ${block.content.replace(/\n/g, '\n> ')}`;
        case 'callout-success':
          return `> ✅ **成功**\n> \n> ${block.content.replace(/\n/g, '\n> ')}`;
        case 'callout-error':
          return `> ❌ **错误**\n> \n> ${block.content.replace(/\n/g, '\n> ')}`;
        default:
          return block.content;
      }
    })
    .join('\n\n');
};

const RichBlockTextarea = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsert = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newValue = before + prefix + selection + suffix + after;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="group/rich relative">
      <div className="absolute -top-10 left-0 z-10 hidden group-focus-within/rich:block">
        <div className="rounded-md border bg-white p-1 shadow-lg">
          <MarkdownToolbar onInsert={handleInsert} />
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
};

export function ArcaneEditor({ initialData, isEditing = false }: ArcaneEditorProps) {
  const { t } = useI18n();
  const router = useRouter();

  const modules = [
    {
      category: t.editor.modules.basics,
      items: [
        { type: 'paragraph', label: t.editor.blocks.paragraph, icon: Type },
        { type: 'heading1', label: t.editor.blocks.heading1, icon: Heading1 },
        { type: 'heading2', label: t.editor.blocks.heading2, icon: Heading2 },
        { type: 'heading3', label: t.editor.blocks.heading3, icon: Heading3 },
        { type: 'quote', label: t.editor.blocks.quote, icon: Quote },
      ],
    },
    {
      category: t.editor.modules.lists,
      items: [
        { type: 'list-ul', label: t.editor.blocks.listUl, icon: List },
        { type: 'list-ol', label: t.editor.blocks.listOl, icon: ListOrdered },
        { type: 'checklist', label: t.editor.blocks.checklist, icon: CheckSquare },
      ],
    },
    {
      category: t.editor.modules.mediaAndStructure,
      items: [
        { type: 'image', label: t.editor.blocks.image, icon: ImageIcon },
        { type: 'table', label: t.editor.blocks.table, icon: Table },
        { type: 'code', label: t.editor.blocks.code, icon: Code },
        { type: 'math', label: t.editor.blocks.math, icon: Sigma },
        { type: 'mermaid', label: t.editor.blocks.mermaid, icon: Network },
        { type: 'details', label: t.editor.blocks.details, icon: FoldVertical },
        { type: 'divider', label: t.editor.blocks.divider, icon: Minus },
      ],
    },
    {
      category: t.editor.modules.components,
      items: [
        { type: 'callout-info', label: t.editor.blocks.calloutInfo, icon: Info },
        { type: 'callout-warning', label: t.editor.blocks.calloutWarning, icon: AlertTriangle },
        { type: 'callout-success', label: t.editor.blocks.calloutSuccess, icon: CheckCircle },
        { type: 'callout-error', label: t.editor.blocks.calloutError, icon: XCircle },
      ],
    },
  ];
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draggingType, setDraggingType] = useState<BlockType | null>(null);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
    },
  });

  useEffect(() => {
    if (initialData?.content) {
      setBlocks(parseMarkdown(initialData.content));
    } else if (!isEditing) {
      // Default blocks for new page
      setBlocks([
        { id: generateId(), type: 'heading1', content: t.editor.defaultContent.welcome },
        { id: generateId(), type: 'paragraph', content: t.editor.defaultContent.startEditing },
      ]);
    }
  }, [initialData, isEditing, t]);

  const handleExport = () => {
    const markdown = serializeMarkdown(blocks);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.getValues('slug') || 'untitled'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t.editor.exportSuccess);
  };

  // --- Block Management ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addBlock = (type: BlockType, index?: number, metadata?: Record<string, any>) => {
    const id = generateId();
    if (type === 'checklist' && !metadata) {
      metadata = { checked: false };
    }
    const newBlock: Block = { id, type, content: '', metadata };
    setBlocks((prev) => {
      const next = [...prev];
      if (index !== undefined) {
        next.splice(index, 0, newBlock);
      } else {
        next.push(newBlock);
      }
      return next;
    });
    setFocusedBlockId(id);
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBlock = (id: string, content: string, metadata?: Record<string, any>) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, content, metadata: { ...b.metadata, ...metadata } } : b,
      ),
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const next = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    setDraggingType(type);
    e.dataTransfer.setData('type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingType(null);
    const type = e.dataTransfer.getData('type') as BlockType;
    if (type) {
      if (type === 'code') {
        setIsLanguageSelectorOpen(true);
      } else {
        addBlock(type);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleLanguageSelect = (language: string) => {
    addBlock('code', undefined, { language });
    setIsLanguageSelectorOpen(false);
  };

  const handleListKeyDown = (e: React.KeyboardEvent, id: string, type: BlockType) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const index = blocks.findIndex((b) => b.id === id);
      if (index !== -1) {
        addBlock(type, index + 1);
      }
    }
  };

  // Auto-generate slug
  const title = form.watch('title');
  useEffect(() => {
    if (!isEditing && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const currentSlug = form.getValues('slug');
      if (!currentSlug || !form.getFieldState('slug').isDirty) {
        form.setValue('slug', slug);
      }
    }
  }, [title, isEditing, form]);

  // --- Block Grouping Helpers ---
  type BlockGroup =
    | {
        type: 'group';
        id: string; // use first block id
        blocks: Block[];
      }
    | {
        type: 'single';
        block: Block;
      };

  const groupBlocks = (blocks: Block[]): BlockGroup[] => {
    const groups: BlockGroup[] = [];
    let currentGroup: Block[] = [];

    const isListType = (type: BlockType) => ['list-ul', 'list-ol', 'checklist'].includes(type);

    blocks.forEach((block) => {
      if (isListType(block.type)) {
        currentGroup.push(block);
      } else {
        if (currentGroup.length > 0) {
          groups.push({ type: 'group', id: currentGroup[0].id, blocks: [...currentGroup] });
          currentGroup = [];
        }
        groups.push({ type: 'single', block });
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ type: 'group', id: currentGroup[0].id, blocks: [...currentGroup] });
    }

    return groups;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gray-50/95 py-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? t.editor.editTitle : t.editor.newTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> {t.common.export}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Editor Canvas */}
        <div className="space-y-6 lg:col-span-3">
          {/* Page Metadata Form */}
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.editor.titleLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.editor.titlePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <LanguageSelector
            open={isLanguageSelectorOpen}
            onOpenChange={setIsLanguageSelectorOpen}
            onSelect={handleLanguageSelect}
          />

          {/* Blocks Canvas */}
          <div
            className={cn(
              'min-h-[500px] space-y-4 rounded-xl border-2 border-dashed p-8 transition-colors',
              draggingType ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 bg-white',
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {blocks.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-20 text-gray-400">
                <p>{t.editor.dragPlaceholder}</p>
              </div>
            )}

            {groupBlocks(blocks).map((group) => {
              if (group.type === 'group') {
                let olCounter = 0;
                return (
                  <div key={group.id} className="group relative flex items-start gap-2">
                    {/* Group Controls - Positioned at top of group */}
                    <div className="absolute top-2 -left-12 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => removeBlock(group.blocks[0].id)}
                        className="rounded-md border bg-white p-1.5 text-red-500 shadow-sm hover:bg-red-50"
                        title={t.common.delete}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-1 rounded-lg border border-transparent bg-white p-3 ring-blue-500/20 ring-offset-2 transition-colors focus-within:ring-2 hover:border-blue-200">
                      {group.blocks.map((block) => {
                        if (block.type === 'list-ol') {
                          olCounter++;
                        } else {
                          olCounter = 0;
                        }

                        const currentNumber = olCounter;

                        return (
                          <div
                            key={block.id}
                            className="group/item relative flex items-start gap-2"
                          >
                            {/* Item Controls (Hover only) */}
                            <div className="absolute top-1 -left-8 flex gap-1 opacity-0 transition-opacity group-hover/item:opacity-100">
                              <div className="flex flex-col">
                                <button
                                  onClick={() => moveBlock(block.id, 'up')}
                                  className="p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => moveBlock(block.id, 'down')}
                                  className="p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeBlock(block.id)}
                                className="p-1 text-gray-300 hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>

                            {block.type === 'checklist' ? (
                              <div className="mt-2 shrink-0">
                                <input
                                  type="checkbox"
                                  checked={block.metadata?.checked || false}
                                  onChange={(e) =>
                                    updateBlock(block.id, block.content, {
                                      checked: e.target.checked,
                                    })
                                  }
                                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </div>
                            ) : (
                              <span className="mt-2 w-6 shrink-0 text-right font-mono text-gray-400 select-none">
                                {block.type === 'list-ul' ? '•' : `${currentNumber}.`}
                              </span>
                            )}
                            <Input
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, e.target.value)}
                              placeholder={
                                block.type === 'checklist'
                                  ? t.editor.placeholders.checklist
                                  : t.editor.placeholders.list
                              }
                              className={cn(
                                'h-auto min-w-0 flex-1 border-none p-0 py-1 shadow-none focus-visible:ring-0',
                                block.type === 'checklist' &&
                                  block.metadata?.checked &&
                                  'text-gray-400 line-through',
                              )}
                              onKeyDown={(e) => handleListKeyDown(e, block.id, block.type)}
                              autoFocus={focusedBlockId === block.id}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const block = group.block;
              return (
                <div key={block.id} className="group relative flex items-start gap-2">
                  {/* Block Controls */}
                  <div className="absolute top-2 -left-12 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex flex-col overflow-hidden rounded-md border bg-white shadow-sm">
                      <button
                        onClick={() => moveBlock(block.id, 'up')}
                        className="p-1.5 text-gray-500 hover:bg-gray-100"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveBlock(block.id, 'down')}
                        className="p-1.5 text-gray-500 hover:bg-gray-100"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="rounded-md border bg-white p-1.5 text-red-500 shadow-sm hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Block Content */}
                  <div className="flex-1 rounded-lg border border-transparent bg-white p-3 ring-blue-500/20 ring-offset-2 transition-colors focus-within:ring-2 hover:border-blue-200">
                    {/* Render Block based on type */}
                    {block.type === 'paragraph' && (
                      <RichBlockTextarea
                        value={block.content}
                        onChange={(val) => updateBlock(block.id, val)}
                        placeholder={t.editor.placeholders.paragraph}
                        className="min-h-[80px] resize-none border-none p-0 text-base shadow-none focus-visible:ring-0"
                      />
                    )}
                    {block.type.startsWith('heading') && (
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder={`${t.editor.placeholders.heading} ${block.type.replace('heading', '')}`}
                        className={cn(
                          'border-none p-0 font-bold shadow-none focus-visible:ring-0',
                          block.type === 'heading1'
                            ? 'text-3xl'
                            : block.type === 'heading2'
                              ? 'text-2xl'
                              : 'text-xl',
                        )}
                      />
                    )}
                    {block.type === 'quote' && (
                      <div className="flex gap-4">
                        <div className="w-1 shrink-0 rounded-full bg-gray-300" />
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder={t.editor.placeholders.quote}
                          className="min-h-[60px] resize-none border-none p-0 text-gray-600 italic shadow-none focus-visible:ring-0"
                        />
                      </div>
                    )}
                    {/* List types handled in group */}
                    {block.type === 'divider' && (
                      <div className="py-4">
                        <div className="h-px w-full bg-gray-200" />
                      </div>
                    )}
                    {block.type === 'code' && (
                      <div className="overflow-hidden rounded-md bg-gray-900 font-mono text-sm">
                        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-400 uppercase">
                          <span>{block.metadata?.language || t.editor.blocks.code}</span>
                        </div>
                        <CodeBlockEditor
                          code={block.content}
                          language={block.metadata?.language || 'text'}
                          onChange={(val) => updateBlock(block.id, val)}
                          className="min-h-[100px] text-gray-100"
                        />
                      </div>
                    )}
                    {block.type === 'math' && (
                      <div className="rounded-md border bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-gray-500 uppercase">
                          <span className="flex items-center gap-1">
                            <Sigma className="h-3 w-3" /> {t.editor.blocks.math} (LaTeX)
                          </span>
                        </div>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder={t.editor.placeholders.math}
                          className="min-h-[60px] resize-none border-none bg-transparent p-0 font-mono text-gray-800 shadow-none focus-visible:ring-0"
                        />
                      </div>
                    )}
                    {block.type === 'mermaid' && (
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 uppercase">
                          <span className="flex items-center gap-1">
                            <Network className="h-3 w-3" /> {t.editor.blocks.mermaid}
                          </span>
                        </div>
                        <MermaidBuilder
                          initialData={block.metadata?.mermaidData}
                          onUpdate={(code, data) =>
                            updateBlock(block.id, code, { mermaidData: data })
                          }
                        />
                      </div>
                    )}
                    {block.type === 'details' && (
                      <div className="space-y-2 rounded-md border bg-white p-4">
                        <div className="mb-2 flex items-center gap-2 border-b pb-2">
                          <FoldVertical className="h-4 w-4 text-gray-400" />
                          <Input
                            value={block.metadata?.summary || ''}
                            onChange={(e) =>
                              updateBlock(block.id, block.content, { summary: e.target.value })
                            }
                            placeholder={t.editor.placeholders.detailsSummary}
                            className="h-auto border-none p-0 font-medium shadow-none focus-visible:ring-0"
                          />
                        </div>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder={t.editor.placeholders.detailsContent}
                          className="min-h-[80px] resize-none border-none p-0 text-gray-600 shadow-none focus-visible:ring-0"
                        />
                      </div>
                    )}
                    {block.type === 'table' && (
                      <div className="overflow-x-auto">
                        {(() => {
                          const data = (block.metadata?.data as string[][]) || [
                            ['Header 1', 'Header 2'],
                            ['Cell 1', 'Cell 2'],
                          ];
                          const updateTable = (newData: string[][]) =>
                            updateBlock(block.id, '', { data: newData });

                          const addRow = () => {
                            const cols = data[0].length;
                            updateTable([...data, Array(cols).fill('')]);
                          };
                          const addCol = () => {
                            updateTable(data.map((row: string[]) => [...row, '']));
                          };
                          const removeRow = (idx: number) => {
                            if (data.length <= 1) return;
                            updateTable(data.filter((_, i) => i !== idx));
                          };
                          const removeCol = (idx: number) => {
                            if (data[0].length <= 1) return;
                            updateTable(
                              data.map((row: string[]) =>
                                row.filter((_, i) => i !== idx),
                              ),
                            );
                          };

                          return (
                            <div className="space-y-2">
                              <div className="overflow-hidden rounded-md border bg-white">
                                <table className="w-full border-collapse text-sm">
                                  <tbody>
                                    {data.map((row: string[], rIndex: number) => (
                                      <tr
                                        key={rIndex}
                                        className={rIndex === 0 ? 'bg-muted/50 font-medium' : ''}
                                      >
                                        {row.map((cell: string, cIndex: number) => (
                                          <td
                                            key={cIndex}
                                            className="relative min-w-[100px] border p-0"
                                          >
                                            <Input
                                              value={cell}
                                              onChange={(e) => {
                                                const newData = [...data];
                                                newData[rIndex] = [...newData[rIndex]];
                                                newData[rIndex][cIndex] = e.target.value;
                                                updateTable(newData);
                                              }}
                                              className="h-auto rounded-none border-none px-3 py-2 shadow-none focus:bg-blue-50 focus-visible:ring-0"
                                            />
                                          </td>
                                        ))}
                                        <td
                                          className="w-8 cursor-pointer border-l bg-gray-50 text-center text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                          onClick={() => removeRow(rIndex)}
                                        >
                                          <Trash2 className="mx-auto h-3 w-3" />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={addRow}>
                                  <Plus className="mr-1 h-3 w-3" /> {t.editor.buttons.addRow}
                                </Button>
                                <Button variant="outline" size="sm" onClick={addCol}>
                                  <Plus className="mr-1 h-3 w-3" /> {t.editor.buttons.addCol}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeCol(data[0].length - 1)}
                                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Minus className="mr-1 h-3 w-3" />{' '}
                                  {t.editor.buttons.deleteLastCol}
                                </Button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    {block.type === 'image' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                            placeholder={t.editor.placeholders.image}
                            className="flex-1"
                          />
                          <Input
                            value={block.metadata?.alt || ''}
                            onChange={(e) =>
                              updateBlock(block.id, block.content, { alt: e.target.value })
                            }
                            placeholder={t.editor.placeholders.imageAlt}
                            className="w-1/3"
                          />
                        </div>
                        {block.content && (
                          <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.content}
                              alt={block.metadata?.alt}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {block.type.startsWith('callout') && (
                      <div
                        className={cn(
                          'flex gap-3 rounded-lg border p-4',
                          block.type === 'callout-info' &&
                            'border-blue-100 bg-blue-50 text-blue-900',
                          block.type === 'callout-warning' &&
                            'border-yellow-100 bg-yellow-50 text-yellow-900',
                          block.type === 'callout-success' &&
                            'border-green-100 bg-green-50 text-green-900',
                          block.type === 'callout-error' && 'border-red-100 bg-red-50 text-red-900',
                        )}
                      >
                        <div className="mt-1 shrink-0">
                          {block.type === 'callout-info' && 'ℹ️'}
                          {block.type === 'callout-warning' && '⚠️'}
                          {block.type === 'callout-success' && '✅'}
                          {block.type === 'callout-error' && '❌'}
                        </div>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder={t.editor.placeholders.callout}
                          className="min-h-[60px] resize-none border-none bg-transparent p-0 text-inherit shadow-none placeholder:text-inherit/50 focus-visible:ring-0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Modules */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">
                  {t.editor.componentLibrary}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {modules.map((category) => (
                  <div key={category.category}>
                    <h4 className="mb-2 text-xs font-semibold text-gray-400">
                      {category.category}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.items.map((item) => (
                        <div
                          key={item.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.type as BlockType)}
                          className="flex h-20 cursor-move flex-col items-center justify-center gap-2 rounded-md border bg-white shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="text-xs">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
