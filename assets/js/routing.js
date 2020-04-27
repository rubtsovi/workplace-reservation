import { route, router } from "jqueryrouter";
import BodyElementsControl from "./body-elements-control";
import * as Templates from "./templates";
import {
    userFormRules,
    commonValidatorSettings,
    equipmentFormRules,
    workplaceFormRules,
} from "./forms-rules";
import * as RoutingHandler from "./routing-handler";

let routerLinks = $("a[data-router]");
const $routerOutlet = $("#router-outlet");
let availableModules;

route("/app/user/", RoutingHandler.userListHandle);

route("/app/user/add/", RoutingHandler.addUserHandle);

route("/app/user/show/:userId/", RoutingHandler.singleUserHandle);

route("/app/equipment/", RoutingHandler.equipmentListHandle);

route("/app/equipment/add/", RoutingHandler.equipmentAddHandle);

route("/app/workplace/", RoutingHandler.workplaceListHandle);

route("/app/workplace/add/", RoutingHandler.addWorkplaceHandle);

route("/app/workplace/show/:workplaceId/", RoutingHandler.singleWorkplaceHandle);

route("/app/workplace/edit/:workplaceId/", RoutingHandler.workplaceEditHandle);

route("/app/", () => {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.setHeaderText("Witaj...");
    if (typeof availableModules !== "undefined") {
        $routerOutlet.html(Templates.appDashboard({ available_modules: availableModules }));
        BodyElementsControl.hideLoader();
        return true;
    }

    fetch("/app/api/get-dashboard-links/", {
        method: "get",
        credentials: "same-origin",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((links) => {
            availableModules = links;
            $routerOutlet.html(Templates.appDashboard({ available_modules: availableModules }));
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
