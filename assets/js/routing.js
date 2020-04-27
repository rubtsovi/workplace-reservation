import { route, router } from "jqueryrouter";
import BodyElementsControl from "./body-elements-control";
import * as Templates from "./templates";
import {
    userFormRules,
    commonValidatorSettings,
    equipmentFormRules,
    workplaceFormRules,
} from "./forms-rules";

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
            $routerOutlet.html(Templates.userList({ users: data }));
            BodyElementsControl.showAddBtn(`${route}add/`);
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

route("/app/user/add/", () => {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.clearDescription();
    $routerOutlet.html(Templates.userAdd());
    $("#add-user-form").validate(Object.assign({}, userFormRules, commonValidatorSettings));
    BodyElementsControl.hideLoader();
});

route("/app/user/show/:userId/", ({}, { userId }) => {
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
            $routerOutlet.html(Templates.singleUser({ user }));
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

route("/app/equipment/", ({ route }) => {
    BodyElementsControl.showLoader();
    fetch("/app/api/get-equipment-list/", {
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
            BodyElementsControl.setHeaderText("Wyposażenie");
            BodyElementsControl.clearDescription();
            $routerOutlet.html(Templates.equipmentList({ equipments: data }));
            BodyElementsControl.showAddBtn(`${route}add/`);
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

route("/app/equipment/add/", () => {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.clearDescription();
    $routerOutlet.html(Templates.equipmentAdd());
    $("#add-equipment-form").validate(
        Object.assign({}, equipmentFormRules, commonValidatorSettings)
    );
    BodyElementsControl.hideLoader();
});

route("/app/workplace/", ({ route }) => {
    BodyElementsControl.showLoader();
    fetch("/app/api/get-workplace-list/", {
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
            BodyElementsControl.setHeaderText("Wyposażenie");
            BodyElementsControl.clearDescription();
            $routerOutlet.html(
                Templates.workplaceList({
                    workplaces: data.workplaces,
                    is_adding_allowed: data.isAddingAllowed,
                })
            );
            if (data.isAddingAllowed) {
                BodyElementsControl.showAddBtn(`${route}add/`);
            }
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

route("/app/workplace/add/", () => {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.clearDescription();
    fetch("/app/api/get-grouped-equipment/", {
        method: "get",
        credentials: "same-origin",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            $routerOutlet.html(Templates.workplaceAdd({ equipment: data }));
            $(".select2").select2({
                theme: "bootstrap4",
                placeholder: "Dodaj wyposażenie",
            });
            $("#add-workplace-form").validate(
                Object.assign({}, workplaceFormRules, commonValidatorSettings)
            );
            BodyElementsControl.hideLoader();
        });
});

route("/app/workplace/show/:workplaceId/", ({}, { workplaceId }) => {
    BodyElementsControl.showLoader();
    BodyElementsControl.hideAddBtn();
    fetch(`/app/api/get-workplace/${workplaceId}/`, {
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
            const workplace = data.workplace;
            BodyElementsControl.hideLoader();
            BodyElementsControl.setHeaderText(workplace.signature);
            BodyElementsControl.clearDescription();
            $routerOutlet.html(Templates.singleWorkplace({ workplace }));
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

route("/app/workplace/edit/:workplaceId/", ({}, { workplaceId }) => {
    BodyElementsControl.showLoader();
    BodyElementsControl.hideAddBtn();
    fetch(`/app/api/get-workplace/${workplaceId}/`, {
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
            const workplace = data.workplace;
            BodyElementsControl.hideLoader();
            BodyElementsControl.setHeaderText(workplace.signature);
            BodyElementsControl.clearDescription();
            $routerOutlet.html(Templates.workplaceAdd({ workplace, equipment: data.equipment }));
            $(".select2").select2({
                theme: "bootstrap4",
                placeholder: "Dodaj wyposażenie",
            });
            $("#add-workplace-form").validate(
                Object.assign({}, workplaceFormRules, commonValidatorSettings)
            );
        })
        .catch((e) => {
            console.log(e);
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
});

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
