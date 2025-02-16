"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import Cookies from "js-cookie"
import { RenderShorthand } from "@/lib/renderDocument"

export interface Event {
  dateAndTime: Date
  name?: string
  description?: { json: {} }
  link: string
  facebookShareLink: string
  learnMoreLink: string
  image: {
    url: string
    description: string
    width: number
    height: number
  }
}

export default function EventBanner(props: { events: Event[] }) {
  const { events } = props
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const today = new Date()
    const todayEvent = events.find((event) => {
      const eventDate = new Date(event.dateAndTime)
      return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      )
    })

    setCurrentEvent(todayEvent || null)

    // Check if the banner was previously closed
    const bannerClosedDate = Cookies.get("eventBannerClosedDate")
    const currentDate = today.toDateString()

    if (bannerClosedDate === currentDate) {
      setIsVisible(false)
    } else {
      // If it's a new day, clear the old cookie
      Cookies.remove("eventBannerClosedDate")
    }
  }, [events])

  const handleClose = () => {
    setIsVisible(false)
    // Set a cookie with the current date
    const today = new Date()
    Cookies.set("eventBannerClosedDate", today.toDateString(), { expires: 1 })
  }

  if (!currentEvent || !isVisible) {
    return null
  }

  return (
    <div className="sticky top-0 left-0 right-0 bg-primary text-primary-foreground p-4 z-50 shadow-md overflow-y-auto max-h-[25vh] sm:max-h-none">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between min-h-[25vh] sm:min-h-0">
        <div className="flex-1 text-center sm:text-left mb-4 sm:mb-0 overflow-y-auto max-h-[15vh] sm:max-h-none">
          <h2 className="font-bold text-lg">{currentEvent.name}</h2>
          {currentEvent.description && (
            <div className="text-sm mt-1">
              <RenderShorthand showReadMore={false} document={currentEvent.description.json} />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {currentEvent.learnMoreLink && (
            <Link
              href={currentEvent.learnMoreLink}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              Learn More
            </Link>
          )}
          {currentEvent.link && (
            <div>
              <Link
                href={currentEvent.link}
                className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Buy Tickets
              </Link>
            </div>
          )}
          <button
            className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            aria-label="Close banner"
            onClick={handleClose}
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

