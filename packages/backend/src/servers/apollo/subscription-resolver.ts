import {
    Authorized,
    Resolver,
    Root,
    Subscription,
} from '@electrovir/database/src/graphql/type-graphql';
import {AuthRole} from './auth/auth-roles';

@Resolver()
export class SampleResolver {
    @Authorized(AuthRole.Lord)
    @Subscription({topics: 'NOTIFICATIONS'})
    normalSubscription(@Root() message: string): string {
        return message;
    }
}
