export interface ReducedWebhook {
	title: string;
	description: string;
	type: string;
	topic: string;
	id: string;
}

export interface Webhook {
	title: string;
	description: string;
	type: string;
	topic: string;
	id: string;
	instructionNodes: object[]; //TODO: Update when diagraming is in place
	instructionConnections: object[]; //TODO: Update when diagraming is in place
}
