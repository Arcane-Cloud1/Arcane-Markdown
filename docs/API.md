# API Documentation

## Components

### `ArcaneEditor`

The main editor component.

```tsx
import { ArcaneEditor } from '@/components/ArcaneEditor';

export default function Page() {
  return <ArcaneEditor />;
}
```

#### Props

| Prop | Type | Default | Description |
|Data | `ArcaneEditorProps` | `undefined` | Initial data for the editor. |
| isEditing | `boolean` | `false` | Whether the editor is in editing mode (vs creation mode). |

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

## Data Structures

### `Block`

Represents a single content block in the editor.

```typescript
interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
}
```

### `BlockType`

Supported block types.

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
