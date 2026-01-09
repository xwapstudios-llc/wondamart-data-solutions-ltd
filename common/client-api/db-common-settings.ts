import { type CommonSettings } from "@common/types/common-settings";
import {collections, db} from "@common/lib/db"
import {getDoc, doc} from "firebase/firestore";

const ClCommonSettings = {
    read_all: async (): Promise<CommonSettings> => {
        const settings = await getDoc(doc(db, collections.commonSettings, "all"));
        return settings.data() as CommonSettings;
    }
}

export {
    ClCommonSettings,
}