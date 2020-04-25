import { route, router } from "jqueryrouter";
import BodyElementsControl from "./body-elements-control";
import { userAdd, appDashboard, userList, singleUser } from "./templates";
import { userFormRules, commonValidatorSettings } from "./forms-rules";

let routerLinks = $("a[data-router]");
const $routerOutlet = $("#router-outlet");
let availableModules;

route("/app/user/", ({ route }) => {
    BodyElementsControl.showLoader();
    fetch("/app/api/get-user-list/", {
        method: "get",
        credentials: "same-origin",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw res.text();
            }
            return res.json();
        })
        .then((data) => {
            BodyElementsControl.hideLoader();
            BodyElementsControl.setHeaderText("Pracownicy");
            BodyElementsControl.clearDescription();
            $routerOutlet.html(userList({ users: data }));
            BodyElementsControl.showAddBtn(`${route}add/`);
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

route("/app/user/add/", ({ route }) => {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.clearDescription();
    $routerOutlet.html(userAdd());
    $("form").validate(Object.assign({}, userFormRules, commonValidatorSettings));
    BodyElementsControl.hideLoader();
});

route("/app/user/show/:userId/", ({ route }, { userId }) => {
    BodyElementsControl.showLoader();
    BodyElementsControl.hideAddBtn();
    fetch(`/app/api/get-user/${userId}/`, {
        method: "get",
        credentials: "same-origin",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw res.text();
            }

            return res.json();
        })
        .then((user) => {
            BodyElementsControl.hideLoader();
            BodyElementsControl.setHeaderText("Pracownicy");
            BodyElementsControl.clearDescription();
            $routerOutlet.html(singleUser({ user }));
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

route("/app/", ({ route }) => {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.setHeaderText("Witaj...");
    if (typeof availableModules !== "undefined") {
        $routerOutlet.html(appDashboard({ available_modules: availableModules }));
        BodyElementsControl.hideLoader();
        return true;
    }

    fetch("/app/api/get-dashboard-links/", {
        method: "get",
        credentials: "same-origin",
    })
        .then((res) => {
            return res.json();
        })
        .then((links) => {
            availableModules = links;
            $routerOutlet.html(appDashboard({ available_modules: availableModules }));
            BodyElementsControl.hideLoader();
        });
});

router.init();

$("body").on("click", "a[data-router]", (e) => {
    e.preventDefault();
    const $target = $(e.currentTarget);
    const path = $target.attr("href");
    router.set(path);
});
