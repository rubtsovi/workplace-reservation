import BodyElementsControl from "../body-elements-control";
import { userList, userAdd, singleUser } from "../templates";
import { router } from "jqueryrouter";
import { userFormRules, commonValidatorSettings } from "../forms-rules";

export function userListHandle({ route }) {
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
            $("#router-outlet").html(userList({ users: data }));
            BodyElementsControl.showAddBtn(`${route}add/`);
        })
        .catch((e) => {
            console.log(e);
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
}

export function addUserHandle() {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.clearDescription();
    $("#router-outlet").html(userAdd());
    $("#add-user-form").validate(Object.assign({}, userFormRules, commonValidatorSettings));
    BodyElementsControl.hideLoader();
}

export function singleUserHandle({}, { userId }) {
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
            $("#router-outlet").html(singleUser({ user }));
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
}
