import { createStore } from "vuex";
import {user} from "./modules/user";
import {page} from "./modules/page"

export default createStore({
    modules: {
        user,
        page
    },
})