import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-teal-dark text-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-gold-start font-heading text-xl">MyMemorabelia</span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-white/70 hover:text-white transition-colors">Home</Link>
          <Link to="/capsules" className="text-sm text-white/70 hover:text-white transition-colors">Capsules</Link>
          <Link to="/capsules/new" className="text-sm text-white/70 hover:text-white transition-colors">Create</Link>

          {/* Avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium">
            JD
          </div>
        </div>
      </div>
    </nav>
  )
}
