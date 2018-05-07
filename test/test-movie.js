const express = require('express');
const app = express();
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Testing the root', function(){
	it('should access the root', function(){
		// Chai is returned to use the testing framework? Is "testing framework" the correct term?
		return chai.request('http://localhost:8080')
		// Accessing root route
		.get('/')
		// Expecting a status of 200 when route is reached?
		.then(function(res){
			expect(res).to.have.status(200);
		}).catch((err) => {
			console.log(err);
		});
	});
});
