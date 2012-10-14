/* Based off of https://github.com/larrymyers/jasmine-reporters/ */
/*global phantom:false, jasmine:false*/


(function() {
  "use strict";

  /**
   * Basic reporter that outputs spec results to the browser console.
   * Useful if you need to test an html page and don't want the TrivialReporter
   * markup mucking things up.
   *
   * Usage:
   *
   * jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
   * jasmine.getEnv().execute();
   */
  function ConsoleReporter() {
    this.started = false;
    this.finished = false;
  }

  ConsoleReporter.prototype = {
    buffer : '',
    reportRunnerResults: function(runner) {
      var dur = (new Date()).getTime() - this.start_time;
      var failed = this.executed_specs - this.passed_specs;
      var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
      var fail_str = failed + (failed === 1 ? " failure in " : " failures in ");

      this.log("Runner Finished.");
      phantom.sendMessage('writeln', spec_str + fail_str + (dur/1000) + "s.");
      this.finished = true;
      phantom.sendMessage( 'jasmine.done.ConsoleReporter' );
    },
    reportRunnerStarting: function(runner) {
      this.started = true;
      this.start_time = (new Date()).getTime();
      this.executed_specs = 0;
      this.passed_specs = 0;
      this.log("Runner Started.");
    },

    reportSpecResults: function(spec) {
      var resultText = "Failed.";

      if (spec.results().passed()) {
        this.passed_specs++;
        resultText = "Passed.";
      }


      var results = spec.results();
      var items = results.getItems();
      phantom.sendMessage('verbose',this.buffer + resultText);
      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (item.type === 'log') {
          this.log(item.toString());
        } else if (item.type === 'expect' && item.passed && !item.passed()) {
          phantom.sendMessage('console',this.buffer + resultText);
          phantom.sendMessage('onError', item.message, item.trace);
        }
      }

      phantom.sendMessage( 'jasmine.testDone', results.totalCount, results.passedCount, results.failedCount, results.skipped );
    },

    reportSpecStarting: function(spec) {
      this.executed_specs++;
      this.buffer = spec.suite.description + ' : ' + spec.description + ' ... ';
    },

    reportSuiteResults: function(suite) {
      var results = suite.results();
      this.log(suite.description + ": " + results.passedCount + " of " + results.totalCount + " passed.");
    },

    log: function(str) {
      phantom.sendMessage('verbose',str);
    }
  };

  jasmine.reporters = jasmine.reporters || {};
  // export public
  jasmine.reporters.ConsoleReporter = ConsoleReporter;
  jasmine.getEnv().addReporter( new ConsoleReporter() );
}());
