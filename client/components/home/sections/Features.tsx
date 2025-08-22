import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BarChart3, Users, TrendingUp, Shield, Award } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-blue-500" />,
      title: "AI-powered grading & personalized learning paths",
      description: "Automated assessment with personalized recommendations for each student",
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-green-500" />,
      title: "Real-time performance analytics dashboards",
      description: "Track student progress, engagement, and institutional performance",
    },
    {
      icon: <Users className="w-12 h-12 text-purple-500" />,
      title: "Quick staff onboarding",
      description: "Guided dashboards to get your team up and running fast",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-orange-500" />,
      title: "Growth Analytics",
      description: "Data-driven insights to scale your institute effectively",
    },
    {
      icon: <Shield className="w-12 h-12 text-red-500" />,
      title: "Security & compliance",
      description: "Enterprise-grade security with privacy-first approach",
    },
    {
      icon: <Award className="w-12 h-12 text-indigo-500" />,
      title: "Certification Management",
      description: "Issue and track digital certificates and achievements",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 md:py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">
            Powerful features for modern education
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to run a successful educational institute
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full bg-white group">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-blue-50 group-hover:to-purple-50 transition-colors w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
