import {Helpers} from '../../../src/Utils/Helpers';

import chai = require('chai');
import {MultipartFormSerializer} from "../../../src/Serializers/MultipartFormSerializer";


let expect = chai.expect;


describe('#Utils/Helpers', () => {

	describe('flattenData()', () => {

		it('should flatten simple object', () => {
			let data = {
				numbers: {
					my: {
						number: 1,
					},
					other: 'ten',
				},
				hours: [1, 5],
				word: '',
			};

			expect(Helpers.flattenData(data)).to.be.eql([
				['numbers[my][number]', 1],
				['numbers[other]', 'ten'],
				['hours[]', 1],
				['hours[]', 5],
				['word', null],
			]);
		});

	});

});
