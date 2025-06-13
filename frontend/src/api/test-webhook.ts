import axios from 'axios';

export const testWebhook = (id: string) => {
	const payload = {
		status: 'firing',
		commonLabels: {
			alertname: 'TEST',
			instance: 'TEST',
			severity: 'TEST',
		},
	};

	return axios.post(`/hook/am/${id}`, payload);
};
