"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowRight, Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/I18nContext";

export interface MermaidNode {
  id: string;
  label: string;
  shape: "rect" | "round" | "diamond" | "circle";
}

export interface MermaidLink {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface MermaidData {
  nodes: MermaidNode[];
  links: MermaidLink[];
  direction: "TD" | "LR";
}

interface MermaidBuilderProps {
  initialData?: MermaidData;
  onUpdate: (code: string, data: MermaidData) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 5);

export function MermaidBuilder({ initialData, onUpdate }: MermaidBuilderProps) {
  const { t } = useI18n();
  const [nodes, setNodes] = useState<MermaidNode[]>(initialData?.nodes || [
    { id: "A", label: t.editor.mermaid.defaults.start, shape: "round" },
    { id: "B", label: t.editor.mermaid.defaults.end, shape: "round" }
  ]);
  const [links, setLinks] = useState<MermaidLink[]>(initialData?.links || [
    { id: generateId(), sourceId: "A", targetId: "B" }
  ]);
  const [direction, setDirection] = useState<"TD" | "LR">(initialData?.direction || "TD");

  // Generate Mermaid code whenever state changes
  useEffect(() => {
    let code = `graph ${direction};\n`;
    
    // Add nodes definitions if they have special shapes or labels different from ID
    nodes.forEach(node => {
      let shapeStr = "";
      // Escape label quotes
      const label = node.label.replace(/"/g, "'");
      
      switch (node.shape) {
        case "rect": shapeStr = `[${label}]`; break;
        case "round": shapeStr = `(${label})`; break;
        case "diamond": shapeStr = `{${label}}`; break;
        case "circle": shapeStr = `((${label}))`; break;
        default: shapeStr = `[${label}]`;
      }
      // Only add explicit definition if needed, but for stability always add it
      code += `    ${node.id}${shapeStr};\n`;
    });

    code += "\n";

    // Add links
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.sourceId);
      const target = nodes.find(n => n.id === link.targetId);
      
      if (source && target) {
        if (link.label) {
            code += `    ${source.id}-->|${link.label}|${target.id};\n`;
        } else {
            code += `    ${source.id}-->${target.id};\n`;
        }
      }
    });

    onUpdate(code, { nodes, links, direction });
  }, [nodes, links, direction]);

  const addNode = () => {
    const id = generateId().toUpperCase();
    setNodes([...nodes, { id, label: "新节点", shape: "rect" }]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setLinks(links.filter(l => l.sourceId !== id && l.targetId !== id));
  };

  const updateNode = (id: string, updates: Partial<MermaidNode>) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const addLink = () => {
    if (nodes.length < 2) return;
    setLinks([...links, { id: generateId(), sourceId: nodes[0].id, targetId: nodes[1].id }]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLink = (id: string, updates: Partial<MermaidLink>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-md border">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Label>布局方向</Label>
                <Select value={direction} onValueChange={(v: any) => setDirection(v)}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TD">从上到下</SelectItem>
                        <SelectItem value="LR">从左到右</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="flex gap-2">
             <Button size="sm" variant="outline" onClick={addNode}>
                <Plus className="w-4 h-4 mr-1" /> 添加节点
             </Button>
             <Button size="sm" variant="outline" onClick={addLink}>
                <ArrowRight className="w-4 h-4 mr-1" /> 添加连线
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nodes List */}
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> 节点列表 ({nodes.length})
            </h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {nodes.map(node => (
                    <Card key={node.id} className="p-3">
                        <div className="flex gap-2 items-start">
                            <div className="grid gap-2 flex-1">
                                <div className="flex gap-2">
                                    <Input 
                                        value={node.label} 
                                        onChange={(e) => updateNode(node.id, { label: e.target.value })}
                                        placeholder="节点名称"
                                        className="h-8"
                                    />
                                    <Select value={node.shape} onValueChange={(v: any) => updateNode(node.id, { shape: v })}>
                                        <SelectTrigger className="w-[100px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rect">矩形 []</SelectItem>
                                            <SelectItem value="round">圆角 ()</SelectItem>
                                            <SelectItem value="diamond">菱形 {}</SelectItem>
                                            <SelectItem value="circle">圆形 (())</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="text-xs text-gray-400 font-mono">ID: {node.id}</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeNode(node.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Links List */}
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> 连线列表 ({links.length})
            </h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                 {links.map(link => (
                    <Card key={link.id} className="p-3">
                        <div className="flex gap-2 items-start">
                             <div className="grid gap-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <Select value={link.sourceId} onValueChange={(v) => updateLink(link.id, { sourceId: v })}>
                                        <SelectTrigger className="h-8 flex-1">
                                            <SelectValue placeholder="起点" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                    <Select value={link.targetId} onValueChange={(v) => updateLink(link.id, { targetId: v })}>
                                        <SelectTrigger className="h-8 flex-1">
                                            <SelectValue placeholder="终点" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Input 
                                    value={link.label || ""} 
                                    onChange={(e) => updateLink(link.id, { label: e.target.value })}
                                    placeholder="连线文字 (可选)"
                                    className="h-8"
                                />
                             </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeLink(link.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                 ))}
                 {links.length === 0 && (
                     <div className="text-center text-gray-400 text-sm py-8 border-2 border-dashed rounded-md">
                         暂无连线
                     </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}