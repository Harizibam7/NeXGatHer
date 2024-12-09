const axios = require('axios');
const BACKEND_URL = "http://localhost:3000";

describe("Authentication" ,() => {

    test('User is able to signup only once ', async () => {
        const username = "Harizibam"+Math.random();
        const password = "123456";
        
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        });

        expect(response.status).toBe(200);

        const reapply = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        });

        expect(reapply.status).toBe(400);

    });

    test('Signup request fails if the username is empty', async () => {
        const username = "Harizibam"+Math.random();
        const password ="123456";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password
        });

        expect(response.status).toBe(400);
    });
    
    test('Signin succeed when username and password are correct', async () => {        
        const username = "Harizibam"+Math.random();
        const password = "123456";

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username, 
            password            
        });

        expect(response.status).toBe(200);
        expect(response.data.token).toBeDefined();

    });

    test('Signin fails if the username and password are incorrect' , async () => {
        const username = "Harizibam"+Math.random();
        const password = "123456";

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:"Wronganswer", 
            password            
        });

        expect(response.status).toBe(403);
    });

});

describe("User metadata endpoint", () => {
    let token = "";
    let avatarId = "";

    beforeAll(async() => {
        const username = 'Harizibam'+Math.random();
        const password = "123456";
        
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        });

        token = response.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        },{
            headers:{
                authorization:
            }
        });

    });

} );