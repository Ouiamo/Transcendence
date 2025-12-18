import bcrypt from "bcrypt";
import crypto from "crypto";
//import { db } from '../db.js';
//import { sendConfirmationEmail } from './mailer.js';
import jwt from "jsonwebtoken";
//import { request } from "http";
//import { error } from "console";


export async function userRoutes(fastify) {

  fastify.post('/signup', async (request, reply) => {
    console.log(request.body);
    const { firstname, lastname, username, email, password } = request.body;
    //const existingUser = await db.get('SELECT id FROM users WHERE email = ? OR username = ?',
    //  [email, username]);
    //if (existingUser) {
     // return reply.code(400).send({error: 'Email or username already exists'});
    //}
    if (!password || !username || !email) {
      return reply.code(400).send({ error: 'Missing required fields'});
    }
    console.time("time of hashing");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.timeEnd("time of hashing");
    console.log("Plain password:", password);
    console.log("Hashed password:", hashedPassword);

    //const emailToken = crypto.randomBytes(32).toString('hex');

    //await db.run(`INSERT INTO users (firstname, lastname, username, email, password, email_token, is_verified)
   // VALUES (?, ?, ?, ?, ?, ?, 0)`,[firstname, lastname, username, email, hashedPassword, emailToken]);
    
      //const confirmLink = `http://localhost:3000/verify-email?token=${emailToken}`;
    //console.log("📧 Confirm email link:", confirmLink);

    //await sendConfirmationEmail(email, emailToken);

    return reply.code(201).send({message: 'User registered. Please check your email to confirm.'});
  });
}


  // fastify.post('/verify-email', async (request, reply) => {

  //   const { token } = request.query;
  //   //const user = await db.get(`SELECT id FROM users WHERE email_token = ?`, [token]);

  //   if (!user) {
  //     return reply.code(400).send({error : 'Invalid or expired token'});
  //   }
    
  //   //await db.run(`UPDATE users SET is_verified = 1 , email_token = NULL WHERE id = ?`, [user.id]);

  //   return reply.send({message: 'Email confirmed successfully!'});
  // });


//   fastify.post('/login', async (request, reply) => {
//     const {email, password} = request.body;
    
//     //const user = await db.get('SELECT id FROM users WHERE email = ?', [email]);

//     if (!user) {
//       return reply.code(400).send({error: 'Invalid email'});
//     }

//     if (!user.is_verified) {
//       return reply.code(403).send({ error: 'Please confirm your email first'});
//     }

//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) {
//       return reply.code(400).send({error : 'Invalid password'});
//     }

//     const SECRET = process.env.JWT_SECRET;
//     const token = jwt.sign({id: user.id, username: user.username}, SECRET , {expiresIn: '1h'} );
    
//     return reply.send({message : 'Login successful' }, token);
//     });
// }
