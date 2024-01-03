import type { Action, Func } from '@/types';

export function setClearHandler<TID, TArgs extends any[]>(setter: Func<TID, TArgs>, clearer: Action<[TID]>) {
	let callId: TID | null = null;

	function clear() {
		if (callId) {
			clearer(callId);
			callId = null;
		}
	}

	return {
		set(...args: TArgs) {
			clear();
			callId = setter(...args);
		},
		clear,
		get id() {
			return callId;
		}
	};
}
