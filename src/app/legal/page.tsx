import React from "react";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 font-sans text-neutral-400 space-y-8">
      <h1 className="font-serif text-4xl text-white">Legal Disclaimers & Terms</h1>
      
      <div className="space-y-4">
        <h2 className="text-white uppercase tracking-widest text-xs">Financial Modeling Disclaimer</h2>
        <p className="text-sm leading-relaxed">
          MARGIN provides analytical tools, deterministic models, and scenario simulations. 
          The platform does not provide accounting, tax, or legal advice. 
          Financial projections are based on user-provided inputs and historical ledger data and 
          do not constitute a guarantee of future financial performance.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-white uppercase tracking-widest text-xs">Data Privacy</h2>
        <p className="text-sm leading-relaxed">
          Your general ledger data is encrypted at rest using AES-256 and transit-secured via TLS 1.3. 
          We utilize PostgreSQL Row-Level Security (RLS) to ensure absolute tenant isolation. 
          MARGIN does not sell, trade, or distribute your financial data.
        </p>
      </div>
      
      <Link href="/" className="block text-white underline pt-8">Return Home</Link>
    </div>
  );
}
