import { useState } from 'react'
import { Link } from 'react-router-dom'
import GoldButton from '../components/ui/GoldButton'
import InputField from '../components/ui/InputField'

const timezones = Intl.supportedValuesOf('timeZone')
const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function SignUpScreen() {
  const [timezone, setTimezone] = useState(defaultTimezone)

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
            <InputField placeholder="Username" type="text" />
            <InputField placeholder="Email" type="email" />
            <InputField placeholder="Password" type="password" />
            <InputField placeholder="Confirm Password" type="password" />

            {/* Timezone select */}
            <div>
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

          {/* Submit */}
          <div className="flex justify-center mb-5">
            <GoldButton size="md">Create My Vault</GoldButton>
          </div>

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
