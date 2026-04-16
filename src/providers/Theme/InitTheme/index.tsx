import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

const themeInit = `
(function () {
  document.documentElement.setAttribute('data-theme', 'light')
})();
`

export const InitTheme: React.FC = () => {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeInit }}
    />
  )
}
