import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Reply, Flag, Send, Pin, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Discussions() {
  const { id } = useParams()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { user } = useAppStore()

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.getProject(id!),
    enabled: !!id,
  })

  const comments = project?.comments || []

  const sortedComments = [...comments].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime()
    if (sortBy === 'popular') return b.likes - a.likes
    return 0
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const CommentItem = ({ comment, isReply = false }: { comment: any; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', isReply && 'ml-12 mt-3')}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={comment.userAvatar} />
        <AvatarFallback>{comment.userName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Card className={cn('p-4', comment.isOfficial && 'border-kenya-red/20 bg-red-50/30')}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{comment.userName}</span>
              {comment.isOfficial && (
                <Badge variant="default" className="text-xs bg-kenya-red">
                  <Shield className="w-3 h-3 mr-1" />
                  Official
                </Badge>
              )}
              {comment.pinned && (
                <Badge variant="secondary" className="text-xs">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-1 text-gray-500 hover:text-kenya-red transition-colors">
              <Heart className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-kenya-red transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>
        </Card>

        {/* Reply Form */}
        <AnimatePresence>
          {replyTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 ml-4"
            >
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                      Cancel
                    </Button>
                    <Button size="sm">Reply</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies */}
        {comment.replies?.map((reply: any) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-kenya-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-kenya-black mb-2">Discussions</h1>
          <p className="text-gray-600">
            {project ? `Community discussions about "${project.title}"` : 'Loading project...'}
          </p>
        </motion.div>

        {/* Comment Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts about this project..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    Be respectful and constructive
                  </span>
                  <Button disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sort Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Tabs value={sortBy} onValueChange={setSortBy}>
            <TabsList>
              <TabsTrigger value="newest">Newest</TabsTrigger>
              <TabsTrigger value="oldest">Oldest</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Comments List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {sortedComments.map((comment, _index) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </motion.div>

        {sortedComments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}
