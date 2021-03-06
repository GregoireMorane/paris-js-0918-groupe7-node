const express = require('express');
const router = express.Router();
const models = require("../models");

router.get('/', (req, res) => {
	models.answers_possibilities.findAll()
	.then(data => {
		res.status(200).json(data)
	});
})

router.get('/:id(\\d+)', (req, res) => {
	models.answers_possibilities.findAll({
		where: {
			id : req.params.id
		}
	})
	.then(data => {
		res.status(200).json(data)
	});
});

router.post('/', (req, res) => {
	const {questionId, ...data} = req.body;
	console.log(data);
	const newAnswerPossibility = new models.answers_possibilities(data);
	newAnswerPossibility.save()
		.then(newAnswerPossibility => {
			models.questions.findById(questionId).then(question => question.addAnswers_possibility(newAnswerPossibility));
			res.status(200).send(`AnswerPossibility added at id : ${newAnswerPossibility.id}`);
		})
		.catch(err => {
			res.status(500).send('Cannot add AnswerPossibillity')
		});
});

router.put('/:id(\\d+)', (req, res) => {
	models.answers_possibilities.findById(req.params.id)
	.then(answers_possibilitiesFound => {
		if(answers_possibilitiesFound){
			const data = req.body;
			console.log(data);
			models.answers_possibilities.update(
				data,
				{ where : { id : req.params.id } }
			)
			.then(updatedAnswerPossibility => {
				res.status(200).send(`AnswerPossibility updated at id : ${req.params.id }`);
			});
		}
		else{
			return res.status(404).send(`AnswerPossibility ${req.params.id} does not exist in DB`);
		}
	});
});

router.delete('/:id(\\d+)', (req, res) => {
	models.answers_possibilities.findById(req.params.id)
	.then(answers_possibilitiesFound => {
		if(answers_possibilitiesFound){
			models.answers_possibilities.destroy({
				where : {
					id : req.params.id
				}
			})
			.then(updatedAnswerPossibility => {
				res.status(200).send(`AnswerPossibility deleted at id : ${req.params.id }`);
			})
		}
		else{
			return res.status(404).send(`AnswerPossibility ${req.params.id} does not exist in DB`);
		}
	});
});

module.exports = router;
