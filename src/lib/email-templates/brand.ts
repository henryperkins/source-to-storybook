// Shared brand styling for auth emails, derived from the app's Solstice
// theme tokens (oklch values converted to hex for email-client support).
// Body background stays #ffffff per platform rules; the cream card carries
// the brand inside.

export const colors = {
  cream: '#f7f4e6',
  ink: '#11393e',
  teal: '#177570',
  tealForeground: '#fcfaf1',
  muted: '#50686d',
  coral: '#ee8f63',
  border: '#dbd8c9',
} as const

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Figtree', Arial, sans-serif",
}

export const container = {
  backgroundColor: colors.cream,
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
  margin: '24px auto',
  padding: '32px 28px',
  maxWidth: '520px',
}

export const h1 = {
  fontFamily: "'Newsreader', Georgia, serif",
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: colors.ink,
  margin: '0 0 20px',
}

export const text = {
  fontSize: '14px',
  color: colors.muted,
  lineHeight: '1.6',
  margin: '0 0 25px',
}

export const link = { color: colors.teal, textDecoration: 'underline' }

export const button = {
  backgroundColor: colors.teal,
  color: colors.tealForeground,
  fontSize: '14px',
  border: `1px solid ${colors.teal}`,
  borderRadius: '9999px',
  padding: '12px 24px',
  textDecoration: 'none',
}

export const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: colors.ink,
  margin: '0 0 30px',
}

export const footer = {
  fontSize: '12px',
  color: colors.muted,
  margin: '30px 0 0',
}

// Rendered as a text child, which React may HTML-escape: keep this CSS free of >, &, and quotes.
// In dark mode the teal button keeps its fill but switches to ink text for contrast.
export const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: ${colors.coral} !important; border-color: ${colors.coral} !important; color: ${colors.ink} !important; }
  }
  [data-ogsc] .dm-btn { background-color: ${colors.coral} !important; border-color: ${colors.coral} !important; color: ${colors.ink} !important; }
  [data-ogsb] .dm-btn { background-color: ${colors.coral} !important; border-color: ${colors.coral} !important; color: ${colors.ink} !important; }
`
