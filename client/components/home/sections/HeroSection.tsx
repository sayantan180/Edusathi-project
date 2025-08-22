import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Brain, BarChart3, Shield, MessageCircle, Award, Sparkles, Play } from "lucide-react";
import BackgroundCarousel from "../ui/BackgroundCarousel";
import RotatingHeader from "../ui/RotatingHeader";
import RotatingText from "../ui/RotatingText";

export default function HeroSection() {
  // Floating cards data for background
  const floatingCards = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Student Management",
      color: "bg-blue-100",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Grading",
      color: "bg-purple-100",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics",
      color: "bg-green-100",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      color: "bg-red-100",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Communication",
      color: "bg-yellow-100",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certifications",
      color: "bg-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingCards.map((card, index) => (
          <div
            key={index}
            className={`absolute ${card.color} rounded-2xl p-4 shadow-lg opacity-10 animate-float`}
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + index * 10}%`,
              animationDelay: `${index * 2}s`,
              animationDuration: `${8 + index}s`,
            }}
          >
            <div className="flex items-center gap-2 text-slate-700">
              {card.icon}
              <span className="font-medium">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-28 text-center relative z-10">
        <BackgroundCarousel />
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <RotatingHeader />
          <p className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto mb-8 md:mb-10 animate-in fade-in duration-1000 delay-300 leading-relaxed px-4">
            Harness the power of{" "}
            <span className="text-purple-700 font-semibold">
              artificial intelligence
            </span>{" "}
            to <RotatingText /> and scale your institute with intelligent
            insights and{" "}
            <span className="text-emerald-700 font-semibold">
              data-driven growth
            </span>
            .
          </p>

          {/* Enhanced CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 md:mb-16 animate-in fade-in duration-1000 delay-500 px-4">
            <Link to="/get-started">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 md:px-10 py-4 text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto font-semibold"
              >
                <Sparkles className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                Get Started Free
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 px-8 md:px-10 py-4 text-lg md:text-xl hover:shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto font-semibold bg-white/80 backdrop-blur-sm"
            >
              <Play className="w-5 md:w-6 h-5 md:h-6 mr-3" />
              Watch Demo
            </Button>
          </div>

          {/* Enhanced Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 text-sm sm:text-base animate-in fade-in duration-1000 delay-700 px-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-2 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">
              <Shield className="w-4 md:w-5 h-4 md:h-5" />
              <span className="hidden sm:inline">AI-</span>Secure
            </div>
            <div className="flex items-center gap-2 text-blue-700 font-semibold bg-blue-50 px-3 py-2 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors">
              <Sparkles className="w-4 md:w-5 h-4 md:h-5" />
              <span className="hidden sm:inline">Smart </span>Automation
            </div>
            <div className="flex items-center gap-2 text-purple-700 font-semibold bg-purple-50 px-3 py-2 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors">
              <Brain className="w-4 md:w-5 h-4 md:h-5" />
              ML-Powered
            </div>
            <div className="flex items-center gap-2 text-orange-700 font-semibold bg-orange-50 px-3 py-2 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors">
              <Users className="w-4 md:w-5 h-4 md:h-5" />
              <span className="hidden sm:inline">Predictive </span>Analytics
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
