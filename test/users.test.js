// ======== User Module Tests ========

require('dotenv').config();
const _ = require('lodash');
const request = require("supertest");
const baseUrl = process.env.BASE_URL;

let expect;
before(async () => {
    const chai = await import('chai'); 
    expect = chai.expect; 
});


describe('Users Module', function() {
    this.timeout(5000);
    const tempName = "Toko TB Sentosa";
    const tempEmail = "sentosa@yahoo.com";
    const invalidEmail = tempEmail.replace('yahoo', '');

    // CREATE USER SCENARIO
    describe('POST /users', function() {

        it('Should return 201 and successfully create a user', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  tempName, email: tempEmail, password: "12345"});
            
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'User berhasil ditambahkan');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('userId');

            if (_.has(res.body, 'data') && _.has(res.body.data, 'userId')) {
                global.userId = res.body.data.userId;
            }
        });

        it('Should return 400 due to email has registered', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  tempName, email: tempEmail, password: "12345"});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', 'Email sudah digunakan');
        });

        it('Should return 400 due to invalid email format', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  tempName, email: invalidEmail, password: "12345"});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"email\" must be a valid email');
        });

        it('Should return 400 due to missing name field', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({email: tempEmail, password: "12345"});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"name\" is required');
        });

        it('Should return 400 due to missing email field', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  tempName, password: "12345"});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"email\" is required');
        });

        it('Should return 400 due to missing password field', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  tempName, email: tempEmail});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"password\" is required');
        });

        it('Should return 400 due to empty value in name field', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  "", email: tempEmail, password: "12345"});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"name\" is not allowed to be empty');
        });

        it('Should return 400 due to empty value in email field', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  tempName, email: "", password: "12345"});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"email\" is not allowed to be empty');
        });

        it('Should return 400 due to empty value in password field', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .post('/users')
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  tempName, email: tempEmail, password: ""});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"password\" is not allowed to be empty');
        });
    });

    // GET USER BY ID SCENARIO
    describe('GET /users/{userId}', function() {
        it('Should return 200 and successfully get by ID', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data.user).to.have.property('id', global.userId);
        });

        it('Should return 404 due to non-existent ID', async function() {
            let invalidId = "6d6c1840-ba23-4ae2-80b4-9999999";

            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users/${invalidId}`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', 'id tidak valid');
        });

        it('Should return 404 due to invalid type of ID', async function() {
            let invalidId = "12345";
            
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users/${invalidId}`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', 'id tidak valid');
        });

        it('Should return 404 due to missing userId parameter', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users/`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', '404');
            expect(res.body).to.have.property('message', 'Not Found');
        });
    });

    // GET ALL USERS SCENARIO
    describe('GET /users', function() {
        it('Should return 200 and successfully get all users', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res).to.have.property('status', 200);
            expect(res.body).to.include({ status: 'success' })
                .and.to.have.nested.property('data.users').that.is.an('array')
                .with.lengthOf.above(0);
        });

        it('Should return 200 and successfully get all users by name', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users?q=${tempName}`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res).to.have.property('status', 200);
            expect(res.body).to.include({ status: 'success' })
                .and.to.have.nested.property('data.users').that.is.an('array')
                .with.lengthOf.above(0);
        });

        it('Should return 200 and successfully get all users by page', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users?p=1`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res).to.have.property('status', 200);
            expect(res.body).to.include({ status: 'success' })
                .and.to.have.nested.property('data.users').that.is.an('array')
                .with.lengthOf.above(0);
        });

        it('Should return 200 and successfully get all users by name & page', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users?q=${tempName}&p=1`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res).to.have.property('status', 200);
            expect(res.body).to.include({ status: 'success' })
                .and.to.have.nested.property('data.users').that.is.an('array')
                .with.lengthOf.above(0);
        });

        it('Should return 200 and show empty users', async function() {
            expect(global.token).to.not.be.empty;

            const res = await request(baseUrl)
                .get(`/users?q=382829919`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res).to.have.property('status', 200);
            expect(res.body).to.include({ status: 'success' })
                .and.to.have.nested.property('data.users').that.is.an('array')
                .with.lengthOf(0);
        });
    });

     // UPDATE USER SCENARIO
     describe('PUT /users', function() {
        let updateName = "Toko Sembako Sentosa";

        it('Should return 201 and successfully update user', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .put(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  updateName, email: tempEmail});
            
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'User berhasil diupdate');
            expect(res.body.data).to.have.property('name', updateName);
        });

        it('Should return 404 due to user not found', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .put(`/users/99999`)
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  updateName, email: tempEmail});
            
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', 'id tidak valid');
        });

        it('Should return 400 due to invalid email', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .put(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`)
                .send({name:  updateName, email: invalidEmail});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"email\" must be a valid email');
        });

        it('Should return 400 due missing name field', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .put(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`)
                .send({ email: tempEmail });
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"name\" is required');
        });

        it('Should return 400 due missing email field', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .put(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`)
                .send({ name: tempName });
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"email\" is required');
        });

        it('Should return 400 due to empty name field', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .put(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`)
                .send({name: "", email: invalidEmail});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"name\" is not allowed to be empty');
        });

        it('Should return 400 due to empty email field', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .put(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`)
                .send({name: tempName, email: ""});
            
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', '\"email\" is not allowed to be empty');
        });
     });

      // DELETE USER BY ID SCENARIO
    describe('DELETE /users/{userId}', function() {
        it('Should return 200 and successfully delete by ID', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .del(`/users/${global.userId}`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'User berhasil dihapus');
        });

        it('Should return 404 due to unknown ID', async function() {
            expect(global.token).to.not.be.empty;
            expect(global.userId).to.not.be.empty;

            const res = await request(baseUrl)
                .del(`/users/9999`)
                .set('Authorization', `Bearer ${global.token}`);
            
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'fail');
            expect(res.body).to.have.property('message', 'id tidak valid');
        });
    });
});
