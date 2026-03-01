import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoldButton from '../components/ui/GoldButton'
import InputField from '../components/ui/InputField'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'

const timezones = Intl.supportedValuesOf('timeZone')
const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function SignUpScreen() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [timezone, setTimezone] = useState(defaultTimezone)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      const { token, user } = await authApi.register({ 
        username, 
        email, 
        password, 
        timezone 
      })
      login(token, user)
      navigate('/capsules')
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errors = err.response.data
        if (typeof errors === 'object') {
          setError(Object.values(errors).flat()[0] as string)
        } else {
          setError('Registration failed. Please try again.')
        }
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
                placeholder="Username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
              <InputField 
                placeholder="Confirm Password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {/* Timezone select */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5 ml-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-gold-start/30 focus:border-gold-start transition-colors font-body"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
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
                {isLoading ? 'Creating...' : 'Create My Vault'}
              </GoldButton>
            </div>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-dark font-medium underline underline-offset-2 hover:text-gold-start transition-colors">
              Log in.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
