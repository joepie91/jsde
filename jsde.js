/**
 * .disableTextSelect - Disable Text Select Plugin
 *
 * Version: 1.1
 * Updated: 2007-11-28
 *
 * Used to stop users from selecting text
 *
 * Copyright (c) 2007 James Dempster (letssurf@gmail.com, http://www.jdempster.com/category/jquery/disabletextselect/)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 **/

/**
 * Requirements:
 * - jQuery (John Resig, http://www.jquery.com/)
 **/
(function($){if($.browser.mozilla){$.fn.disableTextSelect=function(){return this.each(function(){$(this).css({"MozUserSelect":"none"})})};$.fn.enableTextSelect=function(){return this.each(function(){$(this).css({"MozUserSelect":""})})}}else{if($.browser.msie){$.fn.disableTextSelect=function(){return this.each(function(){$(this).bind("selectstart.disableTextSelect",function(){return false})})};$.fn.enableTextSelect=function(){return this.each(function(){$(this).unbind("selectstart.disableTextSelect")})}}else{$.fn.disableTextSelect=function(){return this.each(function(){$(this).bind("mousedown.disableTextSelect",function(){return false})})};$.fn.enableTextSelect=function(){return this.each(function(){$(this).unbind("mousedown.disableTextSelect")})}}}})(jQuery)

/* JSDE code starts here */

var next_z_index = 1;
var currently_dragged_window = null;
var currently_dragging = true;

function JsdeWindow(options)
{
	$.extend(this, options);
	
	this._outer = $("#templates .template_window").clone()[0];
	this._inner = $(this._outer).children(".window-inner")[0];
	this._title = $(this._outer).children(".window-title")[0];
	
	if(typeof options.visible !== "undefined" && options.visible == false)
	{
		this.Hide();
	}
	
	if(typeof options.title !== "undefined")
	{
		this.SetTitle(options.title);
	}
	
	if(typeof options.contents !== "undefined")
	{
		this.SetContents(options.contents);
	}
	
	if(typeof options.x === "undefined") { this.x = 0; }
	if(typeof options.y === "undefined") { this.y = 0; }
	if(typeof options.width === "undefined") { this.width = 250; }
	if(typeof options.height === "undefined") { this.height = 200; }
	
	this.SetPosition(this.x, this.y);
	this.SetSize(this.width, this.height);
	
	$(this._outer).click(this._HandleClick);
	$(this._outer).mousedown(this._HandleMouseDown);
	$(this._outer).appendTo("body");
}

JsdeWindow.prototype.BringToForeground = function()
{
	this.element.css({"z-index": next_z_index})
	next_z_index++;
	return this;
}

JsdeWindow.prototype.GetContents = function()
{
	return $(this._inner).html();
}

JsdeWindow.prototype.GetTitle = function()
{
	return $(this._title).children(".window-title-inner").html();
}

JsdeWindow.prototype.Hide = function()
{
	this.visible = false;
	return $(this._outer).hide();
}

JsdeWindow.prototype.SetPosition = function(x, y)
{
	this.x = x;
	this.y = y;
	
	return $(this._outer).css({left: this.x, top: this.y});
}

JsdeWindow.prototype.SetSize = function(width, height)
{
	this.width = width;
	this.height = height;
	
	return $(this._outer).css({width: this.width, height: this.height});
}

JsdeWindow.prototype.SetContents = function(html)
{
	return $(this._inner).html(html);
}

JsdeWindow.prototype.SetTitle = function(html)
{
	return $(this._title).children(".window-title-inner").html(html);
}

JsdeWindow.prototype.Show = function()
{
	this.visible = true;
	return $(this._outer).show();
}

JsdeWindow.prototype._HandleClick = function(event)
{
	
}

JsdeWindow.prototype._HandleMouseDown = function(event)
{
	
}

JsdeWindow.prototype._HandleMouseUp = function(event)
{
	
}
