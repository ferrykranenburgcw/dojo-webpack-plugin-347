require('css/style.scss')


define([
  // for the dojo ready code below
  'dojo/ready',
  'dojo/parser',
  // end ready code

  // Static list of all AuditCase widgets that are not referenced by other widgets, and therefore not processed by Dojo webpack
  'ac/dojo/dialogs/PushDialog',

], function (ready, parser) {

  ready(function () {
    parser.parse()
  })
  return {}
})
