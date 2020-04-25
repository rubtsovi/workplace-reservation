export const equipmentFormRules = {
    rules: {
        type: {
            required: true,
        },
        model: {
            required: true,
            minlength: 3,
        },
        signature: {
            required: true,
        },
        buyYear: {
            required: true,
            digits: true,
        },
        value: {
            required: true,
            number: true,
        },
        description: {},
    },
};
