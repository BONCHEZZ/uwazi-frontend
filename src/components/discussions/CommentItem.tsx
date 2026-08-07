import type { Comment } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Reply,
  CheckCircle,
  Flag,
  MoreVertical,
} from "lucide-react"
import { cn, formatTimeAgo } from "@/lib/utils"
import { useState } from "react"

interface CommentItemProps {
  comment: Comment
  onReply?: (parentId: string, content: string) => void
  onToggleLike?: (commentId: string) => void
  depth?: number
}

const MAX_DEPTH = 5

const CommentItem = function CommentItem({
  comment,
  onReply,
  onToggleLike,
  depth = 0,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleSubmitReply = () => {
    if (!replyText.trim() || !onReply) return
    onReply(comment.id, replyText)
    setReplyText("")
    setShowReply(false)
  }

  const canReply = depth < MAX_DEPTH
  const hasReplies = comment.replies.length > 0

  return (
    <div className={cn("ml-0", depth > 0 && "ml-4 sm:ml-6")}>
      <Card className="border-none bg-kenya-gray/20 shadow-none">
        <div className="p-3">
          <div className="flex items-start gap-2.5">
            <Avatar className="h-7 w-7">
              <AvatarImage src={comment.userAvatar} />
              <AvatarFallback className="text-xs">
                {comment.userName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-xs text-kenya-black">
                  {comment.userName}
                </span>
                {comment.isOfficial && (
                  <Badge
                    variant="default"
                    className="bg-kenya-red/10 text-kenya-red text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-0.5" />
                    Official
                  </Badge>
                )}
                {comment.pinned && (
                  <Badge variant="secondary" className="text-xs">
                    Pinned
                  </Badge>
                )}
              </div>

              <p className="text-sm text-kenya-black/90">{comment.content}</p>

              <div className="flex items-center gap-3 text-kenya-black/50 text-xs">
                <button
                  type="button"
                  onClick={() => onToggleLike?.(comment.id)}
                  className="inline-flex items-center gap-0.5 hover:text-kenya-red"
                  aria-label={`Like (${comment.likes})`}
                >
                  <Heart className="h-3 w-3" />
                  <span>{comment.likes}</span>
                </button>
                {canReply && onReply && (
                  <button
                    type="button"
                    onClick={() => setShowReply(!showReply)}
                    className="inline-flex items-center gap-0.5 hover:text-kenya-red"
                  >
                    <Reply className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-0.5 hover:text-kenya-red"
                  aria-label="Report comment"
                >
                  <Flag className="h-3 w-3" />
                  <span>Report</span>
                </button>
                <span>{formatTimeAgo(new Date(comment.date))}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-30"
              aria-label="More options"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>

          {showReply && canReply && onReply && (
            <div className="mt-2 ml-9">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full resize-none rounded-md border border-kenya-border bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-kenya-red"
                rows={2}
              />
              <div className="mt-1 flex gap-1.5 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setShowReply(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs h-6"
                  disabled={!replyText.trim()}
                  onClick={handleSubmitReply}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {hasReplies && (
        <div className="ml-4 mt-1 space-y-1 sm:ml-6">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onToggleLike={onToggleLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem
