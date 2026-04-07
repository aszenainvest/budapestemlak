import type { Setting } from '@/payload-types'

export const generateCSSVariables = (settings: Setting): string => {
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    textColor,
    textMutedColor,
    successColor,
    warningColor,
    errorColor,
  } = settings

  return `
    :root {
      /* Colors */
      --primary: ${primaryColor || '#1a2b3c'};
      --secondary: ${secondaryColor || '#4f46e5'};
      --accent: ${accentColor || '#8a9ab0'};
      --background: ${backgroundColor || '#ffffff'};
      --text: ${textColor || '#111827'};
      --text-muted: ${textMutedColor || '#6b7280'};
      --success: ${successColor || '#10b981'};
      --warning: ${warningColor || '#f59e0b'};
      --error: ${errorColor || '#ef4444'};

      /* Base Style Tokens */
      --radius: 8px;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    body {
      color: var(--text);
      background-color: var(--background);
    }
  `
}
