import bookSchema from "./validators/bookValidation.js";

const result = bookSchema.safeParse({

    title: "JS",

    price: -499,

});

if (result.success) {

    console.log("Validation Successful");
    console.log(result.data);

} else {

    console.log("Validation Failed");
    console.log(result.error.issues);

}