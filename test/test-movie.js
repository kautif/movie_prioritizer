const app = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Testing route access', function(){
	it('should access the root', function(){
		// Chai is returned to use the testing framework? Is "testing framework" the correct term?
		return chai.request(app)
		// Accessing root route
		.get('/')
		// Expecting a status of 200 when route is reached?
		.then(function(res){
			expect(res).to.have.status(200);
		}).catch((err) => {
			console.log(err);
		});
	});

	it('should access the signup', function(){
		// Chai is returned to use the testing framework? Is "testing framework" the correct term?
		return chai.request(app)
		// Accessing root route
		.get('/pages/signup.html')
		// Expecting a status of 200 when route is reached?
		.then(function(res){
			expect(res).to.have.status(200);
		}).catch((err) => {
			console.log(err);
		});
	});

	it('should access the dashboard', function(){
		// Chai is returned to use the testing framework? Is "testing framework" the correct term?
		return chai.request(app)
		// Accessing root route
		.get('/pages/dashboard.html')
		// Expecting a status of 200 when route is reached?
		.then(function(res){
			expect(res).to.have.status(200);
		}).catch((err) => {
			console.log(err);
		});
	});
});
