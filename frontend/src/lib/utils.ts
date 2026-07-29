import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fetch an audit PDF with the auth header (window.open can't send one) and
// open it in a new tab. Scoped server-side to the record's owner.
export async function openAuthedPdf(recordId: string) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
  const res = await fetch(`${apiUrl}/api/audit/pdf/${recordId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  if (!res.ok) {
    alert(res.status === 404 ? 'PDF not ready yet. Run the audit first.' : 'Failed to download PDF.')
    return
  }
  const blobUrl = URL.createObjectURL(await res.blob())
  window.open(blobUrl, '_blank')
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
}
