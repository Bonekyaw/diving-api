export function DashboardPageFallback() {
  return (
    <main className="min-h-dvh animate-pulse bg-slate-50">
      <div className="mx-auto flex min-h-dvh max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="h-8 w-36 rounded-lg bg-slate-200" />
          <div className="mt-8 space-y-2">
            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
          </div>
          <div className="mt-auto pt-8">
            <div className="h-32 rounded-2xl bg-slate-100" />
          </div>
        </aside>
        <section className="min-w-0 flex-1 bg-white">
          <header className="border-b border-slate-100 px-8 py-6">
            <div className="h-7 w-52 rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-100" />
          </header>
          <div className="grid gap-5 p-8 md:grid-cols-2 xl:grid-cols-4">
            <div className="h-36 rounded-2xl bg-slate-100" />
            <div className="h-36 rounded-2xl bg-slate-100" />
            <div className="h-36 rounded-2xl bg-slate-100" />
            <div className="h-36 rounded-2xl bg-slate-100" />
          </div>
        </section>
      </div>
    </main>
  );
}
