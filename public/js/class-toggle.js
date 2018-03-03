/**
 * How to Use:
 *
 * <button
 *   data-class-toggle-class="is-shown"
 *   data-class-toggle-event="click"
 *   data-class-toggle-target="#info"
 * >Show Info</button>
 *
 * <div id="info"></div>
 */
(function setUpClassToggles() {
  var classToggles = document.querySelectorAll('[data-class-toggle-target][data-class-toggle-class]');
  var i;
  var eventIndex;
  var events;

  function handleEvent(event) {
    var selector = event.currentTarget.getAttribute('data-class-toggle-target');
    var className = event.currentTarget.getAttribute('data-class-toggle-class');
    var target = document.querySelector(selector);

    if (target && 'classList' in target) {
      target.classList.toggle(className);
    }
  }

  for (i = 0; i < classToggles.length; i++) {
    events = (classToggles[i].getAttribute('data-class-toggle-event') || 'click').split(' ');

    for (eventIndex = 0; eventIndex < events.length; eventIndex++) {
      classToggles[i].addEventListener(events[eventIndex], handleEvent);
    }
  }
})();
