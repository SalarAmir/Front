import { BackgroundCommunication } from "./BackgroundCommunication.js";

export class Auth{

    static async checkLogin(){
        try{
            const response = await BackgroundCommunication.sendMessage('checkLogin', {});
            console.log('Login check response:', response);
            return response;
        }
        catch(error){
            console.error('Error checking login:', error);
        }
    }
}