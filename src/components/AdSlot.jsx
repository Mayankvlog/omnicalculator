import { useRef, useState, useEffect } from 'react';

function buildDoc({ containerId, scripts, inline }) {
  const container = containerId
    ? `<div id="${containerId}"></div>`
    : '';
  const inlineTag = inline
    ? `<script type="text/javascript" data-cfasync="false">${inline}<\/script>`
    : '';
  const scriptsHtml = (scripts || [])
    .map((src) => `<script src="${src}" type="text/javascript" data-cfasync="false"><\/script>`)
    .join('\n');

  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;border:0;width:100%;height:100%;}body{display:flex;align-items:center;justify-content:center;overflow:hidden;}</style></head><body>${container}${inlineTag}\n${scriptsHtml}</body></html>`;
}

export default function AdSlot({
  containerId = '',
  scripts = [],
  inline, className = '', style,
  width, height, title = 'Advertisement',
  lazy = true, delay = 0,
}) {
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(!lazy && delay <= 0);

  useEffect(() => {
    if (visible) return;

    let observed = true;
    let timer = null;
    let observer = null;

    const activate = () => {
      if (!observed) return;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      setVisible(true);
    };

    // Optionally wait before even attempting to render the iframe so the
    // app itself always paints first.
    if (delay > 0) {
      timer = setTimeout(activate, delay);
    }

    if (lazy && hostRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            if (observer) observer.disconnect();
            activate();
          }
        },
        { rootMargin: '200px 0px' }
      );
      observer.observe(hostRef.current);
    }

    return () => {
      observed = false;
      if (timer) clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [visible, lazy, delay]);

  return (
    <div
      ref={hostRef}
      id={containerId || undefined}
      className={className}
      style={style}
    >
      {visible && (
        <iframe
          srcDoc={buildDoc({ containerId, scripts, inline })}
          title={title}
          loading="lazy"
          scrolling="no"
          frameBorder="0"
          style={{
            border: '0',
            display: 'block',
            width: width ? `${width}px` : '100%',
            maxWidth: '100%',
            height: height ? `${height}px` : '220px',
          }}
        />
      )}
    </div>
  );
}