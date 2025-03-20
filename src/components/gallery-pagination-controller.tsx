"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ImageType = {
  url: string
  title?: string
  description?: string
  width: number
  height: number
  contentfulMetadata: {
    tags: [
      {
        name: string
      },
    ]
  }
}

interface GalleryPaginationControllerProps {
  images: ImageType[]
}

export default function GalleryPaginationController({ images }: GalleryPaginationControllerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Get current values from URL or use defaults - all handled client-side
  const pageParam = searchParams.get("page")
  const perPageParam = searchParams.get("perPage")

  const currentPage = pageParam ? Number.parseInt(pageParam) : 1
  const imagesPerPage = perPageParam ? Number.parseInt(perPageParam) : 50

  // Filter images based on selected tag
  const filteredImages =
    selectedTag === "all"
      ? images
      : images.filter((image) => image.contentfulMetadata.tags.some((tag) => tag.name.includes(selectedTag)))

  // Calculate total pages
  const totalFilteredImages = filteredImages.length
  const totalPages = Math.ceil(totalFilteredImages / imagesPerPage)

  // Get current page's images
  const indexOfLastImage = currentPage * imagesPerPage
  const indexOfFirstImage = indexOfLastImage - imagesPerPage
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage)

  // Create a function to update URL with new parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      router.push(`?${createQueryString("page", page.toString())}`)
    },
    [router, createQueryString],
  )

  // Handle images per page change
  const handleImagesPerPageChange = useCallback(
    (count: string) => {
      router.push(`?${createQueryString("perPage", count)}&page=1`)
    },
    [router, createQueryString],
  )

  // Reset to page 1 when tag changes
  useEffect(() => {
    if (selectedTag !== "all") {
      handlePageChange(1)
    }
  }, [selectedTag, handlePageChange])

  // Modal functions
  const openModal = (index: number) => {
    // Adjust index to account for pagination
    setCurrentImageIndex(indexOfFirstImage + index)
    setModalOpen(true)
  }

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : filteredImages.length - 1))
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < filteredImages.length - 1 ? prevIndex + 1 : 0))
  }

  // Function to generate visible page numbers
  const getVisiblePages = () => {
    const pages = []

    // Always show first page
    if (currentPage > 2) {
      pages.push(1)
    }

    // Show current page and adjacent pages
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i)
    }

    // Always show last page
    if (currentPage < totalPages - 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="w-full">
      {/* Controls Section - Now only contains the filter */}
      <div className="w-full flex flex-col component-container mt-8 mb-8 lg:mt-24">
        <div className="mb-6 flex flex-row justify-end items-center flex-wrap gap-4">
          {/* Event Filter */}
          <div className="flex flex-row items-center gap-2">
            <h5 className="font-hand">Filter by</h5>
            <Select
              onValueChange={(value) => {
                setSelectedTag(value)
                // Reset to page 1 when filter changes - handled by useEffect
              }}
              defaultValue="all"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                <SelectItem value="nest fest 2025">Nest Fest 2025</SelectItem>
                <SelectItem value="live entertainment">Live Entertainment</SelectItem>
                <SelectItem value="fundraiser">Fundraiser</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="bingo">Bingo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="component-container">
        {/* Heading */}
        <h2 className="text-center capitalize pb-8 font-display">
          {selectedTag === "all" ? "All Images" : selectedTag}
        </h2>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="cursor-pointer" onClick={() => openModal(index)}>
              <Image
                alt={image.description || ""}
                src={image.url || "/placeholder.svg"}
                width={300}
                height={150}
                className="object-cover w-full h-full"
                quality={50}
              />
            </div>
          ))}
        </div>

        {/* Pagination Controls with Images Per Page Selector - Added bottom padding */}
        <div className="mt-8 mb-16 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Images Per Page Select */}
          <div className="flex flex-row items-center gap-2 order-2 md:order-1">
            <h5 className="font-hand">Images per page</h5>
            <Select
              onValueChange={handleImagesPerPageChange}
              defaultValue={imagesPerPage.toString()}
              value={imagesPerPage.toString()}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={imagesPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="75">75</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Navigation - Simplified without ellipsis */}
          {totalPages > 1 && (
            <Pagination className="order-1 md:order-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {/* Simplified page number display without ellipsis */}
                {getVisiblePages().map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink onClick={() => handlePageChange(pageNumber)} isActive={pageNumber === currentPage}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl w-full h-auto flex items-center justify-center">
          <div className="relative w-full h-full">
            {filteredImages[currentImageIndex] && (
              <Image
                alt={filteredImages[currentImageIndex]?.description || ""}
                src={filteredImages[currentImageIndex]?.url || ""}
                width={filteredImages[currentImageIndex].width || 800}
                height={filteredImages[currentImageIndex].height || 600}
                style={{ width: "100%", height: "auto" }}
                quality={100}
                loading="eager"
              />
            )}
            <Button
              variant="default"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              onClick={goToPreviousImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              onClick={goToNextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <DialogFooter className="mt-8">
              <DialogDescription className="text-left">
                {filteredImages[currentImageIndex]?.description || ""}
              </DialogDescription>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}