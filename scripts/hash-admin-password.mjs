import {randomBytes,pbkdf2Sync} from 'node:crypto';

// Pipe a password through stdin; it is never accepted as a command-line argument.
const chunks=[];
for await(const chunk of process.stdin)chunks.push(chunk);
const password=Buffer.concat(chunks).toString('utf8').replace(/[\r\n]+$/,'');
if(password.length<16)throw Error('رمز عبور باید حداقل ۱۶ نویسه داشته باشد.');
const salt=randomBytes(16);
console.log(`ADMIN_PASSWORD_HASH=${salt.toString('hex')}:${pbkdf2Sync(password,salt,210000,32,'sha256').toString('hex')}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString('hex')}`);
