import { sendFormData } from "../form-handle";
import { router } from "jqueryrouter";
import BodyElementsControl from "../body-elements-control";

export const commonValidatorSettings = {
    // debug: true,
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
                router.set(form.dataset.afterSuccessUrl);
                BodyElementsControl.addAppMessage("success", res.message);
            }
        });
    },
};
