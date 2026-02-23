import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'

export default function CancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <nav className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </a>
      </div>
    </main>
  )
}
