// from https://codesandbox.io/s/xstate-solid-example-dgpd7?from-embed
import { onCleanup, batch, createEffect } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { interpret } from "xstate";

// WARNING: This is a PoC and a bit hacky
// I could have done a gone with treating the store as simple signal
// like Svelte, React, Vue implementations.
// Instead wanted to see if with a little hacking we could make
// it work granularly.This should improve performance on larger objects.

export function useMachine(machine, options = {}) {
  const service = interpret(machine, options);

  const [state, setState] = createStore({
    ...service.initialState,
    matches(...args) {
      // access state to track on value access
      state.value;
      return service.getSnapshot().matches(...args);
    }
  });
  
  createEffect(() => {
    console.log('state', state)
  })
  service.onTransition((s) => {
    // only focus on stuff that actually changes
    batch(() => {
      setState("value", s.value);
      // diff data to only update values that changes
      setState("context", reconcile(s.context));
    });
  });

  service.start();
  onCleanup(() => service.stop());

  return [state, service.send];
}
