import React from 'react'
import type { StaticImageData } from 'next/image'

type Plan = {
  name: string;
  price: string;
  description?: string | null;
  features?: { feature: string; id?: string | null }[] | null;
  cta?: { label?: string | null; link?: string | null } | null;
  isPopular?: boolean | null;
  id?: string | null;
}

export type PricingBlockProps = {
  plans?: Plan[] | null;
}

export const PricingBlock: React.FC<PricingBlockProps> = ({ plans }) => {
  if (!plans || plans.length === 0) return null

  return (
    <div className="container py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`flex flex-col justify-between rounded-3xl p-8 ring-1 transition-all hover:scale-105 ${
              plan.isPopular
                ? 'bg-black text-white ring-black dark:bg-card dark:ring-border'
                : 'bg-white text-black ring-gray-200 dark:bg-transparent dark:ring-border'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8">{plan.name}</h3>
                {plan.isPopular && (
                  <p className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Popüler
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 opacity-70">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 opacity-90 xl:mt-10">
                {plan.features?.map((f, idx) => (
                  <li key={idx} className="flex gap-x-3">
                    <svg
                      className={`h-6 w-5 flex-none ${plan.isPopular ? 'text-primary' : 'text-primary'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.176a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.894 7.47-9.803a.75.75 0 011.052-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {f.feature}
                  </li>
                ))}
              </ul>
            </div>
            {plan.cta?.label && (
              <a
                href={plan.cta.link || '#'}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.isPopular
                    ? 'bg-primary text-white shadow-sm hover:bg-opacity-90'
                    : 'bg-black text-white dark:bg-white dark:text-black hover:bg-opacity-90'
                }`}
              >
                {plan.cta.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
