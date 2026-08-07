import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  Target,
  Eye,
  Heart,
  FileText,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

const faqs = [
  {
    question: "What is UWAZI?",
    answer:
      "UWAZI is Kenya's premier public project transparency platform. It aggregates real-time data on government infrastructure projects, allowing citizens to track budgets, monitor progress, and verify on-the-ground work.",
  },
  {
    question: "How is UWAZI different from other government portals?",
    answer:
      "UWAZI combines official government data with citizen verifications, creating a two-way accountability mechanism. We also present data in accessible formats — maps, charts, and timelines — rather than dense PDF reports.",
  },
  {
    question: "Where does UWAZI get its data?",
    answer:
      "Data is sourced from the National Treasury, implementing ministries, county governments, and verified citizen uploads. All official data is cited with its source for transparency.",
  },
  {
    question: "Can I upload my own photos or reports?",
    answer:
      "Yes. Registered users can upload photos, videos, and written reports from project sites. These submissions are reviewed by our team and tagged with their verification status.",
  },
  {
    question: "Is UWAZI affiliated with the government?",
    answer:
      "UWAZI is an independent platform. While we rely on publicly available government data, we are not affiliated with any political party or government entity.",
  },
  {
    question: "How can my organization partner with UWAZI?",
    answer:
      "We welcome partnerships with civil society organizations, media houses, research institutions, and development partners. Please reach out via our contact form or email.",
  },
]

const partners = [
  "Open Government Partnership Kenya",
  "Transparency International Kenya",
  "National Treasury",
  "Ministry of Devolution",
  "World Bank Kenya",
  "African Development Bank",
  "Kenya Institute for Public Policy Research",
  "Article 19 Eastern Africa",
]

function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: _stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.getDashboardStats(),
  })

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-kenya-black py-20 md:py-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            alt="Infrastructure"
            className="h-full w-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-kenya-black/90 via-kenya-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-kenya-black/80 via-transparent to-kenya-black/30" />
        </div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <Badge className="mb-4 bg-kenya-red/20 text-kenya-red border-kenya-red/30">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
              About UWAZI
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Transparency for a Stronger Kenya
            </h1>
            <p className="mt-4 text-lg text-gray-200 leading-relaxed">
              UWAZI (Swahili for "transparency") is a civic-tech platform that gives every Kenyan
              access to real-time data on public infrastructure projects. We believe informed citizens
              are the bedrock of accountable governance.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-b border-kenya-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            <div>
              <Badge variant="secondary" className="mb-3">Our Mission</Badge>
              <h2 className="text-2xl font-bold text-kenya-black mb-4">
                To democratize access to public project data
              </h2>
              <p className="text-sm text-kenya-black/70 leading-relaxed">
                Our mission is to make government spending on infrastructure projects transparent,
                accessible, and actionable. We aggregate data from official sources, visualize it in
                intuitive formats, and empower citizens to verify project progress on the ground.
              </p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-3">Our Vision</Badge>
              <h2 className="text-2xl font-bold text-kenya-black mb-4">
                A Kenya where no shilling is unaccounted for
              </h2>
              <p className="text-sm text-kenya-black/70 leading-relaxed">
                We envision a Kenya where every citizen can effortlessly track how public resources
                are utilized, where project information is open by default, and where communities
                play an active role in verifying public works.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-kenya-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Core Values</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: ShieldCheck, title: "Integrity", desc: "Uncompromising commitment to accurate, unbiased data." },
              { icon: Eye, title: "Transparency", desc: "Open by default. We publish our sources and methodologies." },
              { icon: Heart, title: "Inclusivity", desc: "Accessible to all Kenyans regardless of literacy, region, or device." },
              { icon: Target, title: "Accountability", desc: "We create mechanisms that make it easier to hold leaders responsible." },
            ].map((value) => (
              <motion.div
                key={value.title}
                variants={item}
                className="rounded-2xl border border-kenya-border bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-kenya-red/10">
                  <value.icon className="h-6 w-6 text-kenya-red" />
                </div>
                <h3 className="text-base font-semibold text-kenya-black">{value.title}</h3>
                <p className="mt-2 text-xs text-kenya-black/70 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-y border-kenya-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Data Sources</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Official and verified sources powering UWAZI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "National Treasury", desc: "Budget allocations, disbursements, and expenditure reports.", icon: FileText },
              { name: "Implementing Ministries", desc: "Project status updates, milestone reports, and contractor records.", icon: Building2 },
              { name: "County Governments", desc: "County-level project data and Integrated Development Plans.", icon: MapPin },
              { name: "Citizen Verifications", desc: "On-ground submissions, photos, and community feedback.", icon: Users },
              { name: "Auditor General", desc: "Audit reports and compliance assessments of public projects.", icon: ShieldCheck },
              { name: "Parliamentary Reports", desc: "Committee findings and supplementary budget approvals.", icon: MessageSquare },
            ].map((source, i) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-xl border border-kenya-border bg-kenya-gray p-5"
              >
                <source.icon className="h-5 w-5 text-kenya-red mb-3" />
                <h3 className="text-sm font-semibold text-kenya-black">{source.name}</h3>
                <p className="mt-1 text-xs text-kenya-black/70 leading-relaxed">{source.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-kenya-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Partners</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Organizations working with us to advance transparency
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {partners.map((partner, _i) => (
              <motion.div
                key={partner}
                variants={item}
                className="rounded-xl border border-kenya-border bg-white p-5 text-center shadow-sm"
              >
                <p className="text-sm font-medium text-kenya-black">{partner}</p>
                <Button variant="link" size="sm" className="mt-2 text-kenya-red">
                  Learn more <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-y border-kenya-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Contact Us</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Have questions, feedback, or partnership inquiries?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {[
                { icon: Mail, label: "Email", value: "info@uwazi.or.ke" },
                { icon: Phone, label: "Phone", value: "+254 20 123 4567" },
                { icon: MapPin, label: "Address", value: "Nairobi, Kenya" },
              ].map((contact) => (
                <div key={contact.label} className="flex items-start gap-3 rounded-xl border border-kenya-border bg-kenya-gray p-4">
                  <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-kenya-red/10">
                    <contact.icon className="h-4 w-4 text-kenya-red" />
                  </div>
                  <div>
                    <p className="text-xs text-kenya-black/60">{contact.label}</p>
                    <p className="text-sm font-medium text-kenya-black">{contact.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-kenya-border bg-white p-6 shadow-sm"
            >
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-xs font-medium text-kenya-black/70">Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-kenya-border bg-kenya-gray px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kenya-red"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-kenya-black/70">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-lg border border-kenya-border bg-kenya-gray px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kenya-red"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-kenya-black/70">Message</label>
                  <textarea
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-kenya-border bg-kenya-gray px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kenya-red"
                    placeholder="How can we help?"
                  />
                </div>
                <Button type="submit" className="w-full bg-kenya-red hover:bg-kenya-red-dark text-white">
                  Send Message <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-kenya-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Frequently Asked Questions</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Quick answers to common questions
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl space-y-3"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={item}
                className="rounded-xl border border-kenya-border bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-semibold text-kenya-black">
                    <HelpCircle className="h-4 w-4 text-kenya-red shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-kenya-black/50 transition-transform",
                      openFaq === i && "rotate-180"
                    )}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm text-kenya-black/70 leading-relaxed pl-7">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
