import { api } from '@/lib/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: string;
  price_yearly: string;
  max_users: number;
  features: string[];
}

export interface OrganizationSubscription {
  id: string;
  plan: string;
  plan_details: SubscriptionPlan;
  status: string;
  is_annual: boolean;
  current_period_end: string | null;
}

export const fetchPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await api.get('/plans/');
  return response.data;
};

export const fetchCurrentSubscription = async (): Promise<OrganizationSubscription> => {
  const response = await api.get('/subscriptions/current/');
  return response.data;
};

export const subscribeToPlan = async (planId: string): Promise<OrganizationSubscription> => {
  const response = await api.post('/subscriptions/subscribe/', { plan_id: planId });
  return response.data;
};
