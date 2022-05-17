export interface GlopenMerge {
    dir: string;
    api?: string;
    ext?: string;
}

export interface GlopenConfiguration {
	default: {
		merge: Array<GlopenMerge>;
		output: string;
	};
}

export interface GlopenParams {
	openapi: string;
	merge: Array<GlopenMerge>;
}

export interface GlopenOutput {
	definition: string;
	routes: string;
}
