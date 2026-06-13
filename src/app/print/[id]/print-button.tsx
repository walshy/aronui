'use client'

export default function PrintButton() {
  return (
    <button className="print-save-btn no-print" onClick={() => window.print()}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M3 10.5V13.5H12V10.5M7.5 1.5V10M7.5 10L5 7.5M7.5 10L10 7.5"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Save as PDF
    </button>
  )
}
