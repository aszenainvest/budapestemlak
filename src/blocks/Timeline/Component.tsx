import React from 'react'
import type { TimelineBlock as TimelineBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import {
  Building2,
  Users2,
  ShieldCheck,
  Award,
  CheckCircle2,
  Star,
  Heart,
  Zap,
  Target,
  Briefcase,
  Globe,
  MapPin,
  Lightbulb,
  TrendingUp,
  Phone,
  Mail,
  Clock,
  Leaf,
  Settings,
  Monitor,
  Hammer,
  HardHat,
  Wrench,
  Truck,
  BarChart3,
  Compass,
  Layout,
  Trophy,
} from 'lucide-react'

const iconMap = {
  building: Building2,
  users: Users2,
  shield: ShieldCheck,
  award: Award,
  check: CheckCircle2,
  star: Star,
  heart: Heart,
  zap: Zap,
  target: Target,
  briefcase: Briefcase,
  globe: Globe,
  'map-pin': MapPin,
  lightbulb: Lightbulb,
  'trending-up': TrendingUp,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  leaf: Leaf,
  settings: Settings,
  monitor: Monitor,
  hammer: Hammer,
  'hard-hat': HardHat,
  wrench: Wrench,
  truck: Truck,
  'bar-chart': BarChart3,
  compass: Compass,
  tool: Layout,
  trophy: Trophy,
}

export const TimelineBlock: React.FC<TimelineBlockType> = ({ title, items }) => {
  return (
    <div className="container py-24 mx-auto px-4 md:px-0 bg-[var(--background)]">
      {title && (
        <h2 className="text-2xl md:text-4xl font-black mb-20 text-center tracking-tight text-[var(--primary)] uppercase">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent md:-translate-x-1/2 hidden md:block" />
        
        {/* Mobile Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-100 md:hidden" />

        <div className="space-y-12 md:space-y-24">
          {items?.map((item, index) => {
            const Icon = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null

            return (
              <div 
                key={index} 
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Dot or Icon on line */}
                {Icon ? (
                  <div className="absolute left-[18px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white z-10 border-2 border-[var(--secondary)] shadow-xl flex items-center justify-center text-[var(--secondary)]">
                    <Icon size={20} />
                  </div>
                ) : (
                  <div className="absolute left-[26px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-[var(--secondary)] z-10 border-4 border-white shadow-xl ring-2 ring-[var(--secondary)]/20" />
                )}

                {/* Content Panel */}
                <div className="w-full md:w-[45%] pl-14 md:pl-0">
                  <div 
                    className={`p-6 md:p-8 rounded-3xl border border-gray-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group cursor-default`}
                  >
                    <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--secondary)]/10 text-[var(--secondary)] mb-4 md:mb-6">
                      {item.year}
                    </span>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors duration-300 capitalize">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 md:mb-6">
                      {item.description}
                    </p>

                    {item.image && (
                      <div className="relative h-64 w-full rounded-2xl overflow-hidden mt-6">
                        <Media 
                          resource={item.image} 
                          fill 
                          imgClassName="object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer for offset (hidden on mobile) */}
                <div className="hidden md:block w-[10%]" />
                
                {/* Opposite side (Empty spacer for balance) */}
                <div className="hidden md:block w-[45%]" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
