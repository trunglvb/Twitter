import dotenv from 'dotenv';
import argv from 'minimist';
dotenv.config();

export const IS_DEVELOPMENT = Boolean(argv(process.argv.slice(2)).development);
export const IS_PRODUCTION = Boolean(argv(process.argv.slice(2)).production);
