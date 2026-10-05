export default function PageLoader({ label = "Loading" }) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white dark:bg-gray-950"
    >
      {/* spinner ring with the logo inside */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-4 border-green-600/15 dark:border-green-400/15"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-600 dark:border-t-green-400"
        />
        <span aria-hidden="true" className="text-3xl">♻</span>
      </div>

      <div className="text-center">
        <p className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">TakaPick</p>
        <p className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-white/50">
          {label}
          <span aria-hidden="true" className="flex gap-0.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-green-600 [animation-delay:-0.3s] dark:bg-green-400" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-green-600 [animation-delay:-0.15s] dark:bg-green-400" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-green-600 dark:bg-green-400" />
          </span>
        </p>
      </div>
    </main>
  );
}