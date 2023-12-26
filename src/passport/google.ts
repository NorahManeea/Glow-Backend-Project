import GoogleTokenStrategy from 'passport-google-id-token'
import { googleConfig } from '../config/google.config';
import { User } from '../models/userModel';

interface ParsedToken {
    payload: {
        email: string;
        email_verified: string;
        name: string;
        picture: string;
        given_name: string;
        family_name: string;
        locale: string;
    };
}
interface VerifiedCallback {
    (error: any, user?: any, info?: any): void;
}
export default function(){
    return new GoogleTokenStrategy({
        clientID: googleConfig.google.url
    },
    async(
        parsedToken: ParsedToken,
        googleId: string,
        done: VerifiedCallback
    )=>{
        try { 
            let user : any = await User.findOne({email: parsedToken.payload.email})
            if(!user){
                 user = new User({
                    email: parsedToken.payload.email,
                    firstName: parsedToken.payload.name,
                    lastName: parsedToken.payload.family_name,
                    role: 'USER',
                    isBlocked: false

                })
                user.save()
            }
            done(null, user)

           
        } catch (error) {
            done(error)
        }
    }
    )
}