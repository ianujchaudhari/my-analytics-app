import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  BarChart3,
  Clock,
  Hash,
  LineChart,
  MessageSquare,
  Zap,
  BarChart,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-violet-100 to-pink-100 text-gray-800"
>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <BarChart className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#analytics-tools"
          >
            Analytics Tools
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#get-started"
          >
            Get Started
          </Link>
        </nav>
      </header>


      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mb-8 text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
          TrendLytix
        </div>
        <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock the Power of Your Social Media Data with Smart Insights and
          Analytics!
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-full px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Link href="/chat">Try Now</Link>
        </Button>
      </section>

      {/* Key Features Section */}
      <section
        id="features"
        className="py-16 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg"
      >
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-semibold text-gray-800">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-indigo-500" />}
              title="Post Type Performance"
              description="Discover what content drives your audience with performance comparisons by post type."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-indigo-500" />}
              title="Engagement Trend Analysis"
              description="Identify the best days and times to post for maximum reach and engagement."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-indigo-500" />}
              title="Content Effectiveness"
              description="Optimize your posts with insights into ideal content length and style."
            />
            <FeatureCard
              icon={<Hash className="h-10 w-10 text-indigo-500" />}
              title="Hashtag/Tag Performance"
              description="Find the winning tags that boost your engagement rates."
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-indigo-500" />}
              title="Engagement Rate Breakdown"
              description="Spot the highs and lows with a detailed breakdown of your engagement rates."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-indigo-500" />}
              title="Actionable Insights"
              description="Get personalized recommendations and learn which formats work best."
            />
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section id="analytics-tools" className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-4xl font-semibold text-gray-800">
          Powerful Analytics Tools
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <DetailedFeature
            title="Advanced Comparison Reports"
            description="Create in-depth reports to compare post types, tags, or time-based performance. Uncover trends and patterns to refine your strategy."
          />
          <DetailedFeature
            title="User Behavior Insights"
            description="Dive deep into your audience's preferences and tailor your content strategy for maximum engagement and growth."
          />
          <DetailedFeature
            title="Custom Querying"
            description="Ask custom questions to drill down into the metrics that matter most to your brand and social media goals."
          />
          <DetailedFeature
            title="Content Recommendations"
            description="Uncover trends in content performance with advanced analytics. Get tailored recommendations on post types, tags, and schedules to boost engagement"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="get-started"
        className="py-20 text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
      >
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-4xl font-bold">
            Ready to Elevate Your Social Media Strategy?
          </h2>
          <p className="mb-8 text-xl">
            Start uncovering powerful insights with TrendLytix today!
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Link href="/chat">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <footer className="flex flex-col gap-2 sm:flex-row py-4 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Acme Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function DetailedFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="mb-2 text-2xl font-semibold text-indigo-500">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
