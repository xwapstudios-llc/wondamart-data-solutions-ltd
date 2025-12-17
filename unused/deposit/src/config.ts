import dotenv from 'dotenv';

dotenv.config({path: "./.env"});

interface Config {
    port: number;
    nodeEnv: string;
    paystack_key: string;
    paystack_production_key?: string;
}

const config: Config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    paystack_key: process.env.PAYSTACK_TEST_KEY || 'test',
    paystack_production_key: process.env.PAYSTACK_PRODUCTION_KEY || 'production',
};


export default config;