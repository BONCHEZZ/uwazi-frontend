import { Link, NavLink } from "react-router-dom"
import {
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Browse Projects", href: "/projects" },
  { name: "Medium Term Plan", href: "/medium-term-plan" },
  { name: "Data Sources", href: "/data-sources" },
  { name: "Authorized Users", href: "/authorized-users" },
]

const resources = [
  { name: "FAQs", href: "/faqs" },
  { name: "About GPRIS", href: "/gpris" },
]

const contactInfo = [
  { icon: MapPin, label: "Address", value: "MICDE Headquarters, Nairobi, Kenya" },
  { icon: Phone, label: "Phone", value: "+254 20 123 4567" },
  { icon: Mail, label: "Email", value: "info@uwazi.go.ke" },
]

const socialLinks = [
  { icon: Globe, href: "https://facebook.com", label: "Facebook" },
  { icon: Globe, href: "https://twitter.com", label: "Twitter" },
  { icon: Globe, href: "https://linkedin.com", label: "LinkedIn" },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-kenya-border bg-kenya-black text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-kenya-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-kenya-red">
                <Globe className="h-5 w-5 text-kenya-white" />
              </div>
              <span className="font-bold text-xl">UWAZI</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Kenya's public project transparency platform. Empowering citizens
              with real-time data on government infrastructure projects, budgets,
              and progress tracking.
            </p>
            <div className="flex space-x-3 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-500 transition-colors hover:bg-kenya-red hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-kenya-white font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className="hover:text-kenya-red transition-colors"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-kenya-white font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              {resources.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className="hover:text-kenya-red transition-colors"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-kenya-white font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-kenya-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-300">{item.label}</p>
                    <p className="text-gray-500">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-600">
          <p>&copy; {currentYear} UWAZI - Kenya Project Transparency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer