module.exports = {


  friendlyName: 'Humanized time',


  description: '',


  inputs: {

    oldDate: {
      type: 'number',
      required: true
    },

    newDate: {
      type: 'number',
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {


    //Date Formats must be be ordered smallest -> largest and must end in a format with ceiling of null
    dateFormats = {
      past: [{
        ceiling: 60,
        text: '$seconds seconds ago'
      },
      {
        ceiling: 3600,
        text: '$minutes minutes ago'
      },
      {
        ceiling: 86400,
        text: '$hours hours ago'
      },
      {
        ceiling: 2629744,
        text: '$days days ago'
      },
      {
        ceiling: 31556926,
        text: '$months months ago'
      },
      {
        ceiling: null,
        text: '$years years ago'
      }
      ],
      future: [{
        ceiling: 60,
        text: 'in $seconds seconds'
      },
      {
        ceiling: 3600,
        text: 'in $minutes minutes'
      },
      {
        ceiling: 86400,
        text: 'in $hours hours'
      },
      {
        ceiling: 2629744,
        text: 'in $days days'
      },
      {
        ceiling: 31556926,
        text: 'in $months months'
      },
      {
        ceiling: null,
        text: 'in $years years'
      }
      ]
    };
    //Time units must be be ordered largest -> smallest
    timeUnits = [
      [31556926, 'years'],
      [2629744, 'months'],
      [86400, 'days'],
      [3600, 'hours'],
      [60, 'minutes'],
      [1, 'seconds']
    ];

    date = new Date(inputs.oldDate);
    refDate = inputs.newDate ? new Date(inputs.newDate) : new Date();
    var secondsDifference = (refDate - date) / 1000;

    var tense = 'past';
    if (secondsDifference < 0) {
      tense = 'future';
      secondsDifference = 0 - secondsDifference;
    }

    function getFormat() {
      for (var i = 0; i < dateFormats[tense].length; i++) {
        if (dateFormats[tense][i].ceiling === null || secondsDifference <= dateFormats[tense][i].ceiling) {
          return dateFormats[tense][i];
        }
      }
      return null;
    }

    function getTimeBreakdown() {
      var seconds = secondsDifference;
      var breakdown = {};
      for (var i = 0; i < timeUnits.length; i++) {
        var occurencesOfUnit = Math.floor(seconds / timeUnits[i][0]);
        seconds = seconds - (timeUnits[i][0] * occurencesOfUnit);
        breakdown[timeUnits[i][1]] = occurencesOfUnit;
      }
      return breakdown;
    }

    function renderDate(dateFormat) {
      var breakdown = getTimeBreakdown();
      var timeAgoText = dateFormat.text.replace(/\$(\w+)/g, function () {
        return breakdown[arguments[1]];
      });
      return depluralizeTimeAgoText(timeAgoText, breakdown);
    }

    function depluralizeTimeAgoText(timeAgoText, breakdown) {
      for (var i in breakdown) {
        if (breakdown[i] === 1) {
          var regexp = new RegExp('\\b' + i + '\\b');
          timeAgoText = timeAgoText.replace(regexp, function () {
            return arguments[0].replace(/s\b/g, '');
          });
        }
      }
      return timeAgoText;
    }

    return exits.success(renderDate(getFormat()));


  }


};
