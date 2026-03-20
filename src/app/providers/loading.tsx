export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="skeleton h-6 w-32 mx-auto mb-6" />
          <div className="skeleton h-12 w-72 mx-auto mb-6" />
          <div className="skeleton h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-surface-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="skeleton h-10 w-10 rounded-lg" />
                <div>
                  <div className="skeleton h-4 w-32 mb-1" />
                  <div className="skeleton h-3 w-20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton h-8 w-full" />
                <div className="skeleton h-8 w-full" />
                <div className="skeleton h-8 w-full" />
                <div className="skeleton h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
