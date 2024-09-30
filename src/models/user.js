const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,

    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true,
        lowercae: true,
        validate(value){
            if(!['male','female','others'].includes(value.toLowerCase())){
                throw new Error("Gender data is not valid")
            }
        }
    },
    age:{
        type: Number,
        min: 18,
    },
    photoUrl:{
        tpye: String,
   
    },
    about:{
        type: String,
        default : "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
    },
    skills:{
        type: [String],
    }
},
{
    timestamps:true 
});

module.exports = mongoose.model("User", userSchema);
