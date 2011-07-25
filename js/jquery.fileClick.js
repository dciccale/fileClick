/*!
 * jQuery fileClick Plugin v1.4
 * ----------------------------------------------------------
 * Author: Denis Ciccale (dciccale@gmail.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {
	$.fn.fileClick = function(options) {
			
		// default options
		var o = $.extend({}, $.fn.fileClick.defaults, options);
		
		return this.each(function(i) {
			var container = $(this),
				link = container.find(".jAttachDocument"),
				inputContainer = container.find(".jFileInputContainer"),
				NoAttachments = container.find(".jNoAttachments"),
				FilesList = container.find(".jUploadList");
				
				
				// seteo el tamaño del contenedor del input file para encajar con el elemento disparador
				inputContainer.css({ width: link[0].offsetWidth, height: link[0].offsetHeight });
				
				
				/* **************************
				Guarda la lista de ficheros
				*************************** */
				var Files = {
					FileNames: [],
					Add: function(fileName) { this.FileNames.push(fileName); },
					Remove: function (fileIndex) { this.FileNames.splice(fileIndex-1, 1); },
					Count: function () { return this.FileNames.length; },
					Names: function () { return this.FileNames; }				
				};
				
				
			   /* *****************************************
				Funcion después de seleccionar un fichero
				***************************************** */
				function onSelect() {
					// en opera y en ie agrega todo el path, nos quedamos solo con el nombre del fichero
					var fileName = $(this).val().match(/[^\/\\]+$/)[0];

					// si existe un fichero con el mismo nombre muestro un error
					if (o.ShowAlertMsg && existFile(fileName)) {
						alert(o.AlertMsg);
					}
					// si no lo agrego a la lista
					else {
						addFile(fileName);
					}
					
					// quito la clase de hover del link, porque a veces se queda
					link.removeClass(o.HoverClass);
					
					// creo un nuevo input
					createInput();
				}


				/* ***************************
				Agrega un fichero a la lista
				**************************** */
				function addFile(fileName) {
					var item, inputClone;
					
					// guardo el fichero
					Files.Add(fileName);

					// template local
					item = o.ItemTemplate;

					// reemplazo las variables en el template
					item = item.replace("{FileName}", fileName);

					// cojo el input modifico el id para que sea unico y lo oculto
					inputClone = fileInput.getInstance()
					.unbind('.fileClick')
					.attr({
						"id": o.InputID + i + "_" + Files.Count(),
						"name": o.InputName + i + "[]"
					})
					.css({ top: -3000 });

					// agrego el input file al item
					item = $(item).append(inputClone);
					
					// guardo la referencia al item para poder ser eliminado mas tarde
					$.data(item.find('.jRemoveFile')[0], 'item', item);
					
					// agrego el item
					FilesList.append(item);

					// oculto el item de "no hay documentos adjuntos"
					if (NoAttachments.is(":visible")) {
						NoAttachments.hide();
					}
				}


				/* ***************************
				Quita un fichero de la lista
				**************************** */
				function removeFile() {
					var item = $(this);
					
					// quito el fichero de la lista guardada
					Files.Remove(item.index());

					// quito el item de la lista
					item.remove();

					// si no hay ficheros muestro el item de "no hay documentos adjuntos"
					if (!Files.Count()) {
						NoAttachments.show();
					}
				}


				/* ************************************************
				Evento y Accion que remueve un fichero de la lista
				************************************************* */
				container
				.delegate(o.ItemTag, 'removeFile.fileClick', removeFile)
				.delegate('.jRemoveFile', 'click.fileClick', function (e) {
					e.preventDefault();
					$.data(this, 'item').trigger('removeFile.fileClick');
				});


				/* *************************************************
				Verifica que no haya un fichero con el mismo nombre
				************************************************** */
				function existFile(fileName) {
					var FileNames = Files.Names(), i = Files.Count(), exists = false;
					
					while (i-- && !exists) {
						exists = FileNames[i] == fileName;
					}
					
					return exists;
				}

				
				/* **********************
				Instancia de cada input
				*********************** */
				var fileInput = {
					setInstance: function (elem) { this.newInput = elem; },
					getInstance: function () { return this.newInput; }
				};
				
				
				/* *****************
				Crea el input file
				****************** */
				var createInput = (function () {
				
					function init() {
						// creo el nuevo input
						var newInput = $("<input type='file' class='" + o.InputDefaultClass + "' id='" + o.InputID + i + "' name='" + o.InputName + i + "[]' />");

						// guardo la instancia del input
						fileInput.setInstance(newInput);

						// hago un bind de los eventos
						newInput
						// clase de hover para el link
						.bind('mouseover.fileClick mouseout.fileClick',
							function () {
								link.toggleClass(o.HoverClass);
							}
						)
						// evento que se dispara luego de seleccionar un fichero
						.bind('change.fileClick', onSelect);

						// inserto el nuevo input
						inputContainer.html(newInput);
					}
					
					init();
					
					return init;
				})()
		});
	};
	
	
	$.fn.fileClick.defaults = {
		HoverClass: 'jUploadButtonHover',
		ItemTemplate: '<li><a href="#" class="jRemoveFile">X</a>{FileName}</li>',
		InputID: 'InputID',
		InputName: 'Files',
		ItemTag: 'li',
		InputDefaultClass: 'jInputFile',
		ShowAlertMsg: true,
		AlertMsg: 'Ya existe un fichero con ese nombre'
	}
})(jQuery);