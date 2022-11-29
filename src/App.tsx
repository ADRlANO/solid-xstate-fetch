import { Component, For, Show } from 'solid-js';

import fetch from './machines/fetch';
import styles from './App.module.css';
import { useMachine } from '../lib/useMachine';

const App: Component = () => {
  const [fetchState, sendToFetchMachine] = useMachine(fetch)
  
  return (
    <div class={styles.App}>
      <button onClick={() => sendToFetchMachine({ type: 'FETCH' })}>Fetch</button>
      <Show when={fetchState.matches('loading')}>
        <p>Loading</p>
      </Show>
      <Show when={() => fetchState.context.results} fallback={<p>Loading</p>}>
        <For each={fetchState.context.results}>
            {person => <li>{person.name}</li>}
          </For>
      </Show>
      <Show when={fetchState.matches('failure')}>
        <p>{fetchState.context.errorMessage}</p>
      </Show>
    </div>
  );
};

export default App;
