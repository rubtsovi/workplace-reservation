import { singleWorkplaceRow, singleEquipmentRow } from "./templates";
import BodyElementsControl from "./body-elements-control";

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
                $equipmentList.append(singleEquipmentRow({ equipment, id: ++lastId }));
            });
            if (data.total_count <= data.current_page_number * data.num_items_per_page) {
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

$("body").on("click", ".show-more-workplaces", (e) => {
    BodyElementsControl.showLoader();
    const btn = e.currentTarget;
    const nextPage = btn.dataset.nextPage;
    const url = new URL("/app/api/get-workplace-list/", window.location.origin);
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
            const workplaces = data.workplaces.items;
            const $workplaceList = $("#workplace-list");
            let lastId = parseInt($workplaceList.children().last().children(".id-col").text());
            workplaces.forEach((workplace) => {
                $workplaceList.append(
                    singleWorkplaceRow({
                        workplace,
                        id: ++lastId,
                        is_adding_allowed: data.isAddingAllowed,
                    })
                );
            });
            if (
                data.workplaces.total_count <=
                data.workplaces.current_page_number * data.workplaces.num_items_per_page
            ) {
                $(btn).fadeOut("slow", function () {
                    $(this).parent().remove();
                });
            } else {
                btn.dataset.nextPage = data.current_page_number + 1;
            }
            BodyElementsControl.hideLoader();
        })
        .catch((e) => {
            console.log(e);
            e.then((e) => {
                console.log(e);
            });
        });
});
