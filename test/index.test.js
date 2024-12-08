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
});

describe("Space information ", () => {
    let mapId;
    let element1Id;
    let element2Id;
    let admintoken;
    let adminId; 
    let userToken;
    let userId;

    beforeAll(async () => {
        const username = "Harizibam" + Math.random();
        const password = "123456";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password, 
            type:"admin"
        });

        adminId = signupResponse.data.userId;
        
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username, 
            password
        });
        admintoken = response.data.token;

        const usersignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password, 
            type:"admin"
        });

        userId = usersignupResponse.data.userId;
        
        const userSigninresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username, 
            password
        });
        userToken = userSigninresponse.data.token;

        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
                "static": true
            },{
                headers:{
                    authorization:`Bearer ${admintoken}`
                }
        });
        
        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
                "static": true
            },{
                headers:{
                    authorization:`Bearer ${admintoken}`
                }
        });
        
        element1Id = element1.id;
        element2Id = element2.id;

        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId: element1Id,
                    x: 20,
                    y: 20
                }, {
                  elementId: element1Id,
                    x: 18,
                    y: 20
                }, {
                  elementId: element2Id,
                    x: 19,
                    y: 20
                }
            ]
         },{
            headers:{
                authorization:`Bearer ${admintoken}`
            }
         });

        mapId = map.id;
    });

    test("User is able to create a space ", async() => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
          "dimensions": "100x200",
          "mapId": mapId
       },{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });
       expect(response.spaceId).toBeDefined();
    });

    test("User is able to create a space without mapId (empty space)", async() => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
          "dimensions": "100x200"
       },{
        header:{
            authorization:`Bearer ${userToken}`
        }
    });
       expect(response.spaceId).toBeDefined();
    });
    test("User is not able to create a space without mapId and dimensions ", async() => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test"
       },{
        header:{
            authorization:`Bearer ${userToken}`
        }
    });
       expect(response.statusCode).toBe(400);
    });

    test("User is not able to delete a space that doesn't exist", async() => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space/randomIdDoesntExists`,,{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });
        expect(response.statusCode).toBe(400);
    });

    test("User is able to delete a space that does exist", async() => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
        },{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });

        expect(response.statusCode).toBe(200);
    });


    test("User should not be able to  delete a space created by another user",async() => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
        },{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            header:{
                authorization:`Bearer ${admintoken}`
            }
        });

        expect(response.statusCode).toBe(400);
    });

    test("Admin has no spaces initially ", async()=>{
        const response  = await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });
        expect(response.data.spaces.length).toBe(0);
    });

    test("Admin has no spaces initially ", async()=>{
        const spaceCreateResponse  = await axios.post (`${BACKEND_URL}/api/v1/space/`,{
            "name":"Test",
            "dimensions":"100x200",
        },{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            header:{
                authorization:`Bearer ${userToken}`
            }
        });
        const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId);
        expect(response.data.spaces.length).toBe(0);
        expect(filteredSpace.length).toBeDefined();

         

    });

});