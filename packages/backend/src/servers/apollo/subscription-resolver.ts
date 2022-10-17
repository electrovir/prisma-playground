import {
    Authorized,
    Resolver,
    Root,
    Subscription,
} from '@electrovir/database/src/graphql/type-graphql';
import {Role} from './auth';

@Resolver()
export class SampleResolver {
    @Authorized(Role.Lord)
    @Subscription({topics: 'NOTIFICATIONS'})
    normalSubscription(@Root() message: string): string {
        return message;
    }
}
