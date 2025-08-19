import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LoginModal } from '@/components/LoginModal';
import {
  GraduationCap,
  Users,
  BarChart3,
  Shield,
  Zap,
  Brain,
  MessageCircle,
  Star,
  ChevronRight,
  CheckCircle,
  Play,
  Globe,
  Lock,
  TrendingUp,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Building,
  Calendar,
  Target,
  Sparkles
} from 'lucide-react';

// AI Features Carousel Component
function AIFeaturesCarousel() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const aiFeatures = [
    {
      icon: <Brain className="w-6 h-6 text-blue-500" />,
      title: "AI-Powered Grading",
      description: "Automated assessment and instant feedback for students"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-500" />,
      title: "Personalized Learning Paths",
      description: "AI adapts content based on individual student performance"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      title: "Predictive Analytics",
      description: "Forecast student outcomes and enrollment trends"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-orange-500" />,
      title: "Smart Communication",
      description: "AI-driven notifications and engagement insights"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % aiFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [aiFeatures.length]);

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {aiFeatures[currentFeature].icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {aiFeatures[currentFeature].title}
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        {aiFeatures[currentFeature].description}
      </p>
      <div className="flex justify-center gap-2">
        {aiFeatures.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentFeature ? 'bg-blue-500 w-6' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [openFaq, setOpenFaq] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Floating cards data for background
  const floatingCards = [
    { icon: <Users className="w-6 h-6" />, title: "Student Management", color: "bg-blue-100" },
    { icon: <Brain className="w-6 h-6" />, title: "AI Grading", color: "bg-purple-100" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics", color: "bg-green-100" },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Platform", color: "bg-red-100" },
    { icon: <MessageCircle className="w-6 h-6" />, title: "Communication", color: "bg-yellow-100" },
    { icon: <Award className="w-6 h-6" />, title: "Certifications", color: "bg-indigo-100" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Floating Background Cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingCards.map((card, index) => (
          <div
            key={index}
            className={`absolute ${card.color} rounded-2xl p-4 shadow-lg opacity-10 animate-float`}
            style={{
              left: `${10 + (index * 15)}%`,
              top: `${20 + (index * 10)}%`,
              animationDelay: `${index * 2}s`,
              animationDuration: `${8 + index}s`
            }}
          >
            <div className="flex items-center gap-2 text-slate-700">
              {card.icon}
              <span className="font-medium">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edusathi
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Features</a>
            <Link to="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Pricing</Link>
            <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">About us</a>
            <a href="#institutes" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">For Institutes</a>
            <a href="#students" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">For Students</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Contact us</a>
          </nav>

          {/* CTA Button */}
          <Button 
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 shadow-lg hover:shadow-xl transition-all"
          >
            Go to Dashboard
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Take your institute
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                online—fast.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 animate-in fade-in duration-1000 delay-300">
              Harness the power of <span className="text-purple-600 font-semibold">artificial intelligence</span> to automate grading, personalize learning, and scale your institute with intelligent insights and <span className="text-green-600 font-semibold">data-driven growth</span>.
            </p>

            {/* AI Features Carousel */}
            <div className="mb-8 animate-in fade-in duration-1000 delay-400">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 max-w-2xl mx-auto">
                <AIFeaturesCarousel />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in duration-1000 delay-500">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all">
                <Sparkles className="w-5 h-5 mr-2" />
                Experience AI Magic
              </Button>
              <Button variant="ghost" size="lg" className="border border-slate-300 hover:border-blue-400 px-8 py-3 text-lg hover:bg-blue-50 transition-all">
                <Play className="w-5 h-5 mr-2 text-blue-600" />
                See AI in Action
              </Button>
            </div>

            {/* AI Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm animate-in fade-in duration-1000 delay-700">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <Shield className="w-4 h-4" />
                AI-Secure
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Zap className="w-4 h-4" />
                Smart Automation
              </div>
              <div className="flex items-center gap-2 text-purple-600 font-medium">
                <Brain className="w-4 h-4" />
                ML-Powered
              </div>
              <div className="flex items-center gap-2 text-orange-600 font-medium">
                <Target className="w-4 h-4" />
                Predictive Analytics
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="container max-w-7xl mx-auto px-4 py-20">
          <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 text-center'>Everything you need to run your institute</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8 text-blue-500" />,
                title: "Ready-to-use digital platform",
                description: "Launch your institute online in minutes, not months"
              },
              {
                icon: <Users className="w-8 h-8 text-green-500" />,
                title: "Smart student management",
                description: "AI-powered insights for better student outcomes"
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
                title: "In-built marketing tools",
                description: "Email/SMS/WhatsApp integration for growth"
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
                title: "All-in-one dashboard",
                description: "Everything you need in one powerful interface"
              }
            ].map((item, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="rounded-2xl border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-center">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

         {/* Feature Highlights */}
        <section id="features" className="container max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Powerful features for modern education
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a successful educational institute
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12 text-blue-500" />,
                title: "AI-powered grading & personalized learning paths",
                description: "Automated assessment with personalized recommendations for each student"
              },
              {
                icon: <BarChart3 className="w-12 h-12 text-green-500" />,
                title: "Real-time performance analytics dashboards",
                description: "Track student progress, engagement, and institutional performance"
              },
              {
                icon: <Users className="w-12 h-12 text-purple-500" />,
                title: "Quick staff onboarding",
                description: "Guided dashboards to get your team up and running fast"
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-orange-500" />,
                title: "Growth Analytics",
                description: "Data-driven insights to scale your institute effectively"
              },
              {
                icon: <Shield className="w-12 h-12 text-red-500" />,
                title: "Security & compliance",
                description: "Enterprise-grade security with privacy-first approach"
              },
              {
                icon: <Award className="w-12 h-12 text-indigo-500" />,
                title: "Certification Management",
                description: "Issue and track digital certificates and achievements"
              }
            ].map((feature, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="rounded-2xl border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        

       {/* Success Stories by Numbers */}
        <section className="container max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Success Stories by Numbers
            </h2>
            <p className="text-xl text-slate-600">
              Join thousands of institutes already transforming education
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: "50,000+",
                label: "Students Enrolled ",
                description: "Active learners on our platform",
                icon: <Users className="w-8 h-8 text-white-500" />,
                color: "from-blue-500 to-blue-600"
              },
              {
                number: "1,200+",
                label: "Institutes",
                description: "Trust Edusathi worldwide",
                icon: <Building className="w-8 h-8 text-white-500" />,
                color: "from-green-500 to-green-600"
              },
              {
                number: "98%",
                label: "Satisfaction Rate",
                description: "Customer satisfaction score",
                icon: <Star className="w-8 h-8 text-white-500" />,
                color: "from-yellow-500 to-yellow-600"
              },
              {
                number: "300%",
                label: "Growth Average",
                description: "Increase in enrollments",
                icon: <TrendingUp className="w-8 h-8 text-white-500" />,
                color: "from-purple-500 to-purple-600"
              }
            ].map((stat, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 200}ms` }}>
                
                <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                    
                      <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.number}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 ">{stat.label}</h3>
                    <p className="text-sm text-slate-600">{stat.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="container max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Trusted by educators worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say about Edusathi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Priya Sharma",
                role: "Institute Director",
                avatar: "/placeholder.svg",
                rating: 5,
                quote: "Edusathi transformed our institute completely. Student engagement increased by 300% in just 6 months."
              },
              {
                name: "Rajesh Kumar",
                role: "Online Educator",
                avatar: "/placeholder.svg",
                rating: 5,
                quote: "The AI-powered grading system saves me 15 hours per week. I can focus on what matters - teaching."
              },
              {
                name: "Sarah Johnson",
                role: "Institute Owner",
                avatar: "/placeholder.svg",
                rating: 5,
                quote: "Best investment we made. Our enrollment doubled and administrative work reduced by 80%."
              }
            ].map((testimonial, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 200}ms` }}>
                <Card className="rounded-2xl border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{testimonial.name}</p>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Edusathi
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "How quickly can we get started with Edusathi?",
                a: "You can launch your institute online in less than 24 hours. Our guided onboarding process helps you set up everything from student enrollment to course creation."
              },
              {
                q: "Is our data secure and compliant?",
                a: "Yes, we use enterprise-grade encryption and are GDPR compliant. All data is stored securely with regular backups and 99.9% uptime guarantee."
              },
              {
                q: "What payment options do you support?",
                a: "We support all major payment gateways including Stripe, PayPal, Razorpay, and direct bank transfers. Students can pay via cards, UPI, net banking, and digital wallets."
              },
              {
                q: "Do you integrate with existing systems?",
                a: "Yes, we have APIs and integrations for popular tools like Zoom, Google Workspace, Microsoft Teams, Slack, and many more. Custom integrations are also available."
              },
              {
                q: "Can we customize the platform with our branding?",
                a: "Absolutely! Our white-label solution allows complete customization of colors, logos, domain, and branding to match your institute's identity."
              },
              {
                q: "What kind of support do you provide?",
                a: "We offer 24/7 support via chat, email, and phone. Premium plans include dedicated account managers and priority support with guaranteed response times."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6 bg-white/70 backdrop-blur-sm">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="container max-w-4xl mx-auto px-4 py-20 text-center">
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your institute?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of educators already using Edusathi to grow their institutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8">
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Enhanced Footer with 3D Icons */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edusathi</span>
              </div>
              <p className="text-slate-600 mb-6 max-w-md">
                All-in-one AI-powered platform for institutes. Take your institute online and grow with confidence.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-100 hover:text-blue-600 hover:scale-110 transition-all duration-300 hover:shadow-lg">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-100 hover:text-sky-600 hover:scale-110 transition-all duration-300 hover:shadow-lg">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-300 hover:shadow-lg">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-100 hover:text-pink-600 hover:scale-110 transition-all duration-300 hover:shadow-lg">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Integrations</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">API</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">About us</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Careers</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Blog</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">Cookie Policy</a>
                <a href="#" className="block text-slate-600 hover:text-blue-600 transition-colors">GDPR</a>
              </div>
            </div>
          </div>

          <Separator className="my-8" />
          
          <div className="text-center text-sm text-slate-600">
            <p>© 2025 Edusathi. All rights reserved. Made with ❤️ for educators worldwide.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
