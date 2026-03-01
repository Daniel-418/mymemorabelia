import Navbar from '../components/layout/Navbar'
import PageWrapper from '../components/layout/PageWrapper'
import CapsuleReveal from '../components/capsule/CapsuleReveal'
import { PLACEHOLDER_ITEMS } from '../types/capsule'

export default function ViewMemory() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="max-w-[800px] mx-auto">
          <div className="bg-surface rounded-2xl shadow-sm p-8">
            {/* Delivery badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-dark text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Sent on Dec 31, 2025 &mdash; Delivered
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl text-primary text-center mb-2">
              Our Wedding Day
            </h1>

            {/* Capsule reveal */}
            <CapsuleReveal items={PLACEHOLDER_ITEMS} />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
