import type { Event } from '@/components/fired-events-page/columns';
import { type Webhook, type ReducedWebhook } from '@/interfaces/webhook.interface';
import 'axios';
import axios from 'axios';

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_PUBLIC_API_URL + '/api' || 'http://localhost:3000/api',
	timeout: 1000,
});

export const fetchWebhooks = async () => {
	return await apiClient.get<ReducedWebhook[]>('/webhooks');
};

export const fetchWebhook = async (id: string) => {
	return await apiClient.get<Webhook>('/webhooks/' + id);
};

export const createWebhook = async (webhook: Webhook) => {
	return await apiClient.post<Webhook>('/webhooks', webhook);
};

export const updateWebhook = async (webhook: Webhook) => {
	return await apiClient.put<Webhook>(`/webhooks/${webhook.id}`, webhook);
};

export const deleteWebhook = async (id: string) => {
	return await apiClient.delete<Webhook>(`/webhooks/${id}`);
};

export const fetchEvents = async () => {
	return await apiClient.get<Event[] | null>('/events');
};
