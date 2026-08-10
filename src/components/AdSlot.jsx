import { useEffect, useRef } from 'react';

export default function AdSlot({ containerId = '', scripts = [], inline, className = '', style }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (inline) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.textContent = inline;
      host.appendChild(s);
    }

    const scriptEls = (scripts || []).map((src) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.setAttribute('data-cfasync', 'false');
      host.appendChild(s);
      return s;
    });

    return () => {
      scriptEls.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, []);

  return (
    <div
      ref={hostRef}
      id={containerId || undefined}
      className={className}
      style={style}
    />
  );
}
