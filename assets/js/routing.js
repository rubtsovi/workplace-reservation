import { route, router } from "jqueryrouter";
import BodyElementsControl from "./body-elements-control";
import * as Templates from "./templates";
import { userFormRules, commonValidatorSettings, equipmentFormRules } from "./forms-rules";

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

$("body").on("click", ".show-more-equipments", (e) => {
    BodyElementsControl.showLoader();
    const btn = e.currentTarget;
    const nextPage = btn.dataset.nextPage;
    const url = new URL("/app/api/get-equipment-list/", window.location.origin);
    url.searchParams.append("page", nextPage);
    fetch(url.pathname + url.search, {
        method: "get",
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
            const equipments = data.items;
            const $equipmentList = $("#equipment-list");
            let lastId = parseInt($equipmentList.children().last().children(".id-col").text());
            equipments.forEach((equipment) => {
                $equipmentList.append(Templates.singleEquipmentRow({ equipment, id: ++lastId }));
            });
            if (data.total_count < data.current_page_number * data.num_items_per_page) {
                $(btn).fadeOut("slow", function () {
                    $(this).parent().remove();
                });
            } else {
                btn.dataset.nextPage = data.current_page_number + 1;
            }
            BodyElementsControl.hideLoader();
        })
        .catch((e) => {
            e.then((e) => {
                console.log(e);
            });
        });
});
