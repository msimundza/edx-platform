class @Navigation
  constructor: ->
    if $('#accordion').length
      active = $('#accordion ul:has(li.active)').index('#accordion ul')
      if active < 0
        active = $('#accordion h3.active').index('#accordion h3')
      if active < 0
        active = 0
      $('#accordion').bind('accordionchange', @log).accordion
        active: active
        header: 'h3'
        autoHeight: false
        heightStyle: 'content'
        beforeActivate: (event, ui) ->
          `var currContent`
          `var currHeader`
          if ui.newHeader[0]
            currHeader = ui.newHeader
            currContent = currHeader.next('.ui-accordion-content')
          else
            currHeader = ui.oldHeader
            currContent = currHeader.next('.ui-accordion-content')
          isPanelSelected = currHeader.attr('aria-selected') == 'true'
          currHeader.toggleClass('ui-corner-all', isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top', !isPanelSelected).attr 'aria-selected', (!isPanelSelected).toString()
          currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e', isPanelSelected).toggleClass 'ui-icon-triangle-1-s', !isPanelSelected
          currContent.toggleClass 'accordion-content-active', !isPanelSelected
          if isPanelSelected
            currContent.slideUp()
          else
            currContent.slideDown()
          false
          # Cancels the default action
      $('#accordion').show()
      $('#accordion .ui-accordion-header').click @setChapter

  log: (event, ui) ->
    Logger.log 'accordion',
      newheader: ui.newHeader.text()
      oldheader: ui.oldHeader.text()

  toggle: ->
    $('.course-wrapper').toggleClass('closed')

  setChapter: ->
    $('#accordion .is-open').removeClass('is-open')
    $(this).closest('.chapter').addClass('is-open')

