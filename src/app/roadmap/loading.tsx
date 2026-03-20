export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="skeleton h-6 w-24 mx-auto mb-6" />
          <div className="skeleton h-12 w-64 mx-auto mb-6" />
          <div className="skeleton h-5 w-80 mx-auto" />
        </div>
        <div className="skeleton h-3 w-full rounded-full mb-12" />
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="pl-12">
              <div className="skeleton h-6 w-48 mb-4" />
              <div className="rounded-xl border border-white/5 bg-surface-100 p-6 space-y-3">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
