import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {TxDepositPaystackData, TxDepositPaystackRequest} from "@common/types/account-deposit";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {httpResponse} from "@common/types/request";
import {TxAccountDepositFn} from "@common-server/fn/tx/tx-account-deposit-fn";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {TxWatcher} from "@common-server/fn/tx/tx-watcher";
import {test_paystack} from "@/paystack";
import {currency_to_paystack_amount, networkID_to_paystack_provider} from "@/paystack/charge";
import {mnotifyClient} from "@common-server/providers/mnotify/api";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as Omit<TxDepositPaystackRequest, 'uid'>;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        return sendResponse(res, httpResponse("aborted", "This payment method is no available at the moment."));
    }

    const tx = await TxAccountDepositFn.createAndCommit.paystack({...d, uid});

    if (!tx?.txId || !tx?.amount || !tx?.agentId) {
        return sendResponse(res, httpResponse("invalid-data", {
            title: "Invalid data in request",
            message: "Request expected a valid transaction id, an amount and a valid user id.",
        }));
    }

    try {
        await TxFn.update_status_processing(tx.txId);
        TxWatcher.addToWatch(tx.txId, 2);

        const data = tx.txData as TxDepositPaystackData;
        const response = await test_paystack({
            amount: currency_to_paystack_amount(tx.amount) * 1.02,
            currency: "GHS",
            email: data.email,
            mobile_money: {
                phone: data.phoneNumber,
                provider: networkID_to_paystack_provider(data.network),
            },
            reference: tx.txId,
        });

        mnotifyClient.sendSms({
            recipients: [data.phoneNumber],
            message: `We have received your paystack deposit request of ${tx.amount}. Please conform on your phone when promoted to complete the transaction.`,
        }).catch(err => console.error("Failed to send SMS notification:", err));

        return sendResponse(res, response);
    } catch (err: unknown) {
        console.error("Paystack deposit failed:", err);
        await TxFn.update_status_failed(tx.txId);
        TxWatcher.removeFromWatch(tx.txId);

        const data = tx.txData as TxDepositPaystackData;
        await mnotifyClient.sendSms({
            message: `Sorry your paystack deposit request of ${tx.amount} could not be processed. Please try again later.`,
            recipients: [data.phoneNumber]
        });

        return sendResponse(res, httpResponse("error", {
            title: "Paystack Error",
            message: `An unexpected error happened while requesting a charge to paystack. Please contact admin for support. ${err}`
        }));
    }
};

const paystack: RouteConfig = {
    path: "/paystack",
    post: handler,
};
export default paystack;
