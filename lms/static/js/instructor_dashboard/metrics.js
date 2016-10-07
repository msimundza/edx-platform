(function() {
  var Metrics, plantTimeout, statusAjaxError;

  plantTimeout = function() {
    return window.InstructorDashboard.util.plantTimeout.apply(this, arguments);
  };

  statusAjaxError = function() {
    return window.InstructorDashboard.util.statusAjaxError.apply(this, arguments);
  };

  Metrics = (function() {

    function Metrics($section) {
      this.$section = $section;
      this.$section.data('wrapper', this);
    }

    Metrics.prototype.onClickTitle = function() {};

    return Metrics;

  })();

  if (typeof _ !== "undefined" && _ !== null) {
    _.defaults(window, {
      InstructorDashboard: {}
    });
    _.defaults(window.InstructorDashboard, {
      sections: {}
    });
    _.defaults(window.InstructorDashboard.sections, {
      Metrics: Metrics
    });
  }

}).call(this);
