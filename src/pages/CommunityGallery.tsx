import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, MapPin, Calendar, Upload, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CommunityGallery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUpload, setSelectedUpload] = useState<any>(null)

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  })

  const communityUploads = projects?.flatMap(p => p.communityUploads) || []

  const filteredUploads = communityUploads.filter(upload => {
    const matchesSearch = upload.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         upload.userName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || upload.verificationStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

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
            <Camera className="w-8 h-8 text-kenya-red" />
            <h1 className="text-3xl font-bold text-kenya-black">Community Verification Gallery</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Citizen-submitted photos and videos verifying project progress. Help maintain transparency by contributing your own evidence.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Submit Community Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project">Select Project</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project" />
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
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Nairobi, Mombasa Road" />
                  </div>
                  <div>
                    <Label htmlFor="date">Date Taken</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea id="caption" placeholder="Describe what you're showing..." rows={3} />
                  </div>
                  <div>
                    <Label>Verification Type</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-green-50">Supports Official Update</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-red-50">Contradicts Official Update</Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Upload Media</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-kenya-red transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload photos or videos</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 up to 50MB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button>Submit Verification</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap items-center gap-4"
        >
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search uploads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredUploads.map((upload, index) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="overflow-hidden cursor-pointer" onClick={() => setSelectedUpload(upload)}>
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={upload.url}
                    alt={upload.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={cn('border', getStatusColor(upload.verificationStatus))}>
                      {upload.verificationStatus}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant={upload.supportsOfficial ? 'default' : 'danger'}>
                      {upload.supportsOfficial ? 'Supports Official' : 'Contradicts'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-kenya-black line-clamp-2 mb-2">{upload.caption}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${upload.userId}`} />
                        <AvatarFallback>{upload.userName[0]}</AvatarFallback>
                      </Avatar>
                      <span>{upload.userName}</span>
                    </div>
                    <span>{upload.dateUploaded}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{upload.location}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredUploads.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No community uploads found</p>
          </div>
        )}

        {/* Upload Detail Dialog */}
        <Dialog open={!!selectedUpload} onOpenChange={() => setSelectedUpload(null)}>
          <DialogContent className="max-w-3xl">
            {selectedUpload && (
              <>
                <DialogHeader>
                  <DialogTitle>Community Submission</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={selectedUpload.url}
                    alt={selectedUpload.caption}
                    className="w-full rounded-lg"
                  />
                  <p className="text-gray-700">{selectedUpload.caption}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedUpload.userId}`} />
                        <AvatarFallback>{selectedUpload.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedUpload.userName}</p>
                        <p className="text-gray-500 text-xs">Submitted {selectedUpload.dateUploaded}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedUpload.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Taken: {selectedUpload.dateTaken}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('border', getStatusColor(selectedUpload.verificationStatus))}>
                        {selectedUpload.verificationStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
