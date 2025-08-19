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
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small institutes getting started",
      monthlyPrice: 29,
      annualPrice: 290,
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      badge: null,
      features: [
        "Up to 100 students",
        "5 courses",
        "Basic analytics",
        "Email support",
        "Mobile app access",
        "Student management",
        "Assignment tracking",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      description: "For growing institutes with advanced needs",
      monthlyPrice: 79,
      annualPrice: 790,
      icon: <Building className="w-8 h-8 text-green-500" />,
      badge: "Most Popular",
      features: [
        "Up to 500 students",
        "Unlimited courses",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "Payment integration",
        "AI-powered grading",
        "Marketing tools",
        "Parent portal",
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      description: "For large institutions with custom requirements",
      monthlyPrice: 199,
      annualPrice: 1990,
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      badge: "Best Value",
      features: [
        "Unlimited students",
        "Unlimited courses",
        "Custom analytics",
        "24/7 phone support",
        "White-label solution",
        "API access",
        "SSO integration",
        "Custom integrations",
        "Dedicated account manager",
        "Training & onboarding",
      ],
      buttonText: "Contact Sales",
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

          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6">
              Go to Dashboard
            </Button>
          </Link>
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

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-16">
              <span
                className={`${!isAnnual ? "text-slate-900" : "text-slate-500"}`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`${isAnnual ? "text-slate-900" : "text-slate-500"}`}
              >
                Annual
                <Badge className="ml-2 bg-green-100 text-green-800">
                  Save 20%
                </Badge>
              </span>
            </div>
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
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        <span className="text-lg font-normal text-slate-500">
                          /{isAnnual ? "year" : "month"}
                        </span>
                      </div>
                      {isAnnual && (
                        <div className="text-sm text-green-600 mt-1">
                          Save ${plan.monthlyPrice * 12 - plan.annualPrice}{" "}
                          annually
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Link
                      to={`/pricing/setup?plan=${plan.name}&price=${isAnnual ? plan.annualPrice : plan.monthlyPrice}&billing=${isAnnual ? "annual" : "monthly"}`}
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
