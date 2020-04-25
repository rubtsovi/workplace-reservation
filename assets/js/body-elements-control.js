import "bootstrap/js/dist/util";
import "bootstrap/js/dist/toast";
import toast from "../../templates/default/toast.html.twig";

export default class BodyElementsControll {
    static setHeaderText(text) {
        $("#app-header h1").text(text);
    }

    static clearDescription() {
        $("#view-description").remove();
    }

    static setDescription(html) {
        let $descriptionBlock = $("#view-description");

        if (!$descriptionBlock.length) {
            $descriptionBlock = $("<div></div>", {
                id: "view-description",
                class: "pb-5 container",
            }).prependTo("#main-view");
        }

        $descriptionBlock.html(html);
    }

    static showLoader() {
        let $loader = $("#loader");
        if (!$loader.length) {
            $loader = $("<div></div>", {
                id: "loader",
                class:
                    "position-fixed w-100 h-100 flex-column align-items-center justify-content-center",
                css: {
                    display: "none",
                },
            })
                .html(
                    `<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>`
                )
                .appendTo("body");
        }

        $loader.fadeIn("slow");
    }

    static hideLoader() {
        $("#loader").fadeOut("slow");
    }

    static showAddBtn(href) {
        let $addBtn = $("#add-button");

        if (!$addBtn.length) {
            $addBtn = $("<a></a>", {
                id: "add-button",
                class: "d-block position-fixed zindex-modal text-primary display-3",
            })
                .html('<i class="icon icon-add_circle"></i>')
                .attr("data-router", "")
                .appendTo("body");
        }
        $addBtn.attr("href", href);
        $addBtn.animate({ bottom: 50 }, "slow");
    }

    static hideAddBtn() {
        const $addBtn = $("#add-button");
        $addBtn.animate({ bottom: "-100%" }, "slow");
    }

    static addAppMessage(type, message) {
        const toastContainer = $("#toast-container");
        toastContainer.append(toast({ type, message }));
        const addedToast = toastContainer.children().last();
        addedToast.toast({ animation: true, autohide: true, delay: 5000 });
        addedToast.toast("show");
    }
}
