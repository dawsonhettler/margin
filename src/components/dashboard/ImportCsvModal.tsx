"use client";
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { UploadCloud, CheckCircle2, AlertCircle, X, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportCsvModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinancial();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) parseCsv(selected);
  };

  const parseCsv = (file: File) => {
    setFile(file);
    setErrorMsg("");
    setSuccessCount(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setErrorMsg("The selected CSV file appears to be empty.");
          return;
        }

        const normalized = results.data.slice(0, 50).map((row: any) => {
          // Normalize column headers across banks (Date, Description, Amount)
          const date = row.Date || row.date || row["Posting Date"] || row["Transaction Date"] || new Date().toISOString().split("T")[0];
          const desc = row.Description || row.description || row.Name || row.Memo || row.counterparty || "Bank Transfer";
          let rawAmount = row.Amount || row.amount || row["Gross"] || row.Net || "0";

          // Clean currency symbols and commas
          const cleanedAmount = typeof rawAmount === "string" ? parseFloat(rawAmount.replace(/[$, ]/g, "")) : rawAmount;
          const isNegative = cleanedAmount < 0;
          const absAmount = Math.abs(cleanedAmount) || 0;

          // Categorization heuristic
          let category = "Operations";
          const lowerDesc = desc.toLowerCase();
          if (lowerDesc.includes("stripe") || lowerDesc.includes("subscription") || lowerDesc.includes("inflow") || lowerDesc.includes("client") || !isNegative) {
            category = "Revenue";
          }
          if (lowerDesc.includes("payroll") || lowerDesc.includes("gusto") || lowerDesc.includes("rippling")) {
            category = "Payroll";
          }
          if (lowerDesc.includes("aws") || lowerDesc.includes("github") || lowerDesc.includes("vercel") || lowerDesc.includes("google") || lowerDesc.includes("slack")) {
            category = "Software";
          }
          if (lowerDesc.includes("meta") || lowerDesc.includes("ads") || lowerDesc.includes("linkedin") || lowerDesc.includes("marketing")) {
            category = "Marketing";
          }
          if (lowerDesc.includes("legal") || lowerDesc.includes("cpa") || lowerDesc.includes("advisory")) {
            category = "Professional Services";
          }

          return {
            date,
            description: desc,
            amount: absAmount,
            type: isNegative || lowerDesc.includes("debit") ? "expense" : "income",
            category,
          };
        });

        setPreview(normalized);
      },
      error: () => {
        setErrorMsg("Failed to parse CSV. Verify file encoding (UTF-8).");
      },
    });
  };

  const handleCommit = async () => {
    if (preview.length === 0) return;
    setImporting(true);

    try {
      for (const item of preview) {
        await addTransaction({
          description: item.description,
          amount: item.amount,
          type: item.type,
          category: item.category,
          date: item.date,
        });
      }
      setSuccessCount(preview.length);
      setPreview([]);
      setFile(null);
    } catch {
      setErrorMsg("Error committing ledger batch to database.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#0A0A0A] border border-[#222222] w-full max-w-2xl p-6 sm:p-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#222222]">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Ledger Ingestion Engine</span>
            <h2 className="font-serif text-2xl text-white font-light mt-1">Import Bank & Stripe Statement</h2>
          </div>
          <button onClick={onClose} className="text-[#707070] hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 border border-red-900 bg-red-950/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successCount !== null ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
            <h3 className="font-serif text-2xl text-white font-light">
              {successCount} Ledger Entries Synchronized
            </h3>
            <p className="text-xs text-[#A0A0A0]">
              Balance sheet, cash runway, and trajectory metrics updated with zero latency.
            </p>
            <div className="pt-4">
              <Button variant="primary" size="sm" onClick={onClose}>
                Return to Cockpit
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 overflow-y-auto pr-1">
            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#333333] hover:border-white p-8 text-center cursor-pointer transition-colors bg-black"
            >
              <UploadCloud size={28} className="text-[#707070] mx-auto mb-3" />
              <div className="text-xs text-white uppercase tracking-wider font-medium">
                {file ? file.name : "Select or Drop Bank / Stripe CSV"}
              </div>
              <p className="text-[11px] text-[#707070] mt-1 font-light">
                Supports Mercury, Chase, Brex, Silicon Valley Bank, Stripe, and QuickBooks exports.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Preview Table */}
            {preview.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#707070]">
                    Parsed Preview ({preview.length} Line Items)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Heuristic Auto-Categorization Active
                  </span>
                </div>

                <div className="border border-[#222222] max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-black sticky top-0 border-b border-[#222222] text-[10px] uppercase text-[#707070] tracking-wider">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Counterparty</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1c1c]">
                      {preview.slice(0, 10).map((row, i) => (
                        <tr key={i} className="hover:bg-[#121212]">
                          <td className="p-2.5 text-[#707070] font-mono text-[11px]">{row.date}</td>
                          <td className="p-2.5 text-white font-light truncate max-w-[200px]">{row.description}</td>
                          <td className="p-2.5 text-[10px] uppercase tracking-wider text-[#A0A0A0]">{row.category}</td>
                          <td className={`p-2.5 text-right font-mono font-medium ${row.type === "income" ? "text-emerald-400" : "text-white"}`}>
                            {row.type === "income" ? "+" : "-"}${row.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-[#707070]">
                    Reviewing first {Math.min(10, preview.length)} rows. Batch ready for database commit.
                  </span>
                  <div className="flex space-x-3">
                    <Button variant="secondary" size="sm" onClick={() => setPreview([])}>
                      Reset
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleCommit} disabled={importing}>
                      {importing ? "Committing..." : `Commit ${preview.length} Entries`}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
