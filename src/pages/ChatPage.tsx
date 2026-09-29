import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

type MessageRole = "user" | "assistant"

interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "Tell me about active projects",
  "What is the total budget?",
  "How do I verify a project?",
  "Show me project updates",
]

const conversations = [
  { id: "1", title: "Project Inquiry - Nairobi Expressway", date: "2024-05-12", unread: true },
  { id: "2", title: "Budget Transparency Help", date: "2024-05-10", unread: false },
  { id: "3", title: "Verification Process", date: "2024-05-08", unread: false },
  { id: "4", title: "Data Sources Question", date: "2024-05-05", unread: true },
]

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am the UWAZI AI assistant. I can help you explore government projects, budgets, and citizen verifications. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeConversation, setActiveConversation] = useState("1")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const question = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const result = await api.answerQuery(question)
      const response = result.answer ?? (typeof result === 'string' ? result : 'The UWAZI API returned no grounded answer for that question.')
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }])
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error instanceof Error ? error.message : 'Unable to reach the UWAZI knowledge API. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggested = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-kenya-gray">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex w-72 flex-col border-r border-kenya-border bg-white"
          >
            <div className="flex items-center justify-between p-4 border-b border-kenya-border">
              <h2 className="text-sm font-bold text-kenya-black">Conversations</h2>
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search conversations..."
                  className="w-full rounded-lg border border-kenya-border bg-kenya-gray pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-kenya-red"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      activeConversation === conv.id
                        ? "bg-kenya-red/10 text-kenya-red"
                        : "hover:bg-kenya-gray text-kenya-black/80"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{conv.title}</p>
                        <p className="text-[10px] text-kenya-black/50 mt-0.5">
                          {new Date(conv.date).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {conv.unread && (
                          <span className="h-2 w-2 rounded-full bg-kenya-red" />
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-kenya-border p-3">
              <div className="rounded-lg bg-kenya-gray p-3">
                <p className="text-[10px] font-medium text-kenya-black/60 uppercase tracking-wider mb-1">
                  UWAZI AI Beta
                </p>
                <p className="text-[11px] text-kenya-black/60 leading-relaxed">
                  Powered by LLM integration. Responses are generated for demonstration purposes.
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between border-b border-kenya-border bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-kenya-black">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-kenya-black">UWAZI AI Assistant</h1>
                <p className="text-[10px] text-kenya-green font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-kenya-green" />
                  Online
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
              <Sparkles className="h-3 w-3 mr-1" />
              LLM AI Integration
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="mx-auto max-w-3xl space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-kenya-black">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-kenya-red text-white rounded-br-md"
                        : "bg-white border border-kenya-border text-kenya-black rounded-bl-md shadow-sm"
                    )}
                  >
                    {message.content}
                    <p
                      className={cn(
                        "mt-1.5 text-[10px]",
                        message.role === "user" ? "text-white/70" : "text-kenya-black/50"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString("en-KE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-kenya-red/10">
                      <User className="h-4 w-4 text-kenya-red" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-kenya-black">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-kenya-border bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}

            {messages.length <= 1 && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
              >
                <p className="text-xs text-kenya-black/60 mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggested(q)}
                      className="rounded-full border border-kenya-border bg-white px-3 py-1.5 text-xs text-kenya-black/80 hover:border-kenya-red hover:text-kenya-red transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <footer className="border-t border-kenya-border bg-white p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask about projects, budgets, verifications..."
                  className="w-full rounded-xl border border-kenya-border bg-kenya-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kenya-red resize-none"
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-11 w-11 bg-kenya-red hover:bg-kenya-red-dark text-white"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] text-kenya-black/50">
              UWAZI AI can make mistakes. Please verify important information with official sources.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default ChatPage
