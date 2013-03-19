/*!
 * jQuery fileClick Plugin 1.5
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
 */
(function ($) {
  $.fn.fileClick = function (options) {

    // default options
    var o = $.extend({}, $.fn.fileClick.defaults, options);

    return this.each(function (i) {
      var container = $(this),
        link = container.find('.fc-attach-btn'),
        inputContainer = container.find('.fc-input-container'),
        noAttachments = container.find('.fc-no-attachments'),
        filesList = container.find('.fc-upload-list');

        // set container size to match the fake button size
        inputContainer.css({ width: link[0].offsetWidth, height: link[0].offsetHeight });

        // files list
        var Files = {
          fileNames: [],
          add: function (fileName) {
            this.fileNames.push(fileName);
          },
          remove: function (fileIndex) {
            this.fileNames.splice(fileIndex-1, 1);
          }
        };


        // when selecting a file
        function onSelect() {
          // opera and ie use a full fake path, strip it
          var fileName = $(this).val().match(/[^\/\\]+$/)[0];

          // show duplicat file error message
          if (o.allowDuplicates && existFile(fileName)) {
            alert(o.alertMsg);

          // add the file to the list
          } else {
            addFile(fileName);
          }

          // force removing hover class from the link
          link.removeClass(o.hoverClass);

          // create a new input
          createInput();
        }

        // adds a file to the list
        function addFile(fileName) {
          var item, inputClone;

          // save the file in the list object
          Files.add(fileName);

          // local template
          item = o.itemTemplate;

          // replace tmpl vars
          item = item.replace('{FileName}', fileName);

          // make cloned input id unique and hide it
          inputClone = fileInput.getInstance()
            .unbind('.fc')
            .attr({
              'id': o.inputID + i + '_' + Files.fileNames.length,
              'name': o.inputName + i + '[]'
            })
            .css({ top: -3000 });

          // agrego el input file al item
          item = $(item).append(inputClone);

          // guardo la referencia al item para poder ser eliminado mas tarde
          $.data(item.find('.fc-rm-btn')[0], 'item', item);

          // agrego el item
          filesList.append(item);

          // oculto el item de 'no hay documentos adjuntos'
          if (noAttachments.is(':visible')) {
            noAttachments.hide();
          }
        }

        // removes a file from the list
        function removeFile() {
          var item = $(this);

          // remove from object
          Files.remove(item.index());

          // remove from list
          item.remove();

          // if no files, show a message
          if (!Files.fileNames.length) {
            noAttachments.show();
          }
        }

        // removes a file from the list
        container
        .delegate(o.itemTag, 'removeFile.fc', removeFile)
        .delegate('.fc-rm-btn', 'click.fc', function (ev) {
          ev.preventDefault();
          $.data(this, 'item').trigger('removeFile.fc');
        });

        // check duplicated file
        function existFile(fileName) {
          var fileNames = Files.fileNames,
            i = fileNames.length,
            exists = false;

          while (i-- && !exists) {
            exists = fileNames[i] == fileName;
          }

          return exists;
        }

        // instance of actual input
        var fileInput = {
          setInstance: function (elem) { this.newInput = elem; },
          getInstance: function () { return this.newInput; }
        };

        // creates an input file
        var createInput = (function () {

          function init() {
            // create a new input
            var newInput = $('<input type="file" class="' + o.inputDefaultClass + '" id="' + o.inputID + i + '" name="' + o.inputName + i + '[]" />');
            newInput.bind('mouseover.fc mouseout.fc',
              function () {
                link.toggleClass(o.hoverClass);
              }
            )
            // evento que se dispara luego de seleccionar un fichero
            .bind('change.fc', onSelect);

            // inserto el nuevo input
            inputContainer.html(newInput);

            // save instance
            fileInput.setInstance(newInput);
          }

          init();

          return init;
        })()
    });
  };


  $.fn.fileClick.defaults = {
    hoverClass: 'fc-upload-btn-hover',
    itemTemplate: '<li><a href="#" class="fc-rm-btn">X</a>{FileName}</li>',
    inputID: 'inputID',
    inputName: 'files',
    itemTag: 'li',
    inputDefaultClass: 'fc-file-input',
    allowDuplicates: false,
    duplicatesMessage: 'File already added'
  }
})(jQuery);
