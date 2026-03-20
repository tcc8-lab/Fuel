export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="skeleton h-6 w-24 mx-auto mb-6" />
          <div className="skeleton h-12 w-80 mx-auto mb-6" />
          <div className="skeleton h-5 w-96 mx-auto" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-surface-100 p-6">
              <div className="skeleton h-10 w-10 rounded-lg mb-4" />
              <div className="skeleton h-5 w-40 mb-2" />
              <div className="skeleton h-4 w-full mb-1" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
