'use client'

export function PrintButton() {
  return (
    <button 
      className="btn btn-primary print-hide" 
      type="button" 
      onClick={() => window.print()}
    >
      🖨️ Print
    </button>
  )
}
