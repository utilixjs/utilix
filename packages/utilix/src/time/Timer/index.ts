import { toValue } from "@/utils";
import type { ValueOrGetter } from "@/types";
import { type ElapseState, type ElapseOptions, Elapse } from "../Elapse";

export type TimerState = ElapseState | 'finished';

export interface TimerOptions extends ElapseOptions {
	stopOnFinish?: boolean;
}

export class Timer {
	private readonly _elapse: Elapse;
	private readonly _stopOnFinish: boolean;
	private readonly _initTime: ValueOrGetter<number>;

	private _finished: boolean;

	constructor(time: ValueOrGetter<number>, options: TimerOptions = {}) {
		this._initTime = time;
		this._stopOnFinish = options.stopOnFinish ?? true;
		this._finished = this.initTime <= 0;

		const cb = options.onTick;
		this._elapse = new Elapse({ ...options, onTick: (cb ? () => {
			this.update();
			cb(this.time);
		} : this.update) });
	}

	get initTime() {
		return toValue(this._initTime);
	}

	get time() {
		return (this._finished && this._stopOnFinish) ? 0 : (this.initTime - this._elapse.time);
	}

	get state(): TimerState {
		return this._finished ? 'finished' : this._elapse.state;
	}

	private update() {
		if (!this._finished && this.time <= 0) {
			this._finished = true;
			if (this._stopOnFinish)
				this._elapse.stop();
		}
	}

	private reset() {
		this._finished = false;
	}

	start() {
		this.reset();
		this._elapse.start();
	}

	pause() {
		this._elapse.pause();
	}

	resume() {
		this._elapse.resume();
	}

	stop() {
		this.reset();
		this._elapse.stop();
	}
}
