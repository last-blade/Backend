import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },

    complete: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    subTodos: [ /* ek todo ke andar kaafi saare todos ho sakte hain, like "Groceries" naam kaa todo bana diya hai or uske andar sub todos hain kaafi saare like daal, chawal, cheeni, etc. isliye array banayi hai ki ek todo ke andar subtodos ho sakte hain*/
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubTodo",
        },
    ],
}, {timestamps: true});

export const Todo = mongoose.model("Todo", todoSchema);