import { assign, createMachine } from "xstate";
import { fetchPokemon } from "../api";

const states = {
  idle: {
    on: {
      FETCH: { entry: ['entry'], target: 'loading' }
    }
  },
  failure: {
    on: {
      RETRY: 'loading'
    }
  },
  loading: {
    entry: ['entry'],
    invoke: {
      id: 'getPokemon',
      src: () => fetchPokemon(),
      onDone: {
        actions: assign({ results: (context, event) => event.data.results} ),
        target: 'sucessful',
      },
      onError: {
        target: 'failure',
        actions: assign({ errorMessage: (context, event) => event.data.message })
      }
    }
  },
  sucessful: {
    entry: ['entry'],
    on: {
      FETCH: 'loading'
    }
  }
};

const initialContext = {
  results: [],
  errorMessage: ''
};

const machine = {
  predictableActionArguments: true,
  id: 'fetch',
  initial: 'idle',
  states,
  context: initialContext
};

const options = {
  actions: {
    entry: (ctx, evt) => console.log('entry ctx, evt', ctx, evt),
    setResults: assign((_ctx, evt: any) => {
      console.log('evt', evt)
      return ({
        results: evt.results
      })
    }),
    setErrorMessage: assign((ctx, evt: any) => ({
      errorMessage: evt.errorMessage
    }))
  }
};

export default createMachine(machine, options);
