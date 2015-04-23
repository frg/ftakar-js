# Ftakar [![Code Climate](https://codeclimate.com/github/frg/ftakar-js/badges/gpa.svg)](https://codeclimate.com/github/frg/ftakar-js)
### A jQuery plugin that saves input data using Local Storage

## Version
### **THIS PLUGIN IS STILL IN DEVELOPMENT

##
Ftakar is a small jQuery plugin that I decided to implement as extra functionality to my projects. Even though the plugin idea is simple it adds a considerable amount to the traditional html forms.

The plugin is in its very early stages of implementation therefore here's my ToDo list up front.

## Todo
 - Write Tests
 - Fix interval save
 - Implement checkbox save
 - Implement radio button save
 - Save data in form domains
 - Save forms within url domains

##  Installation
Until another major version is committed script file is within 'sauce/js/script.js'

##  Usage
1. Import jQuery
2. ~~Import ftakar-js.js~~
2. *For the moment please import as instructed in **Installation***
3. '$('input').ftakar();'

Example:
```sh
<form>
    <input type="text" name="firstname" id="sqphy">
    <input type="radio" name="sex" value="male" checked="" id="yzath">Male
    <input type="radio" name="sex" value="female" id="ktpwl">Female
    <input type="checkbox" name="vehicle" value="Bike" id="atrpf">I have a bike
    <input type="checkbox" name="vehicle" value="Car" id="sivcy">I have a car
    <input type="date" name="bday" id="mdqgm"
    <input type="color" name="favcolor" id="ljwon">
    <input type="submit" value="Submit" id="kiibp">
</form>
```

```sh
$('input').ftakar({
    saveOnChange: true,
    clearOnSubmit: true
});
```

## API

### Options
Possible options:
* `saveOnChange` – save when element has changed as defined by the jQuery "change" event – *boolean*: `true`
* `clearOnSubmit` – when the closest parent form is submitted the element data will be deleted – *boolean*: `true`
* `idAttribs` - when defined the plugin will search for the the first valid id before going onto the next - *array*: `['id', 'name', 'data-ftakar']`
* `beforeSave` – function called before save of every element – *function*: `function(){}`
* `onSave` – function called after save of every element – *function*: `function(){}`
* `beforeDelete` – function called before delete of every element – *function*: `function(){}`
* `onDelete` – function called after delete of every element – *function*: `function(){}`
* `beforeLoad` – function called before plugin is loaded – *function*: `function(){}`
* `onLoad` – function called after plugin is loaded – *function*: `function(){}`

## Compatibility

### Browsers
As long as the browser is compatibile with HTML5 Storage API, plugin works fine.

* Chrome 31+
* Firefox 35+
* Safari 7.1+
* Opera 27+
* IE 11+
* iOS Safari 7.1+
* Opera Mini (Not Supported)
* Android Browser 37+
* Chrome for Android 40+

## License
MIT
