import { sendFormData } from "../form-handle";
import { router } from "jqueryrouter";
import BodyElementsControl from "../body-elements-control";

export const commonValidatorSettings = {
    validClass: "is-valid",
    errorClass: "invalid-feedback",
    errorElement: "div",
    highlight: function (element, errorClass) {
        $(element).removeClass(errorClass).addClass("is-invalid");
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass(validClass);
        $(element).siblings(".invalid-feedback").remove();
    },
    submitHandler: (form) => {
        sendFormData(form).then((res) => {
            if (res.ok) {
                router.set("/app/user/");
                BodyElementsControl.addAppMessage("success", "Użytkownik został dodany pomyślnie");
            }
        });
    },
};
