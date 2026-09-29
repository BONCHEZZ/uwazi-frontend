import { useState } from "react"
import type { FormEvent } from "react"
import type { Comment, Project } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import CommentItem from "./CommentItem"
import { motion, AnimatePresence } from "framer-motion"

interface CommentSectionProps {
  project: Project
  comments?: Comment[]
}

const CommentSection = function CommentSection({
  project,
  comments: initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(
    initialComments ?? project.comments
  )
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `new-${Date.now()}`,
      userId: "user-001",
      userName: "Jane Mwangi",
      userAvatar: "https://i.pravatar.cc/150?u=jane",
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      replies: [],
      isOfficial: false,
      pinned: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const addReply = (parentId: string, content: string) => {
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      userId: "user-001",
      userName: "Jane Mwangi",
      userAvatar: "https://i.pravatar.cc/150?u=jane",
      content,
      date: new Date().toISOString(),
      likes: 0,
      replies: [],
      isOfficial: false,
      pinned: false,
    }

    const addReplyToTree = (items: Comment[]): Comment[] =>
      items.map((item) => {
        if (item.id === parentId) {
          return { ...item, replies: [...item.replies, reply] }
        }
        return { ...item, replies: addReplyToTree(item.replies) }
      })

    setComments(addReplyToTree(comments))
  }

  const toggleLike = (commentId: string) => {
    const updateLikes = (items: Comment[]): Comment[] =>
      items.map((item) => {
        if (item.id === commentId) {
          return { ...item, likes: item.likes + 1 }
        }
        return { ...item, replies: updateLikes(item.replies) }
      })
    setComments(updateLikes(comments))
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://i.pravatar.cc/150?u=jane" />
              <AvatarFallback>JM</AvatarFallback>
            </Avatar>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this project..."
              className="min-h-[80px] flex-1 resize-none"
              aria-label="Comment text"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {sortedComments.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <AnimatePresence>
              {sortedComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommentItem
                    comment={comment}
                    onReply={addReply}
                    onToggleLike={toggleLike}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentSection
