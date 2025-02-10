"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RenderShorthand } from "@/lib/renderDocument"
import type { EventType } from "./events-container"

const MonthSelector: React.FC<{
  currentDate: Date
  onMonthChange: (date: Date) => void
}> = ({ currentDate, onMonthChange }) => {
  const prevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    onMonthChange(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    onMonthChange(newDate)
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="icon" onClick={prevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-lg font-semibold">
        {currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <Button variant="outline" size="icon" onClick={nextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

const EventModal: React.FC<{
  event: EventType | null
  onClose: () => void
}> = ({ event, onClose }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)

  if (!event) return null

  const eventDate: Date = new Date(event.dateAndTime)

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Button className="absolute right-4 top-4" variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>
            <div className="max-h-[200px] overflow-y-auto pr-4">
              <RenderShorthand
                document={event.description.json}
                showReadMore={!showFullDescription}
                onReadMore={() => setShowFullDescription(true)}
              />
            </div>
            <p className="mt-2">
              Time:{" "}
              {eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {event.link ? (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Buy Tickets
              </a>
            ) : (
              <span>Free Event</span>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

interface CalendarProps {
  events?: EventType[]
}

export default function Calendar({ events = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date()) // Set initial date to August 2024
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.dateAndTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  return (
    <div>
      <MonthSelector currentDate={currentDate} onMonthChange={handleMonthChange} />
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 border rounded-md"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1)
          const dayEvents = getEventsForDate(date)
          return (
            <div key={index} className="h-24 border rounded-md p-2 overflow-y-auto">
              <div className="font-semibold mb-1">{index + 1}</div>
              {dayEvents.map((event) => (
                <Badge
                  key={event.id}
                  variant="secondary"
                  className="mb-1 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  {new Date(event.dateAndTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  - {event.name}
                </Badge>
              ))}
            </div>
          )
        })}
      </div>
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}