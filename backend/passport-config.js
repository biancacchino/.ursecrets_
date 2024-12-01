const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

//user authentication
function initialize(passport, getUsername, getUserById) {
    const auth = async (username, password, done) => {
        const user = getUsername(username)
        if (user == null){
            return done(null,false,{message:" no user found"})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null,user)
            } else {
                return done(null,false, {message: "password inncorct!"})
            }

        } catch (error) {
            console.log("error")
            return done(error)
        }

    }


    passport.use(new localStrategy({usernameField: 'username'}, auth))
    passport.serializeUser((user,done) => done(null, user.id))
    passport.deserializeUser((id,done) => {
        return done(null, getUserById(id))
    })

}

module.exports = initialize