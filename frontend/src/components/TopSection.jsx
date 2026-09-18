import React, { useState } from 'react';

export default function TopSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details className="top-section" open={isOpen} onToggle={(e) => setIsOpen(e.target.open)}>
      <summary>
        <span className="top-section-title">{title}</span>
        <span className={`chev ${isOpen ? 'open' : ''}`}>▾</span>
      </summary>
      <div className="top-section-body">{children}</div>
    </details>
  );
}
