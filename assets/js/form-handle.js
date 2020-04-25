import BodyElementsControl from "./body-elements-control";

export async function sendFormData(form) {
    const data = new FormData(form);

    let responce = {};
    await fetch(form.action, {
        method: "post",
        body: data,
        credentials: "same-origin",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw res.text();
            }

            return res.text();
        })
        .then((text) => {
            responce = {
                ok: true,
                message: text,
            };
        })
        .catch((e) => {
            e.then((error) => {
                console.log(error);
                BodyElementsControl.addAppMessage("error", error);
            });
        });

    return responce;
}
