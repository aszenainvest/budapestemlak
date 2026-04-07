'use client'
import React, { useState } from 'react'

type FAQItem = {
  question: string;
  answer: string;
  id?: string | null;
}

export type FAQBlockProps = {
  title?: string | null;
  questions?: FAQItem[] | null;
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ title, questions }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!questions || questions.length === 0) return null

  return (
    <div className="container py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl mb-12 text-center underline decoration-primary underline-offset-8 decoration-4">
          {title || 'Sıkça Sorulan Sorular'}
        </h2>
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-border overflow-hidden">
              <button
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-card/50"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg font-semibold text-black dark:text-white pr-4">
                  {item.question}
                </span>
                <svg
                  className={`h-6 w-6 transform text-primary transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === i ? 'max-h-[1000px] opacity-100 p-6 pt-0' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p className="text-base text-gray-600 dark:text-gray-300">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
