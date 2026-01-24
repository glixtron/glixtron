import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="glass border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold gradient-text">Glixtron</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Glixtron. Your personal career architect.
          </p>
        </div>
      </div>
    </footer>
  )
}
