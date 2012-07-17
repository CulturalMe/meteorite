var _ = require('underscore');
var assert = require('assert');
var Meteorite = require('../../lib/meteorite');
var Dependencies = require('../../lib/dependencies/dependencies');

require('./package_mock');

describe('Dependencies object', function() {
  describe('with no packages specified', function() {
    var dependencies;
    before(function() {
      dependencies = new Dependencies('/', {});
    });
    
    it('should have an empty basePackages object', function() {
      assert.ok(_.isEmpty(dependencies.basePackages));
    });
    
    it('should resolve', function(done) {
      dependencies.resolve(done);
    });
    
    it('should have an empty packages object after resolving', function(done) {
      dependencies.resolve(function() {
        assert.ok(_.isEmpty(dependencies.packages));
        done();
      });
    });
  });
  
  describe('with a single package specified with no dependencies', function() {
    var dependencies;
    before(function() {
      dependencies = new Dependencies('/', {'mrt-test-pkg1': {
        "git": "https://github.com/possibilities/mrt-test-pkg1.git"
      }});
    });
    
    it('should have the package in the basePackages object', function() {
      assert.ok(_.isEqual(['mrt-test-pkg1'], _.keys(dependencies.basePackages)));
    });
    
    it('should resolve', function(done) {
      dependencies.resolve(done);
    });
    
    it('should have an single-package packages object after resolving', function(done) {
      dependencies.resolve(function() {
        assert.ok(_.isEqual(['mrt-test-pkg1'], _.keys(dependencies.packages)));
        done();
      });
    });
  });
  
  describe('with a single package specified with a dependency', function() {
    var dependencies;
    before(function() {
      dependencies = new Dependencies('/', {'mrt-test-pkg2': {
        "git": "https://github.com/possibilities/mrt-test-pkg2.git"
      }});
    });
    
    it('should have the package in the basePackages object', function() {
      assert.ok(_.isEqual(['mrt-test-pkg2'], _.keys(dependencies.basePackages)));
    });
    
    it('should resolve', function(done) {
      dependencies.resolve(done);
    });
    
    it('should have an two packages after resolving', function(done) {
      dependencies.resolve(function() {
        assert.ok(_.isEqual(['mrt-test-pkg2', 'mrt-test-pkg1'], _.keys(dependencies.packages)));
        done();
      });
    });
  });
  
  describe('with two packages specified that clash', function() {
    var dependencies;
    before(function() {
      dependencies = new Dependencies('/', {
        'mrt-test-pkg1': {
          "git": "https://github.com/tmeasday/mrt-test-pkg2.git"
        },
        'mrt-test-pkg2': { // depends on possibilities' version
          "git": "https://github.com/possibilities/mrt-test-pkg2.git"
        }
      });
    });
    
    it('should have the package in the basePackages object', function() {
      assert.ok(_.isEqual(['mrt-test-pkg1', 'mrt-test-pkg2'], _.keys(dependencies.basePackages)));
    });
    
    it('should fail to resolve', function() {
      // FIXME: I'm not sure how async errors are handled. 
      // This isn't actually async however (as we fake out network connections)
      assert.throws(function() {
        dependencies.resolve();
      });
    });
  });
  
});
