import BodyElementsControl from "../body-elements-control";
import { workplaceList, workplaceAdd, singleWorkplace } from "../templates";
import { router } from "jqueryrouter";
import { workplaceFormRules, commonValidatorSettings } from "../forms-rules";

export function workplaceListHandle({ route }) {
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
            $("#router-outlet").html(
                workplaceList({
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
}

export function addWorkplaceHandle() {
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
            $("#router-outlet").html(workplaceAdd({ equipment: data }));
            $(".select2").select2({
                theme: "bootstrap4",
                placeholder: "Dodaj wyposażenie",
            });
            $("#add-workplace-form").validate(
                Object.assign({}, workplaceFormRules, commonValidatorSettings)
            );
            BodyElementsControl.hideLoader();
        });
}

export function singleWorkplaceHandle({}, { workplaceId }) {
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
            $("#router-outlet").html(singleWorkplace({ workplace }));
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
}

export function workplaceEditHandle({}, { workplaceId }) {
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
            $("#router-outlet").html(workplaceAdd({ workplace, equipment: data.equipment }));
            $(".select2").select2({
                theme: "bootstrap4",
                placeholder: "Dodaj wyposażenie",
            });
            $("#add-workplace-form").validate(
                Object.assign({}, workplaceFormRules, commonValidatorSettings)
            );
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
}
