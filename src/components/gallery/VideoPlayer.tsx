import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react"

interface VideoPlayerProps {
  src: string
  title?: string
  poster?: string
  className?: string
}

const VideoPlayer = function VideoPlayer({
  src,
  title,
  poster,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  const toggleFullscreen = async () => {
    if (!videoRef.current) return
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await videoRef.current.requestFullscreen()
      }
    } catch {
      // fullscreen not supported
    }
  }

  const handleTimeUpdate = () => {
    const { currentTime, duration: dur } = videoRef.current ?? { currentTime: 0, duration: 0 }
    if (dur > 0) {
      setProgress((currentTime / dur) * 100)
    }
  }

  const handleSeek = (e: React.MouseEvent) => {
    if (!videoRef.current || !duration) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = percent * duration
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => {
            setDuration((e.target as HTMLVideoElement).duration)
          }}
          onSeeked={() => setProgress(0)}
          onEnded={() => setPlaying(false)}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          {!playing && (
            <Button
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30"
              onClick={togglePlay}
              aria-label="Play video"
            >
              <Play className="h-6 w-6 fill-current" />
            </Button>
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 to-transparent"
          role="toolbar"
        >
          <div
            className="absolute inset-0 bottom-auto top-0 h-1 cursor-pointer bg-gray-400/30"
            onClick={handleSeek}
            role="slider"
            aria-label="Seek"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-kenya-red"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex h-full items-center gap-2 px-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full p-0 text-white hover:bg-white/20"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full p-0 text-white hover:bg-white/20"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            {title && <span className="text-xs text-white">{title}</span>}

            <div className="ml-auto text-xs text-white">
              {Math.floor((duration * progress) / 100 / 60)}:
              {String(Math.floor((duration * progress) / 100 % 60)).padStart(2, "0")}
              {" / "}
              {Math.floor(duration / 60)}:
              {String(Math.floor(duration % 60)).padStart(2, "0")}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full p-0 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default VideoPlayer
