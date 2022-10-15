import 'reflect-metadata';
import {buildSchema, resolvers} from './type-graphql';

export async function buildPlaygroundSchema() {
    return await buildSchema({resolvers, validate: true});
}
