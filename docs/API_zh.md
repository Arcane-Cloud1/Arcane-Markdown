# API 文档

## 组件

### `ArcaneEditor`

核心编辑器组件。

```tsx
import { ArcaneEditor } from '@/components/ArcaneEditor';

export default function Page() {
  return <ArcaneEditor />;
}
```

#### 属性 (Props)

| 属性 | 类型 | 默认值 | 描述 |
|Data | `ArcaneEditorProps` | `undefined` | 编辑器的初始数据。 |
| isEditing | `boolean` | `false` | 是否处于编辑模式（相对于创建模式）。 |

#### `ArcaneEditorProps`

```typescript
interface ArcaneEditorProps {
  initialData?: {
    title?: string;
    slug?: string;
    content?: string;
  };
  isEditing?: boolean;
}
```

## 数据结构

### `Block`

表示编辑器中的一个内容块。

```typescript
interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
}
```

### `BlockType`

支持的块类型。

```typescript
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
```
