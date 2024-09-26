// ======== Authentication Module Tests ========
require('dotenv').config();
const _ = require('lodash');
const request = require("supertest");

let expect;
before(async () => {
    const chai = await import('chai'); 
    expect = chai.expect; 
});

const baseUrl = process.env.BASE_URL;
const email = "nando3@gmail.com";

describe('Authentication login testing', function() {
  this.timeout(10000);
  
  it('should return 201 and success login authentication', async function() { 
    const res = await registerAndAuthenticate(email);

    expect(res.status).to.equal(201); 
    expect(res.body).to.have.property('status', 'success'); 
    expect(res.body).to.have.property('message', 'Authentication berhasil ditambahkan'); 
    expect(res.body.data).to.have.property('user'); 
    expect(res.body.data.user.email).to.equal(email);

    if (_.has(res.body, 'data')) {
      global.token = res.body.data.accessToken;
      global.refreshToken = res.body.data.refreshToken;
    }
  });
});

async function registerAndAuthenticate(email) {
  try {

    const reg = await request(baseUrl)
      .post('/registration')
      .send({ name: "Toko Sembako Mukhti" ,email, password: "12345" });

    const res = await request(baseUrl)
      .post('/authentications')
      .send({ email, password: "12345" });

    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


