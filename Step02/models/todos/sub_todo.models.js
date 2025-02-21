import mongoose from "mongoose"

const subTodoSchema = new mongoose.Schema({
    content: {
        type: String, 
        required: true,
    },

    complete: {
        type: Boolean,
        default: false,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true})

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);

/*
    Question:-> What is the meaning of this "type: mongoose.Schema.Types.ObjectId".
    Answwer:-> Below:

    --> ObjectId is a special type in MongoDB that uniquely identifies a document(document kaa matlab hai koi ek particular object, jaise
    ki bhot saare user hain facebook par toh uss ek particular user ko hum document keh sakte hain database ki language mein
    example below:).

    {
        "_id": "605c72bc0345de456f0b1234",  // MongoDB ObjectId (unique identifier)
        "name": "John Doe",
        "email": "john@example.com"
    }
    This field will store the _id of a related document in the User collection.

    --> ref: "User":
        The ref option tells Mongoose that this field references another collection (collection matlab ek "model" hai) called "User".
        Mongoose will use this to perform population (i.e., linking documents from the User collection).
*/