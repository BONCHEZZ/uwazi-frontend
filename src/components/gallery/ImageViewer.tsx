import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageViewerProps {
  images: string[]
  alt?: string
  className?: string
  thumbnailClassName?: string
}

const ImageViewer = function ImageViewer({
  images,
  alt = "Project image",
  className,
  thumbnailClassName,
}: ImageViewerProps) {
  const [current, setCurrent] = useState(0)
  const [open, setOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 rounded-lg",
          className
        )}
      >
        <span className="text-xs text-gray-400">No images</span>
      </div>
    )
  }

  const next = () => setCurrent((i) => (i + 1) % images.length)
  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length)

  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3", className)}>
      {images.map((img, idx) => (
        <Dialog key={img} modal={false}>
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={() => {
                setCurrent(idx)
                setOpen(true)
              }}
              className={cn(
                "group relative block overflow-hidden rounded-lg border border-kenya-border bg-gray-100",
                thumbnailClassName
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${alt} ${idx + 1}`}
                className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-100"
                loading="lazy"
              />
              {images.length > 1 && (
                <span className="absolute top-1 right-1 rounded bg-black/40 px-1 text-xs text-white">
                  {idx + 1}/{images.length}
                </span>
              )}
            </button>
          </DialogTrigger>
        </Dialog>
      ))}

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="border-none bg-transparent p-0 shadow-none">
            <div className="relative flex items-center justify-center">
              <img
                src={images[current]}
                alt={`${alt} ${current + 1}`}
                className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-xl"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prev}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={next}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ImageViewer
