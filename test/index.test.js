const axios = require("axios");
 
function sum(a,b){
    return a +b;
}

const BACKEND_URL = "http://localhost:3000";

describe('Authentication ',() => {
    test('User is able to sign up only once', async () => {
        const username = "Harizibam" + Math.random();
        const password = "123456"
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username, 
            password,
            type:"admin"
        } );
        expect(response.statusCode).toBe(200);
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username, 
            password,
            type:"admin"
        } );
        expect(updatedResponse.statusCode).toBe(400);
    });

    test('Signup request fails if the username is empty ', async() => {
        const username = "Harizibam"+Math.random();
        const password = "123456";
        
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password
        });
        expect(response.statusCode).toBe(400);
    });

    test('Signin success if the username and password are correct', async() => {
        const username = 'Harizibam' + Math.random();
        const password = "123456";

        await axios.post(`${BACKEND_URL}/api/v1/signip`, {
            username,
            password
        });


        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();

    });

    test('Signin fails if the username and password are incorrect', async() => { 
        const username = "Harizibam"+Math.random();
        const password = "123456";

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username, 
            password
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:"Wrongusername",
            password
        });

        expect(response.statusCode).toBe(403);

    });

});
    
describe('User metadata endpoints', () => {
    let token = "";
    let avatarId = "";
     beforeAll( async() => {
        const username = "Harizibam" + Math.random();
        const password = "123456";

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password, 
            type:"admin"
        });
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username, 
            password
        });
        token = response.data.token;
        
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        });

        avatarId = avatarResponse.data.avatarId;

    });

    test("User can't update their metadata with a wrong avatar id  ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId:"123123123"
        },{
            headers:{
                "authorization":`Bearer ${token}`
            }
        });
        expect(response.statusCode).toBe(400);
    });

    test("User can update their metadata ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        },{
            headers:{
                "authorization":`Bearer ${token}`
            }
        });
        expect(response.statusCode).toBe(200);
    });

    test("User is not able to update their metadata if the auth header is not present ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        });
        expect(response.statusCode).toBe(403);
    });
}); 

describe('User avatar information', () => {
    let avatarId;
    let token;
    let userId;
    beforeAll( async() => {
        const username = "Harizibam" + Math.random();
        const password = "123456";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password, 
            type:"admin"
        });

        userId = signupResponse.data.userId;
        
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username, 
            password
        });
        token = response.data.token;
        
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        });

        avatarId = avatarResponse.data.avatarId;

    });

    test("Get back avatar information for a user ", async() => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);
        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);

    });

    test("Available avatars lists the recently created avatar ", async() => {
       const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);  
        expect(response.data.avatars.length).not.toBe(0);
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currentAvatar).toBeDefined();
    });

    test("Space information ",()=>{
        let mapId;
        let element1Id;
        let element2Id;
        let token;
        let user 
        beforeAll(() => {

        });
    });

});