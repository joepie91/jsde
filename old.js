




var dragCurrentElement = null;
var dragStartX = 0;
var dragStartY = 0;
var dragCurrentX = 0;
var dragCurrentY = 0;
var dragOriginalX = 0;
var dragOriginalY = 0;
var dragEnabled = false;
var dragMode = 'none';

var mouseX = 0;
var mouseY = 0;

var windowCurrentZ = 1;
var windowList = [];
var windowIterator = 0;

var lastWorkspace = 0;
var currentWorkspace = 0;

var debugEl = null;

$(function(){
	// Initialization function
	$(document).mousemove(function(e){
		mouseX = e.pageX;
		mouseY = e.pageY;
		if(dragEnabled)
		{
			if(dragMode == 'moveWindow')
			{
				dragCurrentX = e.pageX - dragStartX;
				dragCurrentY = e.pageY - dragStartY;
				$("span#id1").text("> " + dragCurrentX + ", " + dragCurrentY);
				dragCurrentElement.x = dragOriginalX + dragCurrentX;
				dragCurrentElement.y = dragOriginalY + dragCurrentY;
				if(dragCurrentElement.y < 0)
				{
					dragCurrentElement.y = 0;
				}
				dragCurrentElement.element.css({'left':dragCurrentElement.x+'px','top':dragCurrentElement.y+'px'});
				$("span#id2").html(dragOriginalX + ", " + dragOriginalY + "<br>" + dragCurrentElement.x + ", " + dragCurrentElement.y);
			}
			else if(dragMode == 'resizeWindow')
			{
				var dragNewX, dragNewY;
				dragCurrentX = e.pageX - dragStartX;
				dragCurrentY = e.pageY - dragStartY;
				$("span#id1").text("> " + dragCurrentX + ", " + dragCurrentY);
				dragNewX = dragOriginalX + dragCurrentX;
				dragNewY = dragOriginalY + dragCurrentY;
				
				if(dragCurrentElement.maxWidth != undefined && dragNewX > dragCurrentElement.maxWidth)
				{
					dragNewX = dragCurrentElement.maxWidth;
				}
				if(dragCurrentElement.minWidth != undefined && dragNewX < dragCurrentElement.minWidth)
				{
					dragNewX = dragCurrentElement.minWidth;
				}
				if(dragCurrentElement.maxHeight != undefined && dragNewY > dragCurrentElement.maxHeight)
				{
					dragNewY = dragCurrentElement.maxHeight;
				}
				if(dragCurrentElement.minHeight != undefined && dragNewY < dragCurrentElement.minHeight)
				{
					dragNewY = dragCurrentElement.minHeight;
				}
				
				dragCurrentElement.width = dragNewX;
				dragCurrentElement.height = dragNewY;
				if(dragCurrentElement.y < 0)
				{
					dragCurrentElement.y = 0;
				}
				dragCurrentElement.element.css({'width':dragCurrentElement.width+'px','height':dragCurrentElement.height+'px'});
				$("span#id2").html(dragOriginalX + ", " + dragOriginalY + "<br>" + dragCurrentElement.width + ", " + dragCurrentElement.height);
			}
		}
		else
		{
			$("span#id1").text(dragCurrentX + ", " + dragCurrentY);
		}
	});
	$(document).mouseup(function(){
		if(dragEnabled)
		{
			dragEnabled = false;
			$(document).enableTextSelect();
			dragCurrentElement.element.addClass('window-styled').removeClass('window-dragged');
			$('.workspace-tab-popup').removeClass('workspace-tab-popup');
			debugEl = dragCurrentElement;
		}
	});
	$('#workspace_tab_add').click(function(){
		createWorkspace();
	});
	createWorkspace();  // creates initial workspace
	activateWorkspace(1);
})

function createWindow(x, y, title, contents, width, height, resizable)
{
	if(width === undefined) { var width = 400; }
	if(height === undefined) { var height = 300; }
	var _newWindow = new MDIWindow(x, y, title, contents, width, height, currentWorkspace, resizable);
	$('body').append(_newWindow.element);
	_newWindow.bringToForeground();
	return _newWindow;
}

function createWorkspace()
{
	var newWorkspaceId = lastWorkspace + 1;
	var workspaceHtmlElement = document.createElement('a');
	workspaceHtmlElement.setAttribute('href','#');
	workspaceHtmlElement.setAttribute('id','tab_' + newWorkspaceId);
	var workspaceElement = $(workspaceHtmlElement).addClass('workspace-tab');
	workspaceElement.click(function(){
		activateWorkspace(newWorkspaceId);
	});
	debugEl = workspaceElement;
	$('#workspace-tab-list').append(workspaceElement);
	workspaceElement.html(newWorkspaceId);
	lastWorkspace += 1;
}

function activateWorkspace(id)
{
	currentWorkspace = id;
	$('.workspace-tab-active').removeClass('workspace-tab-active');
	$('#tab_' + id).addClass('workspace-tab-active');
	redrawWindows();
}

function redrawWindows()
{
	$.each($('.window-wrapper'),function(id, element){
		var currentElement = $(element);
		debugEl = windowList[currentElement.children('input.MDIWindowIdentifier')[0].value];
		//alert(windowList[currentElement.children('input.MDIWindowIdentifier')[0].value]);
		var currentWindow = windowList[currentElement.children('input.MDIWindowIdentifier')[0].value];
		if(currentWindow.assignedWorkspace == currentWorkspace)
		{
			currentElement.css({display: 'block'});
		}
		else
		{
			currentElement.css({display: 'none'});
		}
	});
}

function MDIWindow(x, y, title, contents, width, height, workspace, resizable)
{
	this.x = x;
	this.y = y;
	this.title = title;
	this.contents = contents;
	this.width = width;
	this.height = height;
	this.minWidth = undefined;
	this.minHeight = undefined;
	this.maxWidth = undefined;
	this.maxHeight = undefined;
	this.windowId = windowIterator;
	
	if(resizable == undefined)
	{
		this.resizable = true;
	}
	else
	{
		this.resizable = resizable;
	}
	
	if(workspace == undefined)
	{
		this.assignedWorkspace = 1;
	}
	else
	{
		this.assignedWorkspace = workspace;
	}
	
	var parentMDIWindow = this;
	
	var _wrapper = $(document.createElement('div')).addClass('window-wrapper').addClass('window-styled').css({'top':y+'px', 'left':x+'px', 'width':width+'px', 'height':height+'px'});
	var _titlebar = $(document.createElement('div')).addClass('window-title').html(title);
	var _close = $(document.createElement('div')).addClass('window-close').html('<a href="#">X</a>');
	var _outer = $(document.createElement('div')).addClass('window-outer');
	var _inner = $(document.createElement('div')).addClass('window-inner').html(contents);
	var _identifier = document.createElement('input');
	var _resizer = $(document.createElement('div')).addClass('window-resizer');
	
	_identifier.setAttribute('type', 'hidden');
	_identifier.setAttribute('name', 'MDIWindowIdentifier');
	_identifier.setAttribute('value', windowIterator);
	_identifier = $(_identifier).addClass('MDIWindowIdentifier');
	
	_titlebar.mousedown(function(){
		parentMDIWindow.bringToForeground();
	});
	
	_outer.mousedown(function(){
		parentMDIWindow.bringToForeground();
	});
	
	_close.children("a").click(function(){
		parentMDIWindow.close();
	});
	
	_titlebar.append(_close);
	_outer.append(_inner);
	
	if(this.resizable == true)
	{
		_outer.append(_resizer);
	}
	
	_wrapper.append(_titlebar).append(_outer).append(_identifier);
	
	this.element = _wrapper;
	
	this.bringToForeground = function(){
		this.element.css('z-index',windowCurrentZ);
		windowCurrentZ += 1;
		return this;
	}
	
	this.startDrag = function(){
		$('.workspace-tab').addClass('workspace-tab-popup');
		dragCurrentElement = this;
		$(document).disableTextSelect();
		this.element.removeClass('window-styled').addClass('window-dragged');
		dragOriginalX = this.x;
		dragOriginalY = this.y;
		dragStartX = mouseX;
		dragStartY = mouseY;
		dragMode = 'moveWindow';
		dragEnabled = true;
	}
	
	this.startResize = function(){
		dragCurrentElement = this;
		$(document).disableTextSelect();
		this.element.removeClass('window-styled').addClass('window-dragged');
		dragOriginalX = this.width;
		dragOriginalY = this.height;
		dragStartX = mouseX;
		dragStartY = mouseY;
		dragMode = 'resizeWindow';
		dragEnabled = true;
	}
	
	this.close = function(){
		windowList[this.windowId] = null;
		$(this.element).remove();
	}
	
	debugEl = this.element.children('.window-title');
	var thisElement = this;
	this.element.children('.window-title').mousedown(function(){thisElement.startDrag();});
	this.element.find('.window-resizer').mousedown(function(){thisElement.startResize();});
	
	windowList[windowIterator] = this;
	windowIterator += 1;
}
