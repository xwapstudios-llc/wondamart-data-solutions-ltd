import { DataBundle, AdminNewDataBundle } from "@common/types/data-bundle";
import { Timestamp } from "firebase-admin/firestore";
import {dataBundleCollections} from "../collections"
import DeletedDataBundleFn from "./deleted-data-bundle-fn"
import {gen_bundle_id} from "../../utils/gen_id";


type DataBundleUpdate = Omit<DataBundle, "id" | "network" | "dataPackage" | "validityPeriod" | "createdAt" | "updatedAt">;

const DataBundleFn = {
    async create(d: AdminNewDataBundle): Promise<void> {
        const id = gen_bundle_id(d);
        const bundleDocRef = dataBundleCollections.doc(id);

        // Check if the Data Bundle document already exists.
        const bundleDoc = await bundleDocRef.get();
        if (bundleDoc.exists) {
            // If the user document exists, throw an error.
            throw {
                code: "already-exists",
                message: `Data Bundle ${id} document already exists.`
            }
        }

        // Initialize the info document.
        await bundleDocRef.set(
            {
                id: id,
                network: d.network,
                name: d.name,
                price: d.price,
                commission: d.commission,
                dataPackage: d.dataPackage,
                validityPeriod: d.validityPeriod,
                enabled: d.enabled,
                updatedAt: Timestamp.now(),
                createdAt: Timestamp.now(),
            },
            { merge: true }
        );
    },
    async read_DataBundleDoc(uid: string): Promise<DataBundle | undefined> {
        const ref = dataBundleCollections.doc(uid)
        const doc = await ref.get();
        if (doc.exists) {
            return doc.data() as DataBundle;
        }
        return undefined;
    },
    async update_DataBundleDocument(uid: string, data: DataBundleUpdate): Promise<void> {
        const ref = dataBundleCollections.doc(uid);
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error("Data Bundle doesn't exist");
        }
        await ref.set({
            ...data,
            updatedAt: Timestamp.now(),
        }, {merge: true});
    },
    async update_DataBundle_Price(uid: string, price: number): Promise<void> {
        const dataBundle = await this.read_DataBundleDoc(uid);
        if (!dataBundle) throw new Error("Data Bundle doesn't exist");
        dataBundle.price = price;
        await this.update_DataBundleDocument(uid, dataBundle);
    },
    async update_DataBundle_Commission(uid: string, commission: number): Promise<void> {
        const dataBundle = await this.read_DataBundleDoc(uid);
        if (!dataBundle) throw new Error("Data Bundle doesn't exist");
        dataBundle.commission = commission;
        await this.update_DataBundleDocument(uid, dataBundle);
    },
    async update_DataBundle_Name(uid: string, name: string): Promise<void> {
        const dataBundle = await this.read_DataBundleDoc(uid);
        if (!dataBundle) throw new Error("Data Bundle doesn't exist");
        dataBundle.name = name;
        await this.update_DataBundleDocument(uid, dataBundle);
    },
    async update_DataBundle_Enabled(uid: string, enabled: boolean): Promise<void> {
        const dataBundle = await this.read_DataBundleDoc(uid);
        if (!dataBundle) throw new Error("Data Bundle doesn't exist");
        dataBundle.enabled = enabled;
        await this.update_DataBundleDocument(uid, dataBundle);
    },
    async delete(uid: string): Promise<void> {
        const dataBundle = await this.read_DataBundleDoc(uid);
        if (!dataBundle) throw new Error("Data Bundle doesn't exist");
        await dataBundleCollections.doc(uid).delete();
        await DeletedDataBundleFn.create(dataBundle);
    },
    is_valid_providerID(providerId: any) {
        if (!providerId) return false;
        if (typeof providerId !== "string") return false;
        if (providerId.length < 2) return false;
        return providerId === "mtn" || providerId === "telecel" || providerId === "airteltigo";
    }
}

export {DataBundleFn};