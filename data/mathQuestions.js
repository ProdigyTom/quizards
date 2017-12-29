
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
    points: 5,
    question: "What is 2 + 3?",
    choices: [
        '5',
        '6',
        '-5',
        'elephant'
    ]
},{
    points: 10,
    question: "Who invaded Spain in the 8th century AD?",
    choices: [
        'Moors',
        'The Moops',
        'Julius Caeser',
        'Orange Julius'
    ]
},{
    points: 10,
    question: "Which brothers hold the NHL record for most career points?",
    choices: [
        'The Gretzkys',
        'The Sittlers',
        'The Domis',
        'The Espositos'
    ]
},{
    points: 10,
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
