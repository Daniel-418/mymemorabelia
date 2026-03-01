import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoldButton from '../components/ui/GoldButton'
import InputField from '../components/ui/InputField'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { token, user } = await authApi.login({ email, password })
      login(token, user)
      navigate('/capsules')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.details || 'Invalid credentials. Please try again.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <InputField 
                placeholder="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputField 
                placeholder="Password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Submit */}
            <div className="flex justify-center mb-5">
              <GoldButton 
                size="md" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Opening...' : 'Open My Vault'}
              </GoldButton>
            </div>
          </form>

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
