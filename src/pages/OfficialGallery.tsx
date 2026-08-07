import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import type { Project } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react"

const categories = ["All", "Roads", "Health", "Energy", "Housing", "Transport", "Commercial"]

function OfficialGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [currentSet, setCurrentSet] = useState<Project["images"]>([])

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  })

  const allImages = useMemo(() => {
    const images: { url: string; projectTitle: string; category: string }[] = []
    projects.forEach((p) => {
      p.images.forEach((img) => {
        images.push({ url: img, projectTitle: p.title, category: p.category })
      })
    })
    return images
  }, [projects])

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return allImages
    return allImages.filter((img) => img.category === selectedCategory)
  }, [allImages, selectedCategory])

  const openLightbox = (images: string[], startIndex: number, _projectTitle: string) => {
    setCurrentSet(images)
    setCurrentImage(startIndex)
    setLightboxOpen(true)
  }

  const nextImage = () => setCurrentImage((i) => (i + 1) % currentSet.length)
  const prevImage = () => setCurrentImage((i) => (i - 1 + currentSet.length) % currentSet.length)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex gap-2">
          {categories.map((c) => (
            <Skeleton key={c} className="h-8 w-20" />
          ))}
        </div>
        <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="mb-4 h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kenya-gray py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-kenya-black">Official Gallery</h1>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search images..."
              className="h-8 w-48 rounded-md border border-kenya-border px-2 text-sm"
            />
          </div>
        </div>

        <div className="mb-4 flex gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-kenya-red text-white"
                  : "bg-white text-kenya-black/60 hover:bg-kenya-gray"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence>
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4"
          >
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-sm text-gray-500 py-8">
                No images found in this category.
              </p>
            ) : (
              filtered.map((img, _idx) => (
                <motion.div
                  key={img.url}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4"
                >
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() =>
                      openLightbox(
                        allImages
                          .filter((i) =>
                            selectedCategory === "All" || i.category === selectedCategory
                          )
                          .map((i) => i.url),
                        filtered.indexOf(img),
                        img.projectTitle
                      )
                    }
                  >
                    <img
                      src={img.url}
                      alt={img.projectTitle}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-xs font-medium">{img.projectTitle}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {img.category}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {lightboxOpen && currentSet.length > 0 && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
            >
              <motion.img
                key={currentImage}
                src={currentSet[currentImage]}
                alt="Full size"
                className="max-h-[90vh] max-w-[90vw] object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              />

              {currentSet.length > 1 && (
                <>
                  <button
                    className="absolute left-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                  >
                    <X className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    className="absolute right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              )}

              <button
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OfficialGallery
