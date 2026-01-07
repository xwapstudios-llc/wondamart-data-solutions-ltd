import dotenv from 'dotenv';

dotenv.config({path: `${process.env.WONDAMART_ROOT}/.env`, debug: true});

interface Config {
    port_api: number;
    port_server: number;

    host_server: string;
    host_local_server: string;

    nodeEnv: string;
    paystack_key: string;
    paystack_production_key: string;

    hendylinks_api_key: string;
    datamart_api_key: string;
}

const config: Config = {
    port_api: process.env.PORT_API ? parseInt(process.env.PORT_API, 10) : 3001,
    port_server: process.env.PORT_SERVER ? parseInt(process.env.PORT_SERVER, 10) : 3002,

    host_server: process.env.HOST_SERVER || 'localhost',
    host_local_server: process.env.HOST_SERVER_LOCAL || 'localhost',

    nodeEnv: process.env.NODE_ENV || 'development',

    paystack_key: process.env.PAYSTACK_TEST_KEY || 'test',
    paystack_production_key: process.env.PAYSTACK_PRODUCTION_KEY || 'production',

    hendylinks_api_key: process.env.HENDYLINKS_API_KEY || "hendylinks_api_key",
    datamart_api_key: process.env.DATABASE_API_KEY || 'datamart_api_key',
};


export default config;