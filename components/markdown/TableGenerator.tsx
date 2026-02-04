"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/I18nContext";

interface TableGeneratorProps {
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

export function TableGenerator({ onInsert, onClose }: TableGeneratorProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>([]);

  const handleSizeSubmit = () => {
    // Initialize data grid
    const newData = Array(rows).fill("").map(() => Array(cols).fill(""));
    setData(newData);
    setStep(2);
  };

  const handleCellChange = (r: number, c: number, value: string) => {
    const newData = [...data];
    newData[r] = [...newData[r]];
    newData[r][c] = value;
    setData(newData);
  };

  const generateMarkdown = () => {
    if (data.length === 0) return;

    // Header row
    let md = "\n| " + data[0].map(cell => cell || " ").join(" | ") + " |\n";
    
    // Separator row
    md += "| " + Array(cols).fill("---").join(" | ") + " |\n";
    
    // Body rows
    for (let i = 1; i < rows; i++) {
      md += "| " + data[i].map(cell => cell || " ").join(" | ") + " |\n";
    }

    onInsert(md);
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{step === 1 ? t.editor.tableGenerator.titleSize : t.editor.tableGenerator.titleEdit}</DialogTitle>
        <DialogDescription>
          {step === 1 ? t.editor.tableGenerator.descSize : t.editor.tableGenerator.descEdit}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {step === 1 ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.editor.tableGenerator.rowsLabel}</Label>
              <Input 
                type="number" 
                min={2} 
                max={20} 
                value={rows} 
                onChange={(e) => setRows(parseInt(e.target.value) || 2)} 
              />
            </div>
            <div className="space-y-2">
              <Label>{t.editor.tableGenerator.colsLabel}</Label>
              <Input 
                type="number" 
                min={1} 
                max={10} 
                value={cols} 
                onChange={(e) => setCols(parseInt(e.target.value) || 1)} 
              />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[60vh] border rounded-md p-2">
            <div 
              className="grid gap-2 min-w-max" 
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(120px, 1fr))` }}
            >
              {data.map((row, rIndex) => (
                row.map((cell, cIndex) => (
                  <Input
                    key={`${rIndex}-${cIndex}`}
                    value={cell}
                    onChange={(e) => handleCellChange(rIndex, cIndex, e.target.value)}
                    placeholder={rIndex === 0 ? `${t.editor.tableGenerator.header} ${cIndex + 1}` : `${t.editor.tableGenerator.content}`}
                    className={rIndex === 0 ? "font-bold bg-muted" : ""}
                  />
                ))
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>{t.editor.tableGenerator.cancel}</Button>
        {step === 1 ? (
          <Button onClick={handleSizeSubmit}>{t.editor.tableGenerator.next}</Button>
        ) : (
          <div className="flex gap-2">
             <Button variant="secondary" onClick={() => setStep(1)}>{t.editor.tableGenerator.prev}</Button>
             <Button onClick={generateMarkdown}>{t.editor.tableGenerator.finish}</Button>
          </div>
        )}
      </DialogFooter>
    </>
  );
}
