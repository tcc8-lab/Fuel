export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="skeleton h-6 w-16 mx-auto mb-6" />
          <div className="skeleton h-12 w-64 mx-auto mb-6" />
          <div className="skeleton h-5 w-80 mx-auto" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-surface-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex justify-between">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-4 w-16" />
              </div>
              <div className="p-5 space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
