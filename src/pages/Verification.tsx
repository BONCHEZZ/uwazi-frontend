import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { verificationOptions } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, ThumbsUp, Clock, AlertTriangle, XCircle, HelpCircle, Send, Camera, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const iconMap: Record<string, any> = {
  CheckCircle,
  ThumbsUp,
  Clock,
  AlertTriangle,
  XCircle,
  HelpCircle,
}

export default function Verification() {
  const [selectedOption, setSelectedOption] = useState('')
  const [comment, setComment] = useState('')
  const [location, setLocation] = useState('')
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  })

  const { data: verificationQueue = [] } = useQuery({
    queryKey: ['verification-queue'],
    queryFn: api.getVerificationQueue,
  })

  const statusCount = (status: string) => verificationQueue.filter((item) => item.status === status).length
  const chartData = verificationOptions.map((opt) => ({
    name: opt.label,
    value: statusCount(opt.id),
    color: opt.color.includes('green') ? '#16a34a' :
           opt.color.includes('blue') ? '#3b82f6' :
           opt.color.includes('amber') ? '#f59e0b' :
           opt.color.includes('red') ? '#ef4444' : '#64748b',
  }))

  const pieData = [
    { name: 'Verified', value: statusCount('verified'), color: '#16a34a' },
    { name: 'Pending', value: statusCount('pending'), color: '#f59e0b' },
    { name: 'Rejected', value: statusCount('rejected'), color: '#ef4444' },
  ]

  return (
    <div className="min-h-screen bg-kenya-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-kenya-red" />
            <h1 className="text-3xl font-bold text-kenya-black">Project Verification</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Help verify project progress and maintain accountability. Your submissions contribute to transparent public infrastructure monitoring.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Verifications</p>
                  <p className="text-2xl font-bold text-kenya-black">15,680</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Verified Projects</p>
                  <p className="text-2xl font-bold text-kenya-black">10,192</p>
                </div>
                <ThumbsUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                  <p className="text-2xl font-bold text-kenya-black">3,136</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Verification Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Submit Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="project">Select Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project to verify" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Verification Status</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                    {verificationOptions.map(option => {
                      const Icon = iconMap[option.icon] || CheckCircle
                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedOption(option.id)}
                          className={cn(
                            'p-4 rounded-lg border-2 text-center transition-all',
                            selectedOption === option.id
                              ? 'border-kenya-red bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <Icon className={cn('w-6 h-6 mx-auto mb-2', option.color.split(' ')[0])} />
                          <p className="text-xs font-medium text-kenya-black">{option.label}</p>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="Your current location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="date">Date of Verification</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment">Additional Comments</Label>
                  <Textarea
                    id="comment"
                    placeholder="Describe what you observed..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Upload Evidence (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-kenya-red transition-colors cursor-pointer mt-2">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload photos</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Verification
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Verification Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#DE2910" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {pieData.map(entry => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
