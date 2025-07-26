import { Link } from "react-router-dom";
import {
  TrendingUp,
  BarChart3,
  Download,
  Shield,
  Smartphone,
  Heart,
  Star,
} from "lucide-react";
import SEO from "../components/SEO";

export default function LandingPage() {
  const features = [
    {
      icon: TrendingUp,
      title: "Track Trends",
      description:
        "Monitor your glucose patterns over time with interactive charts and insights.",
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description:
        "See your data in beautiful, easy-to-understand charts and graphs.",
    },
    {
      icon: Download,
      title: "Export Data",
      description:
        "Download your glucose data for sharing with healthcare providers.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your health data is encrypted and protected with enterprise-grade security.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Optimized for mobile devices with touch-friendly interface.",
    },
    {
      icon: Heart,
      title: "Health Focused",
      description:
        "Designed specifically for people managing diabetes and glucose levels.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Type 1 Diabetic",
      content:
        "This app has completely changed how I manage my diabetes. The charts are so clear and easy to understand.",
      rating: 5,
    },
    {
      name: "Michael R.",
      role: "Type 2 Diabetic",
      content:
        "Finally, a glucose tracker that's actually user-friendly. I can see my patterns at a glance.",
      rating: 5,
    },
    {
      name: "Dr. Jennifer L.",
      role: "Endocrinologist",
      content:
        "I recommend this app to my patients. The data visualization helps them understand their glucose patterns better.",
      rating: 5,
    },
  ];

  return (
    <>
      <SEO
        title="Glucose Tracker - Diabetes Management Made Simple"
        description="Track your blood glucose levels, visualize trends, and manage your diabetes effectively. Modern, mobile-first diabetes management app with secure authentication and real-time insights."
        keywords="diabetes, glucose tracker, blood sugar, diabetes management, health app, glucose monitoring, diabetes care, blood glucose levels"
        url="https://your-domain.com"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="ml-3 text-2xl font-bold text-gray-900">
                  Glucose Tracker
                </h1>
              </div>
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Take Control of Your
              <span className="text-blue-600"> Diabetes Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track your blood glucose levels, visualize trends, and make
              informed decisions about your health. Designed specifically for
              people with diabetes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Tracking Today
              </Link>
              <Link
                to="#features"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Manage Your Diabetes
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive diabetes management platform provides all the
                tools you need to track, analyze, and improve your glucose
                control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Thousands of Users
              </h2>
              <p className="text-xl text-gray-600">
                See what our users are saying about their experience with
                Glucose Tracker.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of people who are already managing their diabetes
              more effectively with Glucose Tracker.
            </p>
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold">
                    Glucose Tracker
                  </span>
                </div>
                <p className="text-gray-400">
                  Empowering people with diabetes to take control of their
                  health through better data management.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Glucose Tracking</li>
                  <li>Trend Analysis</li>
                  <li>Data Export</li>
                  <li>Mobile App</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Blog</li>
                  <li>Community</li>
                  <li>Feedback</li>
                  <li>Updates</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Glucose Tracker. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
