export default function TextMemorySection() {
  return (
    <textarea
      placeholder="Add Text Memory"
      rows={4}
      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-gold-start/30 focus:border-gold-start resize-none font-body leading-relaxed"
    />
  )
}
