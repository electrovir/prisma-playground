import {
    Authorized,
    Resolver,
    Root,
    Subscription,
} from '@electrovir/database/src/graphql/type-graphql';

@Resolver()
export class SampleResolver {
    @Authorized('ADMIN', 'MODERATOR')
    @Subscription({topics: 'NOTIFICATIONS'})
    normalSubscription(@Root() message: string): string {
        return message;
    }
}
