import {dirname, join} from 'path';
import {UserConfig} from 'vite';
import baseConfig from './vite-base';

const viteConfig: UserConfig = {
    ...baseConfig,
    root: join(dirname(__dirname), 'packages', 'frontend'),
};

export default viteConfig;
