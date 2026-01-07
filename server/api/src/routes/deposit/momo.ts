import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {TxDepositMoMoRequest} from "@common/types/account-deposit";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {httpResponse} from "@common/types/request";


export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as Omit<TxDepositMoMoRequest, 'uid'>;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.momo.enabled) {
        return sendResponse(res, httpResponse("aborted", "This payment method is not available at the moment."));
    }

    // const tx = await TxAccountDepositFn.createAndCommit.momo(d);

    // TODO: Implement MoMo deposit logic
    return sendResponse(res, httpResponse("rejected", "MoMo deposit not implemented yet"));
};


const momo : RouteConfig = {
    path: "/momo",
    post: handler,
}
export default momo;