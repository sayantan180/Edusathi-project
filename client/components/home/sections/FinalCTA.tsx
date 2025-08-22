import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FinalCTA() {
  return (
    <section className="container max-w-4xl mx-auto px-4 py-20 text-center">
      <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your institute?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of educators already using Edusathi to grow their
            institutes
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
              Schedule Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
