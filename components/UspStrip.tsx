export default function UspStrip() {
  const items = [
    { icon: '🚚', label: 'Pan India Shipping' },
    { icon: '💳', label: 'Easy UPI Payment' },
    { icon: '📱', label: 'WhatsApp Support' },
    { icon: '💎', label: 'Handpicked Quality' },
  ]
  return (
    <div className="usp-strip" role="list" aria-label="Why shop with us">
      <div className="container usp-strip-inner">
        {items.map((item) => (
          <span key={item.label} className="usp-strip-item" role="listitem">
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
