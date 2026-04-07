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
    baseFontSize,
    baseLineHeight,
    fonts,
    containerMaxWidth,
    baseSpacing,
    gridGutterMobile,
    gridGutterDesktop,
    radius,
    shadows,
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

      /* Typography */
      --base-font-size: ${baseFontSize || 16}px;
      --base-line-height: ${baseLineHeight || '1.5'};
      --font-heading: ${fonts?.headingFont || 'Geist Sans, sans-serif'};
      --font-body: ${fonts?.bodyFont || 'Geist Sans, sans-serif'};

      /* Layout & Spacing */
      --container-max-width: ${containerMaxWidth || '1280px'};
      --base-spacing: ${baseSpacing || 4}px;
      --grid-gutter-mobile: ${gridGutterMobile || '1rem'};
      --grid-gutter-desktop: ${gridGutterDesktop || '2.5rem'};

      /* Radius */
      --radius-sm: ${radius?.sm || '4px'};
      --radius-md: ${radius?.md || '8px'};
      --radius-lg: ${radius?.lg || '16px'};

      /* Shadows */
      --shadow-sm: ${shadows?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
      --shadow-md: ${shadows?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
      --shadow-lg: ${shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
    }

    body {
      font-family: var(--font-body);
      font-size: var(--base-font-size);
      line-height: var(--base-line-height);
      color: var(--text);
      background-color: var(--background);
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
    }
  `
}
