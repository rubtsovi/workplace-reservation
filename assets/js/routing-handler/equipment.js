import BodyElementsControl from "../body-elements-control";
import { equipmentList, equipmentAdd, singleEquipmentRow } from "../templates";
import { router } from "jqueryrouter";
import { equipmentFormRules, commonValidatorSettings } from "../forms-rules";

export function equipmentListHandle({ route }) {
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
            $("#router-outlet").html(equipmentList({ equipments: data }));
            BodyElementsControl.showAddBtn(`${route}add/`);
        })
        .catch((e) => {
            e.then((err) => {
                BodyElementsControl.addAppMessage("error", err);
                router.set("/app/");
            });
        });
}

export function equipmentAddHandle() {
    BodyElementsControl.hideAddBtn();
    BodyElementsControl.showLoader();
    BodyElementsControl.clearDescription();
    $("#router-outlet").html(equipmentAdd());
    $("#add-equipment-form").validate(
        Object.assign({}, equipmentFormRules, commonValidatorSettings)
    );
    BodyElementsControl.hideLoader();
}
