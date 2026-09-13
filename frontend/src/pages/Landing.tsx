import { Link } from "react-router-dom"
import { Building2, CheckCircle2, Users, Calendar, Briefcase, BarChart, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-primary selection:text-primary-foreground overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      {/* Header (Glassmorphism) */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-14 h-20 flex items-center border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,133,0.3)]">
            <Building2 className="text-slate-950 w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">HR<span className="text-primary">Flow</span></span>
        </div>
        <nav className="ml-auto flex gap-6 sm:gap-8 items-center">
          <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#features">
            Features
          </a>
          <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#testimonials">
            Testimonials
          </a>
          <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#pricing">
            Pricing
          </a>
          <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#faq">
            FAQ
          </a>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" to="/login">
            Sign In
          </Link>
          <Link
            to="/register"
            className="hidden sm:inline-flex items-center justify-center rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary text-slate-950 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,133,0.4)] h-10 px-6"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 flex justify-center px-4">
          <div className="container flex flex-col items-center text-center max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>The future of HR management is here</span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-8 leading-[1.1]">
              Build Better. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary animate-gradient-x">
                Code Smarter.
              </span>
            </h1>
            
            <p className="mx-auto max-w-[700px] text-lg sm:text-xl text-slate-400 mb-12">
              Streamline your entire workforce management—from onboarding and payroll to performance tracking—in one stunning, ultra-fast platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full text-base font-bold transition-all bg-primary text-slate-950 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] h-14 px-10 group"
              >
                Start your 14-day free trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="#demo"
                className="inline-flex items-center justify-center rounded-full text-base font-medium transition-all border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white h-14 px-10"
              >
                Book a Demo
              </Link>
            </div>

            {/* Dashboard Mockup Placeholder */}
            <div className="mt-20 w-full max-w-5xl aspect-video rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-2xl relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
              <div className="absolute w-[150%] h-[150%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:scale-105 transition-transform duration-1000" />
              
              <div className="relative z-20 flex flex-col items-center opacity-50">
                <BarChart className="w-20 h-20 text-primary mb-4" />
                <span className="text-2xl font-bold text-slate-300">Interactive Analytics Dashboard</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 flex justify-center relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white">
                Everything you need to scale
              </h2>
              <p className="max-w-[700px] text-slate-400 md:text-xl">
                Powerful tools designed to eliminate busywork and help you focus on your people.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { title: "Core HR", icon: Users, desc: "Manage employee records, organizational structures, and roles securely." },
                { title: "Time & Attendance", icon: Calendar, desc: "Track work hours, holidays, and leave requests effortlessly with automation." },
                { title: "Recruitment", icon: Briefcase, desc: "Post jobs, track candidates, and streamline onboarding for new hires." },
                { title: "Payroll Automation", icon: BarChart, desc: "Automate salary structures, allowances, and one-click payslip generation." },
                { title: "Enterprise Security", icon: Shield, desc: "Bank-grade encryption, role-based access control, and comprehensive audit logs." },
                { title: "Lightning Fast", icon: Zap, desc: "Built on modern architecture for sub-second load times and seamless navigation." },
              ].map((feature, idx) => (
                <div key={idx} className="group flex flex-col p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 ease-out" />
                  
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(0,255,133,0.2)] transition-all">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-24 md:py-32 flex justify-center relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white">
                Trusted by innovative teams
              </h2>
              <p className="max-w-[700px] text-slate-400 md:text-xl">
                See what our customers have to say about HRFlow.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { quote: "HRFlow completely transformed how we handle our HR processes. It's incredibly fast and the UX is unmatched.", author: "Sarah Jenkins", role: "HR Director, TechFlow" },
                { quote: "The automated onboarding alone saved us 20 hours a week. The neon green aesthetic is just a bonus that our team loves.", author: "Marcus Thorne", role: "CEO, Innovate Inc" },
                { quote: "Finally, a payroll system that doesn't feel like it was built in 1995. Clean, accurate, and blazingly fast.", author: "Elena Rodriguez", role: "Head of People, StartupX" },
              ].map((testimonial, idx) => (
                <div key={idx} className="flex flex-col p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all">
                  <div className="text-primary text-4xl leading-none mb-4">"</div>
                  <p className="text-slate-300 mb-8 flex-1">{testimonial.quote}</p>
                  <div>
                    <p className="text-white font-bold">{testimonial.author}</p>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-24 md:py-32 flex justify-center relative bg-slate-900/30">
          <div className="container px-4 md:px-6 relative z-10 max-w-4xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Do I need a credit card for the free trial?", a: "No! You get 14 days of full access to HRFlow without providing any payment information." },
                { q: "Is my data secure?", a: "Yes. We use bank-grade encryption, and your data is stored in isolated tenant environments. Security is our top priority." },
                { q: "Can I upgrade or downgrade my plan?", a: "Absolutely. You can change your subscription at any time right from your workspace settings." },
                { q: "Do you offer support during onboarding?", a: "We offer 24/7 email support and dedicated account managers for enterprise plans to ensure a smooth transition." },
              ].map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24 md:py-32 flex justify-center relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white">
                Simple, transparent pricing
              </h2>
              <p className="max-w-[700px] text-slate-400 md:text-xl">
                No hidden fees. No surprise charges. Choose the plan that best fits your growing team.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { 
                  name: "Starter", 
                  price: "$49", 
                  desc: "Perfect for small teams getting started with HR automation.", 
                  features: ["Up to 20 employees", "Core HR records", "Basic Time & Attendance", "Email support"],
                  cta: "Start Free Trial",
                  popular: false
                },
                { 
                  name: "Professional", 
                  price: "$99", 
                  desc: "Everything you need to scale your workforce efficiently.", 
                  features: ["Up to 100 employees", "Advanced Payroll", "Recruitment & Onboarding", "Performance Management", "Priority support"],
                  cta: "Start Free Trial",
                  popular: true
                },
                { 
                  name: "Enterprise", 
                  price: "Custom", 
                  desc: "Advanced security and control for large organizations.", 
                  features: ["Unlimited employees", "Custom workflows", "Dedicated Account Manager", "SSO & Advanced Security", "24/7 Phone support"],
                  cta: "Contact Sales",
                  popular: false
                },
              ].map((plan, idx) => (
                <div key={idx} className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular ? 'bg-slate-900 border-primary shadow-[0_0_30px_rgba(0,255,133,0.15)] md:-mt-8 md:mb-8 z-10' : 'bg-white/[0.03] border-white/10'} transition-all`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-slate-950 font-bold px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 mb-6 text-sm min-h-[40px]">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-slate-500">/mo</span>}
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="text-primary w-5 h-5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.price === "Custom" ? "#contact" : "/register"}
                    className={`inline-flex w-full items-center justify-center rounded-full text-sm font-bold transition-all h-12 ${plan.popular ? 'bg-primary text-slate-950 hover:bg-primary/90' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 md:py-32 flex justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px]" />
              
              <div className="flex-1 space-y-6 text-center md:text-left z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Ready to transform your HR?
                </h2>
                <p className="text-slate-400 text-lg md:text-xl">
                  Join thousands of forward-thinking companies. Start your free trial today. No credit card required.
                </p>
              </div>
              
              <div className="z-10 w-full md:w-auto">
                <Link
                  to="/register"
                  className="inline-flex w-full md:w-auto items-center justify-center rounded-full text-base font-bold transition-all bg-primary text-slate-950 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] h-16 px-10 shadow-lg"
                >
                  Create your workspace
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary w-5 h-5" />
            <span className="font-bold text-white">HRFlow</span>
          </div>
          
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} HRFlow Inc. All rights reserved.
          </p>
          
          <nav className="flex gap-6">
            <Link className="text-sm text-slate-500 hover:text-primary transition-colors" to="#">
              Terms
            </Link>
            <Link className="text-sm text-slate-500 hover:text-primary transition-colors" to="#">
              Privacy
            </Link>
            <Link className="text-sm text-slate-500 hover:text-primary transition-colors" to="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
