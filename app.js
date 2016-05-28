var Application = {};

(function(Application, $) {

	var _document;
	var _container;
	var _listContainer;
	var _inputField;
	var _taskId = 0;
	
	Application.init = function(document) {
		_document = document;
		_container = $('#main-container');
		_listContainer = $('#main-list-container');
		_inputField = $('#input-new-task');	
		_checkAllCheckBox = $('#check-all');

		_container.click($.proxy(this.containerOnClick, this));
		_container.dblclick($.proxy(this.containerOnDoubleClick, this));
		_inputField.keypress($.proxy(this.inputOnKeyPress, this));
		_checkAllCheckBox.change($.proxy(this.checkAllTasks, this));
	};

	Application.containerOnClick = function(evt) {
		if (evt.target.hasAttribute('data-action')) {
			switch(evt.target.getAttribute('data-action')) {
				case 'check': this.check(evt); break;
				case 'remove-task': this.onTaskRemove(evt); break;
				case 'remove-all-checked': this.removeAllChecked(evt); break;
			}
		}
	};

	Application.containerOnDoubleClick = function(evt) {
		if (evt.target.hasAttribute('data-action')) {
			switch(evt.target.getAttribute('data-action')) {
				case 'task-edit': 
					this.taskEdit(evt); 
					break;
			}
		}
	};

	Application.changeTask = function(taskId, value) {
		$('#'+taskId).find('.list-content-container').text(value);
	};

	Application.taskEdit = function (evt){
		
		var _taskValue = '';
		var taskId = evt.target.getAttribute('data-task-id');
		var taskContent = $('#'+taskId).find('.list-content-container');

		var _taskValue = taskContent.text();
		taskContent.text('');

		//delete previous editing input and restore the task text

		var previousField = $('#task-edit-field');
		if (previousField.length) {
			var previousTaskId = previousField.attr('data-task-id');
			var previousTaskValue = previousField.attr('data-previous-value');
			$('#' + previousTaskId).find('.list-content-container').text(previousTaskValue);
			previousField.remove();
		}

		//create new editing input field
		
		var editTaskField = $('<input id="task-edit-field" class="input-text input-text-edit-task" type="text" placeholder="Press Enter to save or Esc to exit" value="' + _taskValue + '" data-previous-value="' + _taskValue + '" data-task-id="' + taskId + '" maxlength="42">');

		editTaskField.keyup(function(e) {
			if (e.keyCode == 13) {
				taskContent.text(editTaskField.val());
			};
			if (e.keyCode == 27) {
				taskContent.text(_taskValue);
			};
		});
		taskContent.append(editTaskField);

		editTaskField.focus();
	};

	Application.inputOnKeyPress = function(key) {
		if(key.which == 13) {
			this.onTaskCreate(_inputField.val());
			_inputField.val('');
		}
	};

	Application.onTaskCreate = function(task) {
		// TODO: add regex validation
		if (task!='') {
 			var newTaskId = this.nextTaskId();
 			var newTask = $('<div id="' + newTaskId + '" class="list-item list-line-through"><div class="list-checkbox-container"><div class="custom-checkbox"><input type="checkbox"  id="checkbox' + newTaskId + '"  name="" /><label data-action="check" data-task-id="' + newTaskId + '" for="checkbox' + newTaskId + '"></label></div></div><div class="list-content-container" data-action="task-edit" data-task-id="' + newTaskId + '">' + task + '</div><div class="list-delete-task-container"><div class="list-delete-task noselect" data-action="remove-task" data-task-id="' + newTaskId + '">+</div></div></div>');
 			var deleteButton = newTask.find('[data-action="remove-task"]');
 			var checkbox = newTask.find('[type="checkbox"]');
 			deleteButton.hide();
 			checkbox.change($.proxy(this.strikeOutCheckedTasks, this));
 			newTask.mouseenter(function() {
					deleteButton.show();
				})
				.mouseleave(function() {
					deleteButton.hide();
				});
			_listContainer.append(newTask);
 		}
 	};

	Application.onTaskRemove = function(evt) {
		$('#' + $(evt.target).attr('data-task-id')).remove();
	};

	Application.strikeOutCheckedTasks = function() {
		$('.list-item:has([type="checkbox"])').find('.list-content-container').removeClass('list-line-through');
		$('.list-item:has([type="checkbox"]:checked)').find('.list-content-container').addClass('list-line-through');
	};

	Application.check = function(evt) {
		var taskId = $(evt.target).attr('data-task-id');
		var checkbox = $('#checkbox'+taskId);

		checkbox.change();
	};

	Application.checkAllTasks = function(evt) {
		var _checkAllLabel    = $('[for="check-all"');
		if (_checkAllCheckBox.prop('checked')) {
			_listContainer.find('[type="checkbox"]').prop('checked', true).change();
			_checkAllLabel.text('Uncheck All');
		} else {
			_listContainer.find('[type="checkbox"]').prop('checked', false).change();	
			_checkAllLabel.text('Check All');
		}
	};

	Application.removeAllChecked = function(evt) {
		$('.list-item:has([type="checkbox"]:checked)').remove();
		_checkAllCheckBox.prop('checked', false).change();
	};

	Application.nextTaskId = function() {
		return 'task'+_taskId++;
	};

})(Application, jQuery);