import type { ReducedWebhook } from '@/interfaces/webhook.interface';
import 'axios';
import axios from 'axios';

export const apiClient = axios.create({
	baseURL: import.meta.env.API_URL || 'http://localhost:3000/api',
	timeout: 1000,
});

export const fetchWebhooks = async () => {
	return await apiClient.get<ReducedWebhook[]>('/webhooks');
};
