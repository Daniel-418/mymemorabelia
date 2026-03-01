import Navbar from '../components/layout/Navbar'
import PageWrapper from '../components/layout/PageWrapper'
import CapsuleCard from '../components/capsule/CapsuleCard'
import PendingCard from '../components/capsule/PendingCard'
import FailedCard from '../components/capsule/FailedCard'

export default function CapsuleList() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Page title */}
        <h1 className="font-heading text-3xl text-primary mb-8">Dashboard Screen</h1>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pending column */}
          <div>
            <h2 className="font-heading text-xl text-primary mb-4">Pending</h2>
            <div className="space-y-4">
              <PendingCard title="Secret Project" daysRemaining={245} />
            </div>
          </div>

          {/* Sent column */}
          <div>
            <h2 className="font-heading text-xl text-primary mb-4">Sent</h2>
            <div className="space-y-4">
              <CapsuleCard
                title="Summer Trip"
                snippet="Send time averted some room and trust. The memories from that summer will last forever."
                mediaTypes={['image', 'video', 'music_link']}
                date="Sent: Dec 31, 2025"
              />
              <CapsuleCard
                title="Summer Trip"
                snippet="Sent the first content of a votch or summer trip. The photographs captured every golden moment."
                mediaTypes={['text', 'image', 'audio']}
                date="Sent: Jan 15, 2026"
              />
            </div>
          </div>

          {/* Failed column */}
          <div>
            <h2 className="font-heading text-xl text-primary mb-4">Failed</h2>
            <div className="space-y-4">
              <FailedCard errorMessage="Undeliverable error. The recipient email address could not be reached." />
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
