'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Append CMS-provided HTML so that <script> tags actually run (innerHTML/script injection does not).
 */
function injectHtml(html: string | null | undefined, target: 'head' | 'body'): () => void {
  if (!html?.trim()) return () => {}

  const parent = target === 'head' ? document.head : document.body
  const parser = new DOMParser()
  const doc = parser.parseFromString(html.trim(), 'text/html')
  /** Fragements land in head or body depending on tags; include both. */
  const rawNodes = [...Array.from(doc.head.childNodes), ...Array.from(doc.body.childNodes)]

  const appended: HTMLElement[] = []
  const removeAll = () => {
    appended.forEach((el) => el.parentNode?.removeChild(el))
  }

  for (const node of rawNodes) {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue

    if (node.nodeName === 'SCRIPT') {
      const s = node as HTMLScriptElement
      const script = document.createElement('script')
      for (const { name, value } of Array.from(s.attributes)) {
        script.setAttribute(name, value)
      }
      script.textContent = s.textContent
      parent.appendChild(script)
      appended.push(script)
      continue
    }

    const imported = document.importNode(node, true)
    if (imported instanceof HTMLElement) {
      parent.appendChild(imported)
      appended.push(imported)
    }
  }

  return removeAll
}

import { FloatingMessengerButtons } from './FloatingMessengerButtons'

type Props = {
  headScripts?: string | null
  bodyScripts?: string | null
  whatsappEnabled?: boolean | null
  whatsappPhone?: string | null
  botimEnabled?: boolean | null
  botimContactUrl?: string | null
  botimPhone?: string | null
  imoEnabled?: boolean | null
  imoContactUrl?: string | null
  imoPhone?: string | null
}

export const SiteIntegrations: React.FC<Props> = ({
  headScripts,
  bodyScripts,
  whatsappEnabled,
  whatsappPhone,
  botimEnabled,
  botimContactUrl,
  botimPhone,
  imoEnabled,
  imoContactUrl,
  imoPhone,
}) => {
  const headCleanup = useRef<(() => void) | undefined>(undefined)
  const bodyCleanup = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    headCleanup.current?.()
    headCleanup.current = injectHtml(headScripts, 'head')
    return () => headCleanup.current?.()
  }, [headScripts])

  useEffect(() => {
    bodyCleanup.current?.()
    bodyCleanup.current = injectHtml(bodyScripts, 'body')
    return () => bodyCleanup.current?.()
  }, [bodyScripts])

  return (
    <>
      <FloatingMessengerButtons
        whatsappEnabled={whatsappEnabled}
        whatsappPhone={whatsappPhone}
        botimEnabled={botimEnabled}
        botimContactUrl={botimContactUrl}
        botimPhone={botimPhone}
        imoEnabled={imoEnabled}
        imoContactUrl={imoContactUrl}
        imoPhone={imoPhone}
      />
    </>
  )
}
