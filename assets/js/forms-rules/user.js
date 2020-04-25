export const userFormRules = {
    firstName: {
        required: true,
        minlength: 3,
    },
    lastName: {
        required: true,
        minlength: 3,
    },
    email: {
        required: true,
        email: true,
    },
    phone: {
        required: true,
        phonePL: true,
    },
    password: {
        required: true,
        minlength: 8,
    },
    description: {},
};
