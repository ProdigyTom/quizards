
// WHEN CREATING QUESTIONS AND ANSWERS ...
// The correct answer must be the first choice (keepin' it simple).
// Choices will be presented in random order.
// points is optional, defaults to 10 if not specified.
var mathQuestions = [{
    points: 10,
    question: "What is the capital of Canada?",
    choices: [
        'Ottawa',
        'Washington D.C.',
        'Toronto',
        'London'
    ]
},{
    points: 20,
    question: "Who came up with the modern periodic table?",
    choices: [
        'Dmitri Mendeleev',
        'Albert Einstein',
        'Enrico Fermi',
        'Richard Feynman'
    ]
},{
    question: "Who was the first person to ever win 2 nobel prizes?",
    choices: [
        'Marie Curie',
        'Isaac Newton',
        'Niels Bohr',
        'Linus Pauling'
    ]
},{
    question: "Which company is the 9th fastest growing startup in canada?",
    choices: [
        'Prodigy',
        'IBM',
        'Facebook',
        'CompuGlobalHyperMegaNet'
    ]
},{
    question: "What is the capital of Ontario?",
    text: true,
    choices: ['toronto']
},
];

if (typeof module == 'object') {
    module.exports = mathQuestions;
}
