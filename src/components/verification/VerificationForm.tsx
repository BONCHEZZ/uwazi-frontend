import { useState } from "react"
import type { FormEvent } from "react"
import type { Project } from "@/types"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Camera } from "lucide-react"
import { verificationOptions } from "@/data/mockData"
import { motion, AnimatePresence } from "framer-motion"

interface VerificationFormProps {
  project: Project
  onSubmit?: (data: VerificationData) => void
}

export interface VerificationData {
  option: string
  comment: string
  photo: File | null
}

const VerificationForm = function VerificationForm({
  project,
  onSubmit,
}: VerificationFormProps) {
  const [option, setOption] = useState<string>("")
  const [comment, setComment] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!option || !comment.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      onSubmit?.({ option, comment, photo })
    }, 800)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <CheckCircle className="mx-auto mb-2 h-10 w-10 text-green-500" />
        <h3 className="text-lg font-semibold">Thank you!</h3>
        <p className="text-sm text-kenya-black/60">
          Your verification has been submitted and will be reviewed by the
          oversight team.
        </p>
      </motion.div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Citizen Verification</CardTitle>
        <CardDescription className="text-xs text-kenya-black/60">
          Verify the progress of: {project.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Verification Status</Label>
            <RadioGroup
              value={option}
              onValueChange={setOption}
              className="flex flex-col gap-1.5"
            >
              {verificationOptions.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} />
                  <Label
                    htmlFor={`opt-${opt.id}`}
                    className={cn("flex items-center gap-1.5 text-xs", opt.color)}
                  >
                    <Badge variant="outline" className={cn("text-xs", opt.color)}>
                      {opt.label}
                    </Badge>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">
              Additional Details <span className="text-kenya-red">*</span>
            </Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe what you observe. Include details about work quality, timing, or any concerns..."
              className="min-h-[80px] text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Photo Evidence (optional)</Label>
            <div
              className={cn(
                "flex h-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-kenya-border bg-kenya-gray/30 transition-colors hover:border-kenya-red"
              )}
              onClick={() => document.getElementById("photo-input")?.click()}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto mb-1 h-5 w-5 text-kenya-black/40" />
                  <span className="text-xs text-kenya-black/60">
                    Click to upload a photo
                  </span>
                </div>
              )}
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <AnimatePresence>
            {!option && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs text-kenya-red">
                  Please select a verification option
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full"
            disabled={!option || !comment.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Verification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default VerificationForm
