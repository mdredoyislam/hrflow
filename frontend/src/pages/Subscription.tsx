import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPlans, fetchCurrentSubscription, subscribeToPlan } from '@/services/subscription';
import { Check, CreditCard, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchDashboardMetrics } from '@/services/dashboard';

export default function Subscription() {
  const queryClient = useQueryClient();
  const [isAnnual, setIsAnnual] = useState(false);

  const { data: currentSub, isLoading: subLoading } = useQuery({
    queryKey: ['currentSubscription'],
    queryFn: fetchCurrentSubscription,
    retry: false, // If 404, we just have no subscription
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });

  const { data: metrics } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: fetchDashboardMetrics,
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });
      alert("Successfully subscribed!");
    }
  });

  const handleSubscribe = (planId: string) => {
    subscribeMutation.mutate(planId);
  };

  const currentEmployeeCount = metrics?.totalEmployees || 0;
  const maxUsers = currentSub?.plan_details?.max_users || 0;
  const usagePercentage = maxUsers === -1 ? 0 : Math.min(100, (currentEmployeeCount / maxUsers) * 100);

  if (subLoading || plansLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage your plan, usage, and billing settings.</p>
      </div>

      {/* Current Usage Section */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold">Current Plan: {currentSub?.plan_details?.name || 'No Active Plan'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {currentSub?.status === 'ACTIVE' ? (
                <span className="text-green-600 font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Active
                </span>
              ) : (
                <span className="text-red-500 font-medium">No active subscription found.</span>
              )}
            </p>
          </div>
          {currentSub && (
            <div className="text-right">
              <p className="text-2xl font-bold">${currentSub.plan_details.price_monthly}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">User Limits</span>
            <span className="text-muted-foreground">
              {currentEmployeeCount} / {maxUsers === -1 ? 'Unlimited' : maxUsers} Users
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                usagePercentage > 90 ? "bg-red-500" : usagePercentage > 75 ? "bg-amber-500" : "bg-primary"
              )} 
              style={{ width: `${maxUsers === -1 ? 100 : usagePercentage}%` }}
            />
          </div>
          {usagePercentage > 90 && maxUsers !== -1 && (
            <p className="text-xs text-red-500 mt-2 font-medium">You are approaching your user limit. Upgrade your plan to add more employees.</p>
          )}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl font-bold">Upgrade your plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Choose the perfect plan for your growing team. You can change plans at any time.</p>
          
          <div className="flex items-center p-1 bg-muted rounded-full border">
            <button 
              onClick={() => setIsAnnual(false)}
              className={cn("px-4 py-2 text-sm font-medium rounded-full transition-all", !isAnnual ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              Monthly billing
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={cn("px-4 py-2 text-sm font-medium rounded-full transition-all", isAnnual ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              Annual billing <span className="ml-1 text-xs text-green-600 font-bold">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {plans?.map((plan) => {
            const isCurrentPlan = currentSub?.plan === plan.id;
            const price = isAnnual ? plan.price_yearly : plan.price_monthly;
            
            return (
              <div 
                key={plan.id} 
                className={cn(
                  "bg-card rounded-2xl border p-8 flex flex-col relative transition-all duration-200 hover:shadow-md",
                  plan.name === 'Pro' ? "border-primary shadow-sm" : "border-border"
                )}
              >
                {plan.name === 'Pro' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-2 min-h-[40px]">{plan.description}</p>
                
                <div className="mt-6 mb-8">
                  <span className="text-4xl font-extrabold">${price}</span>
                  <span className="text-muted-foreground">/{isAnnual ? 'yr' : 'mo'}</span>
                </div>
                
                <button
                  disabled={isCurrentPlan || subscribeMutation.isPending}
                  onClick={() => handleSubscribe(plan.id)}
                  className={cn(
                    "w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center mb-8",
                    isCurrentPlan ? "bg-muted text-muted-foreground cursor-not-allowed" :
                    plan.name === 'Pro' ? "bg-primary text-primary-foreground hover:bg-primary/90" : 
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {isCurrentPlan ? 'Current Plan' : (subscribeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe')}
                </button>
                
                <div className="space-y-4 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Features</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
