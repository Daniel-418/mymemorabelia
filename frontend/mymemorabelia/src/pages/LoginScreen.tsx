import { Link } from 'react-router-dom'
import GoldButton from '../components/ui/GoldButton'
import InputField from '../components/ui/InputField'

export default function LoginScreen() {
  return (
    <div className="min-h-screen bg-topographic flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-lg p-8">
          {/* Header */}
          <h1 className="font-heading text-3xl text-teal-dark text-center mb-1">
            MyMemorabelia
          </h1>
          <p className="text-sm text-secondary text-center mb-8">
            Your Digital Time Capsule
          </p>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <InputField placeholder="Email" type="email" />
            <InputField placeholder="Password" type="password" />
          </div>

          {/* Submit */}
          <div className="flex justify-center mb-5">
            <GoldButton size="md">Open My Vault</GoldButton>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-secondary">
            New here?{' '}
            <Link to="/signup" className="text-teal-dark font-medium underline underline-offset-2 hover:text-gold-start transition-colors">
              Sign up today.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
