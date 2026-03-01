import { Link } from 'react-router-dom'
import GoldButton from '../components/ui/GoldButton'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-topographic flex flex-col items-center justify-center px-6">
      {/* Hero */}
      <h1 className="font-heading text-5xl md:text-6xl text-teal-dark mb-3 text-center">
        MyMemorabelia
      </h1>
      <p className="text-xl text-secondary mb-10 text-center">
        Create, bury, relive.
      </p>

      {/* CSS Time Capsule Illustration */}
      <div className="relative w-64 h-44 mb-12">
        {/* Ground/water wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 rounded-full bg-teal-dark/15" />

        {/* Capsule body */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-32 rounded-full bg-gray-400 shadow-lg rotate-[-20deg]">
          {/* Capsule band */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-gray-600/40" />
          {/* Capsule highlight */}
          <div className="absolute top-3 left-3 w-3 h-8 rounded-full bg-white/30" />
        </div>

        {/* Floating media icons */}
        <div className="absolute top-0 right-6 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-sm animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          {'\u{1F5BC}'}
        </div>
        <div className="absolute top-2 left-8 w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 shadow-sm animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
          {'\u25B6'}
        </div>
        <div className="absolute top-8 right-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 shadow-sm animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.8s' }}>
          {'\u266A'}
        </div>
        <div className="absolute -top-2 left-1/2 w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shadow-sm animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
          {'\u23F0'}
        </div>
      </div>

      {/* CTA */}
      <Link to="/login">
        <GoldButton size="lg">Get Started</GoldButton>
      </Link>

      <Link to="#" className="mt-4 text-sm text-secondary underline underline-offset-2 hover:text-primary transition-colors">
        Learn More
      </Link>
    </div>
  )
}
