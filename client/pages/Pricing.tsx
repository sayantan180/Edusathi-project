import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Check,
  Star,
  Users,
  Building,
  Crown,
  Zap,
  Shield,
  Heart,
} from "lucide-react";

export default function Pricing() {

  const plans = [
    {
      name: "1 Year Plan",
      description: "Perfect for institutes starting their journey",
      monthlyPrice: 5000,
      annualPrice: 5000,
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      badge: null,
      features: [
        "From Control",
        "Home Page",
        "AI-Chatbot",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "3 Year Plan",
      description: "For institutes with medium-term commitment",
      monthlyPrice: 7000,
      annualPrice: 7000,
      icon: <Building className="w-8 h-8 text-green-500" />,
      badge: "Most Popular",
      features: [
        "From Control",
        "Home Page",
        "AI-Chatbot",
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
    },
    {
      name: "5 Year Plan",
      description: "For institutes with long-term vision",
      monthlyPrice: 10000,
      annualPrice: 10000,
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      badge: "Best Value",
      features: [
        "From Control",
        "Home Page",
        "AI-Chatbot",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Edusathi</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/#features"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link to="/pricing" className="text-blue-600 font-medium">
              Pricing
            </Link>
            <Link
              to="/#about"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              About us
            </Link>
            <Link
              to="/#institutes"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              For Institutes
            </Link>
            <Link
              to="/#students"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              For Students
            </Link>
            <Link
              to="/#contact"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact us
            </Link>
          </nav>

        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Choose the perfect{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                plan for you
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
              Start with a free trial. Upgrade or downgrade at any time. No
              hidden fees.
            </p>

          </div>
        </section>

        {/* Pricing Plans */}
        <section className="container max-w-7xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <Card
                  className={`rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full ${
                    plan.badge
                      ? "ring-2 ring-blue-200 bg-white"
                      : "bg-white/70 backdrop-blur-sm"
                  }`}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">{plan.icon}</div>
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {plan.description}
                    </CardDescription>

                    <div className="pt-4">
                      <div className="text-4xl font-bold text-slate-900">
                        ₹{plan.annualPrice}
                        <span className="text-lg font-normal text-slate-500">
                          /{plan.name.includes("1 Year") ? "year" : plan.name.includes("3 Year") ? "3 years" : "5 years"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Link
                      to={`/pricing/setup?plan=${plan.name}&price=${plan.annualPrice}&billing=annual`}
                    >
                      <Button
                        className={`w-full ${
                          plan.buttonVariant === "default"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            : ""
                        }`}
                        variant={plan.buttonVariant}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>

                    <Separator />

                    {/* <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">Everything included:</h4>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div> */}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Still have questions? We're here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="rounded-2xl border-0 shadow-sm bg-white/70 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-slate-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container max-w-4xl mx-auto px-4 py-20 text-center">
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of educators who trust Edusathi
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-100 px-8"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
