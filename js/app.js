/*global Backbone */
var app = app || {};

$(function(){

    app.QuestionModel = Backbone.Model.extend({});

    app.question = new app.QuestionModel();


    app.AnswerModel = Backbone.Model.extend({});

    app.answer = new app.AnswerModel();

    app.EndModel = Backbone.Model.extend({});

    app.end = new app.EndModel();

    // AppView is top-level piece of UI
    app.AppView = Backbone.View.extend({

        // bind to existing html
        el: $('body'),

        events:{
            "click .leave": "leaveBtnClick",
            "keypress .join input"  : "joinOnEnter",
            "click .join button": "joinBtnClick",
            "click .restart": "restartQuiz"
        },

        initialize: function() {
            this.$input = this.$('.join input');
            this.$players = this.$('.players ol');
            this.questionView = new app.QuestionView();
            this.answerView = new app.AnswerView();
            this.endView = new app.EndView();

            var urlParam = window.location.href.split('?')[1];
            if (urlParam === 'admin=true') {
                $(".admin").show();
            }
        },

        render: function() {
            // nothing changes on re-rendering
        },

        renderPlayers: function(players) {
            var that = this;
            this.$players.html('');
            _.each(players, function(player) {
                var view = new app.PlayerView({ model: player });
                that.$players.append(view.render().el);
            });
        },

        renderQuestionAnswers: function(data) {
            // don't re-render questions unless data contains choices
            if (data.choices) {
                app.question.clear({silent:true}).set(data);
            }
            // in the initial case where player joins and receives answers before a question,
            // answer should not be updated.
            if (app.question.get('question')) {
                app.answer.clear({silent:true}).set(data);
            }
        },

        leaveBtnClick: function() {
            // close socket connection by reloading tab
            if (!confirm('Are you sure you want to leave the Trivia Game?\nYou will loose all your points.')) {
                return;
            }
            window.location = self.location;
            location.reload( true );
        },

        joinOnEnter: function(e) {
            if (e.keyCode == 13) this.joinBtnClick();
        },

        joinBtnClick: function() {
            console.log('joinBtnClick:', this);
            var that = this;
            var playerName = this.$input.val();
            $('.join').hide();

            $('.waitingToJoin').show();
            $('.leave').show();
            $('.playerScores').show();


            this.socket = app.socket = io.connect();
            console.log('io.connect socket:', this.socket);

            this.socket.on('players', function (data) {
                console.log('players updated, data:', data);
                if (data.msg) {
                    $('.playerMsg').html('hi, ' + data.msg + '!');
                }
                that.renderPlayers(data.players);
            });

            this.socket.on('question', function (data) {
                console.log('received question, data: ', data);
                that.renderQuestionAnswers(data);
            });

            this.socket.on('end', function (data) {
                console.log('received end, data: ', data);
                that.answerView.clear();
                that.questionView.clear();
                app.end.set(data);
                that.endView.render();
            });

            this.socket.emit('playerJoin', {
                playerName: playerName
            });
        },

        restartQuiz: function() {
            app.socket.emit('restart');
        },

        clearEnd: function() {
            this.endView.clear();
        }
    });


    app.PlayerView = Backbone.View.extend({

        tagName: 'li',

        // Cache the template function for a single player.
        template: _.template($('#playerTemplate').html()),

        render: function() {
            this.$el.html(this.template(this.model));
            return this;
        }
    });


    app.QuestionView = Backbone.View.extend({

        model: app.question,

        el: $('#questionContainer'),

        template: _.template($('#questionTemplate').html()),

        events:{
            "click .answer": "answerClick"
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            App.clearEnd();

            $('.waitingToJoin').hide();

            var text = this.model.get('text');

            if (text) {
                this.template = _.template($('#questionTemplateInput').html());
            } else {
                this.template = _.template($('#questionTemplate').html());
            }
            // if question string does not exist, clear html
            if (this.model.get('question')) {
                this.$el.html(this.template( { d:this.model.toJSON() } ));
                this.updateProgressBar();
            } else {
                this.$el.html('');
            }
        },

        clear: function() {
            this.$el.html('');
        },

        updateProgressBar: function() {
            var $prog = $('#questionContainer .progress');
            var $bar = $('#questionContainer .bar');
            var now = new Date().getTime();
            var d = this.model.toJSON();
            var pct = Math.floor(100 * (d.endTime - now) / d.totalTime);
            if (pct < 2) {
                pct = 0;
            }
            $bar.width(pct + '%');
            if (pct < 20) {
                $prog.removeClass('progress-info progress-warning').addClass('progress-danger');

            } else if (pct < 40) {
                $prog.removeClass('progress-info').addClass('progress-warning');
            }
            if (pct < 1) {
                // if 0 or negative, no need to update again.
                return;
            }
            var that = this;
            setTimeout(function() {
                that.updateProgressBar();
            }, 100);
        },

        answerClick: function(evt) {
            var answer = this.$el.find(evt.target).html();
            if (this.$el.find('.textAnswer').length !== 0) {
                answer = this.$el.find('.textAnswer')[0].value.toLowerCase();
            }
            var $el = this.$el.find(evt.target);
            console.log('--- answerClick: chose:', answer );

            if (this.$el.find('.myChoice').length > 0) {
                console.log('answerClick: already chose:', this.$el.find('.myChoice').html() );
                return;
            }

            $el.addClass('myChoice');
            app.socket.emit('answer', {
                answer: answer,
                question: this.model.get('question')
            });
        },
    });


    app.AnswerView = Backbone.View.extend({

        model: app.answer,

        el: $('#answerContainer'),

        template: _.template($('#answerTemplate').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            App.clearEnd();
            this.$el.show();
            console.log('app.AnswerView render', this.model.toJSON()    );
            var data = this.model.toJSON();
            data.myChoice = $('#questionContainer .myChoice').html() || '';
            if (data.correctAnswer) {
                this.$el.html(this.template( { d:data } ));
            } else {
                this.$el.html('').hide();
            }
        },

        clear: function() {
            this.$el.html('').hide();
        },
    });

    app.EndView = Backbone.View.extend({

        model: app.end,

        el: $('#endContainer'),

        template: _.template($('#endTemplate').html()),

        events: {
            "click .restart": "restart"
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            $('.waitingToJoin').hide();

            console.log('app.endView render', this.model.toJSON());
            var data = this.model.toJSON();
            this.$el.html(this.template( { d:data } ));
        },

        clear: function() {
            this.$el.html('');
        }
    });

    var App = new app.AppView();
});
