<script setup>
import Demo from './demo.vue';
</script>

# debounce

Limit the frequency of a function call by delaying its execution until a certain amount of time has passed since the last invocation. It is commonly used in scenarios where you want to prevent a function from being called too frequently, such as handling user input or event listeners.

The debounced function comes with a [`cancel` method](#cancel-method) to cancel delayed invocations and a [`flush` method](#flush-method) to immediately invoke them.

Provide an [`options` object](#debounceoptions-interface) to indicate that `func` should be invoked on the leading and/or trailing edge of the wait timeout.

Subsequent calls to the debounced function return the result of the last `func` invocation.

::: tip Note
If `leading` and `trailing` options are `true`, `func` is invoked on the trailing edge of the timeout only if the the debounced function is invoked more than once during the wait timeout.
:::

## Demo

<Demo />
