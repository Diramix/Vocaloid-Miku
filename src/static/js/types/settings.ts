export interface Button {
	name: string;
	text: string;
}

export interface Item {
	id: string;
	bool: boolean;
	input: string;
	buttons: Button[];
}
