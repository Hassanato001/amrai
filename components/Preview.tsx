import React from 'react';

interface PreviewProps {
  html: string;
  css: string;
  js: string;
}

const Preview: React.FC<PreviewProps> = ({ html, css, js }) => {
  if (!html && !css && !js) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <i className="fa-solid fa-code text-6xl text-gray-600 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-300">Live Preview</h3>
        <p className="mt-2 max-w-sm">
          Enter some HTML, CSS, or JavaScript on the left to see it rendered here. The preview updates automatically as you type.
        </p>
      </div>
    );
  }

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          ${css}
          /* Error Overlay Styles */
          #preview-error-overlay {
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            background-color: #262626; /* neutral-800 */
            color: #f5f5f5; /* neutral-100 */
            padding: 1rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 0.875rem;
            z-index: 99999;
            display: none; /* Initially hidden */
            border: 1px solid #ef4444; /* red-500 */
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            max-height: 40vh;
            overflow-y: auto;
          }
          #preview-error-overlay-header {
             display: flex;
             justify-content: space-between;
             align-items: center;
             margin-bottom: 0.75rem;
             padding-bottom: 0.5rem;
             border-bottom: 1px solid #404040; /* neutral-700 */
          }
          #preview-error-overlay-header h4 {
             color: #f87171; /* red-400 */
             font-size: 1rem;
             font-weight: bold;
             margin: 0;
          }
          #preview-error-close {
            background: none;
            border: none;
            color: #a3a3a3; /* neutral-400 */
            font-size: 1.5rem;
            line-height: 1;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s;
          }
          #preview-error-close:hover {
             color: #f5f5f5; /* neutral-100 */
          }
          #preview-error-message {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
            color: #d4d4d4; /* neutral-300 */
          }
        </style>
      </head>
      <body>
        <div id="preview-error-overlay">
            <div id="preview-error-overlay-header">
                <h4><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-top; margin-right: 8px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>JavaScript Error</h4>
                <button id="preview-error-close" aria-label="Close error message">&times;</button>
            </div>
            <pre id="preview-error-message"></pre>
        </div>
        ${html}
        <script>
          (() => {
            const overlay = document.getElementById('preview-error-overlay');
            const messageEl = document.getElementById('preview-error-message');
            const closeButton = document.getElementById('preview-error-close');

            if (!overlay || !messageEl || !closeButton) return;

            const showError = (message) => {
              if (messageEl) {
                messageEl.textContent = message;
              }
              if (overlay) {
                overlay.style.display = 'block';
              }
            };

            closeButton.onclick = () => {
              if (overlay) {
                  overlay.style.display = 'none';
              }
            };

            window.addEventListener('error', function(event) {
              event.preventDefault(); // Stop error from going to console
              const error = event.error || {};
              const message = event.message || 'An unknown error occurred.';
              const stack = error.stack ? \`\\n\\nStack Trace:\\n\${error.stack}\` : '';
              showError(message + stack);
            });
            
            try {
              ${js}
            } catch (e) {
              const stack = e.stack ? \`\\n\\nStack Trace:\\n\${e.stack}\` : '';
              showError(e.message + stack);
              console.error(e); // Also log for developer inspection
            }
          })();
        </script>
      </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={srcDoc}
      title="Live Preview"
      sandbox="allow-scripts"
      className="w-full h-full bg-white rounded-lg border border-gray-600"
      aria-label="Live preview of user-provided code"
    />
  );
};

export default Preview;