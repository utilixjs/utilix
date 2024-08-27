<script setup lang="ts">
import { ref, shallowRef, reactive } from "vue";
import { debounce, Interval } from "utilix";

interface DemoCtx {
	draw(): void;
	debounced(): void;
	reset(): void;
}

const ctx = shallowRef<DemoCtx | null>(null);
const frequency = ref(5);
const leading = ref(false);
const trailing = ref(true);
const rawTicks: number[] = reactive(Array(50).fill(0));
const debounceTicks: number[] = reactive(Array(50).fill(0));

function start() {
	if (ctx.value)
		return;

	let color = 1,
		rawColor = 0,
		debounceColor = 0;

	const debounced = debounce(() => {
		debounceColor = color;
	}, {
		timeout: frequency.value * 100,
		leading: leading.value,
		trailing: trailing.value
	});

	const colorSwitch = debounce(() => {
		color = (color % 10) + 1;
	}, frequency.value * 100);

	const timer = new Interval(() => {
		if (rawColor || debounceColor || debounced.isPending) {
			rawTicks.push(rawColor);
			rawTicks.shift();
			debounceTicks.push(debounceColor);
			debounceTicks.shift();
			rawColor = 0;
			debounceColor = 0;
		}
	}, 100);

	ctx.value = {
		draw() {
			rawColor = color;
		},
		debounced() {
			debounced();
			colorSwitch();
		},
		reset() {
			timer.pause();
			rawTicks.fill(0);
			debounceTicks.fill(0);
		}
	};
}

function reset() {
	if (ctx.value) {
		ctx.value.reset();
		ctx.value = null;
	}
}

function mousemove() {
	start();

	if (ctx.value) {
		ctx.value.draw();
		ctx.value.debounced();
	}
}
</script>

<template>
	<div class="grid gap-6">
		<div class="controls text-sm">
			<div>
				<label for="frequency" class="mr-3">Frequency</label>
				<input v-model="frequency" type="number" id="frequency" class="form-input w-22 text-sm" :disabled="!!ctx" />
			</div>
			<label>
				<input v-model="leading" type="checkbox" class="form-checkbox" :disabled="!!ctx" />
				<span>Leading</span>
			</label>
			<label>
				<input v-model="trailing" type="checkbox" class="form-checkbox" :disabled="!!ctx" />
				<span>Trailing</span>
			</label>
			<button v-if="ctx" @click="reset" class="px-3 py-1 rounded-md bg-[--vp-c-brand-2] hover:bg-[--vp-c-brand-3]">Reset</button>
		</div>
		<div @mousemove="mousemove" class="flex flex-col h-32 items-center justify-center b-dashed b-1 b-violet rounded-md" :class="{ 'bg-violet/10': !!ctx }">
			<span>Trigger area</span>
			<span class="text-xs c-black/50 .dark:c-white/30">Move the mouse to {{ ctx ? 'trigger the event' : 'start' }}</span>
		</div>
		<div class="grid gap-6">
			<div>
				<h5 class="mb-2">Raw events over time</h5>
				<div class="flex gap-1 justify-center">
					<div v-for="(tick, i) in rawTicks" :key="i" :class="'w-2 h-4 rounded color' + tick"></div>
				</div>
			</div>
			<div>
				<h5 class="mb-2">Debounced events</h5>
				<div class="flex gap-1 justify-center">
					<div v-for="(tick, i) in debounceTicks" :key="i" :class="'w-2 h-4 rounded color' + tick"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
.controls {
	@apply
		flex items-center justify-start gap-3
		rounded bg-violet/5 mt-5 px-4 py-2;
}


.color0 {
	background-color: rgba(0, 0, 0, 0.2);
}

.color1 {
	background-color: #FFE589
}

.color2 {
	background-color: #B9C6FF
}

.color3 {
	background-color: #99FF7E
}

.color4 {
	background-color: #FFB38A
}

.color5 {
	background-color: #A5FCFF
}

.color6 {
	background-color: #FF8E9B
}

.color7 {
	background-color: #E3FF7E
}

.color8 {
	background-color: #FFA3D8
}

.color9 {
	background-color: #5ca6ff
}

.color10 {
	background-color: #9BFFBB
}
</style>
