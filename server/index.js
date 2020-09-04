const admin = require("./firebase-config")
const express = require("express")
const bodyParser = require('body-parser')

const PORT = 8080

const app = express()

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/verify", (req, res) => {
    const idToken = req.body.token

    console.log(admin)
    // idToken comes from the client app
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;
            res.send({ uid })
         // ...
        }).catch(function(error) {
            // Handle error
            res.send("Error!")
        });
})

app.listen(PORT, () => console.log('Running on ', PORT))