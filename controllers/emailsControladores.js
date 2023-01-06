const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const enviarCorreo = async (email, contrasena, accion) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

   
    transporter.verify().then(() => {
        console.log("Servidor listo para enviar correos");
    }).catch((err) => {
        console.log("Error al iniciar el servidor de correos");
    })

    if(accion === "registro"){
        transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Bienvenido/a a SECUBB",
            text: `Su contreseña es: ${contrasena}, te recomendamos cambiarla una vez hayas ingresado a la aplicación.`,
        }, (err, info) => {
            if (err) {
                return res.status(500).send({ mensaje: "error al enviar el correo" });
            } else {
                return res.status(200).send({ mensaje: "correo enviado" });
            }
        })

    }else{
        transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Recuperación de contraseña",
            text: `Su nueva contreseña es: ${contrasena}, te recomendamos cambiarla una vez hayas ingresado a la aplicación.`,
        }, (err, info) => {
            if (err) {
                return res.status(500).send({ mensaje: "error al enviar el correo" });
            } else {
                return res.status(200).send({ mensaje: "correo enviado" });
            }
        })
    }

}





module.exports = {
    enviarCorreo
}
