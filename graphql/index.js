import { ApolloServer } from 'apollo-server-express';
import { env } from '../config/environment';

const apolloServer = new ApolloServer({
    //Schema pending...
    playground: env.development,
});

export default apolloServer;