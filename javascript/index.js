(function() {
  var clear, load, projects, show;

  load = {
    project: function(title) {
      var doc, listItem, project, _i, _len, _ref;
      project = projects[title];
      $('header div').fadeOut();
      $('nav').fadeIn();
      $('nav h2').text(project.title);
      _ref = project.docs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        doc = _ref[_i];
        listItem = $('<li>', {
          "class": 'animate'
        });
        listItem.append($('<a>', {
          href: doc.link,
          target: '_blank',
          text: doc.title
        }));
        $('nav ul').append(listItem);
      }
      $('nav *').removeClass('offRight offLeft');
      $('nav div').hover((function() {
        return $('nav ul').show();
      }), (function() {
        return $('nav ul').hide();
      }));
      return project.init();
    }
  };

  clear = {
    projects: function() {
      return $('.project-list').addClass('offLeft');
    },
    displays: function() {
      $('header div').fadeIn();
      $('nav').fadeOut();
      $('.display').addClass('offRight');
      return $('.back').addClass('offLeft').promise().done(function() {
        $('nav *').addClass('offRight');
        return window.location.href = 'http://phenomnomnominal.github.com/';
      });
    }
  };

  show = {
    projects: function() {
      return $('.project').show().delay(1000).promise().done(function() {
        return $('.project').removeClass('offLeft');
      });
    }
  };

  projects = {
    tuner: {
      init: function() {
        return $('.tuner').show().delay(1000).promise().done(function() {
          $('.tuner').removeClass('offRight');
          return Tuner();
        });
      },
      docs: [
        {
          link: 'docs/tuner.html',
          title: 'tuner.coffee'
        }
      ],
      title: 'PURE JAVASCRIPT GUITAR TUNER'
    }
  };

  $(function() {
    show.projects();
    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    })();
    $('.project').click(function() {
      clear.projects();
      return load.project($(this).attr('id'));
    });
    return $('.back').click(function() {
      clear.displays();
      return show.projects();
    });
  });

}).call(this);
