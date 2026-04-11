import React, { Fragment } from 'react'
import { cn } from '@/utilities/ui'

import type { Page, Setting } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { PricingBlock } from '@/blocks/Pricing/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { StepsBlock } from '@/blocks/Steps/Component'
import { ProjectCardsBlock } from '@/blocks/ProjectCards/Component'
import { HeroSectionBlock } from '@/blocks/HeroSection/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { ArtisticShowcaseBlock } from '@/blocks/ArtisticShowcase/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'
import { MapComponent } from '@/blocks/Map/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  banner: BannerBlock,
  code: CodeBlock,
  pricing: PricingBlock,
  gallery: GalleryBlock,
  testimonials: TestimonialsBlock,
  faq: FAQBlock,
  stats: StatsBlock,
  steps: StepsBlock,
  projectCards: ProjectCardsBlock,
  heroSection: HeroSectionBlock,
  featureGrid: FeatureGridBlock,
  artisticShowcase: ArtisticShowcaseBlock,
  timeline: TimelineBlock,
  map: MapComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  settings?: Setting
}> = (props) => {
  const { blocks, settings } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block: any = blockComponents[blockType]

            if (Block) {
              return (
                <div
                  className={cn(index === 0 && blockType === 'heroSection' ? '' : 'my-0')}
                  key={index}
                >
                  {(Block as any) && (
                    <Block {...block} settings={settings} />
                  )}
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
