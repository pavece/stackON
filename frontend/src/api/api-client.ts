import type { Event } from '@/components/fired-events-page/columns';
import { type Webhook, type ReducedWebhook } from '@/interfaces/webhook.interface';
import 'axios';
import axios from 'axios';

export const apiClient = axios.create({
	baseURL: (import.meta.env.VITE_PUBLIC_API_URL || '') + '/api',
	timeout: 1000,
});

export const fetchWebhooks = () => {
	return apiClient.get<ReducedWebhook[]>('/webhooks');
};

export const fetchWebhook = (id: string) => {
	return apiClient.get<Webhook>('/webhooks/' + id);
};

export const createWebhook = (webhook: Webhook) => {
	return apiClient.post<Webhook>('/webhooks', webhook);
};

export const updateWebhook = (webhook: Webhook) => {
	return apiClient.put<Webhook>(`/webhooks/${webhook.id}`, webhook);
};

export const deleteWebhook = (id: string) => {
	return apiClient.delete<Webhook>(`/webhooks/${id}`);
};

export const fetchEvents = () => {
	return apiClient.get<Event[] | null>('/events');
};
