import { useRef } from 'react';

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

export default function AdSlot({ containerId = '', scripts = [], inline, className = '', style, width, height, title = 'Advertisement' }) {
  const hostRef = useRef(null);

  return (
    <div
      ref={hostRef}
      id={containerId || undefined}
      className={className}
      style={style}
    >
      <iframe
        srcDoc={buildDoc({ containerId, scripts, inline })}
        title={title}
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
    </div>
  );
}