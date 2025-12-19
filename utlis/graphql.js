import { createClient } from '@urql/vue';

export const graphqlClient = createClient({
  url: 'https://kartmania-api.vibrantick.org/graphql',
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});