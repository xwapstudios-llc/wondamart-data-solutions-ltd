import createDataBundle from "@/routes/admin/data-bundle/create";
import deleteDataBundle from "@/routes/admin/data-bundle/delete";
import {RouteConfig} from "@common-server/express";

const dataBundle : RouteConfig = {
    path: "/data-bundle",
    children: [
        createDataBundle,
        deleteDataBundle,
    ],
}
export default dataBundle;