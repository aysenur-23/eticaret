export default function Loading() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-slate-50" aria-live="polite" aria-busy="true">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin" role="status">
          <span className="sr-only">Loading</span>
        </div>
      </div>
    </div>
  )
}
