/**
 * An AngularJS module exporting a basic object/value validation service
 *
 * @author Ryan Albon <ryan@honkmobile.com>
 */
;(function (angular) {
  'use strict';

  var validation = angular.module('hm.lib.validation', []);

  function validationFactory($q) {
    return {
      /**
       * Accepts a value, and an array of validator
       * objects to execute against the given value.
       * Each validator object looks like so:
       *
       * {
       *  name: 'some name',
       *  valueGenerator: function,
       *  condition: function,
       *  predicate: function,
       *  error: 'some error value'
       * }
       */
      validate: function (value, validators) {
        var deferred = $q.defer(),
            errors   = _getErrors(value, validators);

        errors.length < 1 ? deferred.resolve(value)
                          : deferred.reject(_toObject(errors));

        return deferred.promise;
      },
    };
  }

  validationFactory.$inject = ['$q'];

  function _getErrors(value, validators) {
    return validators.map(_getError(value)).filter(_isNotFalse);
  }

  function _getError(value) {
    return function (validator) {
      if (validator.conditions && !validator.conditions(value)) {
        return false;
      }

      if (validator.predicate(validator.valueGenerator(value))) {
        return false;
      }

      return {
        name: validator.name,
        error: validator.error,
      }
    };
  }

  function _toObject(errors) {
    var result = {};

    errors.forEach(function (e) {
      result[e.name] = e.error;
    });

    return result;
  }

  function _isNotFalse(value) {
    return value !== false;
  }

  validation.factory('hm.lib.validation.Validation', validationFactory);
})(window.angular);
