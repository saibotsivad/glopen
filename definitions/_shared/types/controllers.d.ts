export interface GlopenCtrlTaskGroupList {
	controller: {
		taskGroup: {
			list: (request: { params: string }) => Promise<{ taskGroups: Array<string> }>
		}
	}
}

export interface GlopenCtrlUserGetSelf {
	controller: {
		user: {
			getSelf: (request: { params: number }) => Promise<{ user: string }>
		}
	}
}
